import { UserSessionRepository } from '../../../database/src/repositories/user-session.repository';
import { OrganizationMemberRepository } from '../../../database/src/repositories/organization-member.repository';
import { UserRepository } from '../../../database/src/repositories/user-repository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../../auth/src/jwt';
import { SessionData, CreateUserSession } from '../../../types/src/schemas/user-session';
import { Request } from 'express';
import crypto from 'crypto';

export class SessionService {
  /**
   * Create a new session for a user
   */
  static async createSession(
    userId: number,
    deviceInfo: {
      deviceId?: string;
      deviceName?: string;
      ipAddress?: string;
      userAgent?: string;
    } = {}
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    sessionData: SessionData;
    expiresIn: number;
  }> {
    // Get user information
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenHash = UserSessionRepository.hashRefreshToken(refreshToken);

    // Get user's organizations and roles
    const sessionData = await this.buildSessionData(userId);

    // Set expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create session in database
    const sessionDataToSave: CreateUserSession = {
      user_id: userId,
      refresh_token_hash: refreshTokenHash,
      session_data: sessionData,
      device_id: deviceInfo.deviceId,
      device_name: deviceInfo.deviceName,
      ip_address: deviceInfo.ipAddress,
      user_agent: deviceInfo.userAgent,
      expires_at: expiresAt
    };

    const session = await UserSessionRepository.create(sessionDataToSave);

    // Generate JWT tokens
    const accessToken = generateAccessToken({
      userId: user.id.toString(),
      email: user.email
    });

    const jwtRefreshToken = generateRefreshToken({
      userId: user.id.toString(),
      tokenId: session.uuid
    });

    return {
      accessToken,
      refreshToken: jwtRefreshToken,
      sessionData,
      expiresIn: 15 * 60 // 15 minutes in seconds
    };
  }

  /**
   * Refresh an access token using a refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);
      
      // Find session in database
      const session = await UserSessionRepository.findByUuid(payload.tokenId);
      if (!session || session.status !== 'ACTIVE' || !session.is_active) {
        throw new Error('Invalid or expired session');
      }

      // Check if session is expired
      if (new Date() > new Date(session.expires_at)) {
        await UserSessionRepository.revokeSession(session.id);
        throw new Error('Session expired');
      }

      // Get user
      const user = await UserRepository.findById(parseInt(payload.userId));
      if (!user) {
        throw new Error('User not found');
      }

      // Update last activity
      await UserSessionRepository.updateLastActivity(session.id);

      // Generate new access token
      const accessToken = generateAccessToken({
        userId: user.id.toString(),
        email: user.email
      });

      return {
        accessToken,
        expiresIn: 15 * 60 // 15 minutes in seconds
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Revoke a session
   */
  static async revokeSession(refreshToken: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const session = await UserSessionRepository.findByUuid(payload.tokenId);
      
      if (session) {
        await UserSessionRepository.revokeSession(session.id);
      }
    } catch (error) {
      // Token is invalid, nothing to revoke
    }
  }

  /**
   * Revoke all sessions for a user
   */
  static async revokeAllUserSessions(userId: number): Promise<void> {
    await UserSessionRepository.revokeAllUserSessions(userId);
  }

  /**
   * Get session data for a user
   */
  static async getSessionData(userId: number): Promise<SessionData> {
    return this.buildSessionData(userId);
  }

  /**
   * Update session data
   */
  static async updateSessionData(sessionId: number, sessionData: Partial<SessionData>): Promise<void> {
    await UserSessionRepository.update(sessionId, { session_data: sessionData });
  }

  /**
   * Build session data with user's organizations and roles
   */
  private static async buildSessionData(userId: number): Promise<SessionData> {
    // Get user's organizations and roles
    const organizations = await OrganizationMemberRepository.getUserOrganizationsWithRoles(userId);
    
    const sessionData: SessionData = {
      organizations: organizations.map(org => ({
        id: org.organization.id,
        name: org.organization.name,
        roles: org.roles.map(role => role.role_name),
        permissions: this.consolidatePermissions(org.roles)
      })),
      preferences: {},
      lastOrganizationId: organizations.length > 0 ? organizations[0].organization.id : undefined
    };

    return sessionData;
  }

  /**
   * Consolidate permissions from multiple roles
   */
  private static consolidatePermissions(roles: any[]): Record<string, any> {
    const consolidated: Record<string, any> = {};

    for (const role of roles) {
      if (role.permissions) {
        const permissions = typeof role.permissions === 'string' 
          ? JSON.parse(role.permissions) 
          : role.permissions;

        for (const [resource, actions] of Object.entries(permissions)) {
          if (!consolidated[resource]) {
            consolidated[resource] = {};
          }

          for (const [action, allowed] of Object.entries(actions as any)) {
            // If any role allows the action, it's allowed
            if (allowed === true) {
              consolidated[resource][action] = true;
            }
          }
        }
      }
    }

    return consolidated;
  }

  /**
   * Extract device information from request
   */
  static extractDeviceInfo(req: Request): {
    deviceId?: string;
    deviceName?: string;
    ipAddress?: string;
    userAgent?: string;
  } {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    
    // Generate device ID from user agent and IP
    const deviceId = crypto
      .createHash('sha256')
      .update(`${userAgent}${ipAddress}`)
      .digest('hex')
      .substring(0, 16);

    // Extract device name from user agent
    let deviceName = 'Unknown Device';
    if (userAgent.includes('iPhone')) deviceName = 'iPhone';
    else if (userAgent.includes('iPad')) deviceName = 'iPad';
    else if (userAgent.includes('Android')) deviceName = 'Android Device';
    else if (userAgent.includes('Windows')) deviceName = 'Windows PC';
    else if (userAgent.includes('Mac')) deviceName = 'Mac';
    else if (userAgent.includes('Linux')) deviceName = 'Linux PC';

    return {
      deviceId,
      deviceName,
      ipAddress,
      userAgent
    };
  }
}
