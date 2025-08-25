import { Request, Response } from 'express';
import { UserRepository } from '../../../database/src/repositories/user-repository';
import { AuthTokenRepository } from '../../../database/src/repositories/auth-token.repository';
import { EmailService } from '../services/email.service';
import { SessionService } from '../services/session.service';
import { generateToken } from '../../../auth/src/jwt';
import { 
  PasswordlessLoginSchema, 
  VerifyTokenSchema 
} from '../../../types/src/schemas/auth-token';
import crypto from 'crypto';

export class AuthController {
  static async requestPasswordlessLogin(req: Request, res: Response) {
    try {
      const validatedData = PasswordlessLoginSchema.parse(req.body);
      
      // Find user by email
      const user = await UserRepository.findByEmail(validatedData.email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Generate a secure token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Set expiration (15 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      // Save token to database
      const authToken = await AuthTokenRepository.create({
        user_id: user.id,
        type: 'PASSWORDLESS_LOGIN',
        expires_at: expiresAt,
        token
      });

      // Send email with token
      const emailSent = await EmailService.sendPasswordlessLoginToken(validatedData.email, token);
      
      if (!emailSent) {
        return res.status(500).json({
          success: false,
          error: 'Failed to send login email'
        });
      }

      res.json({
        success: true,
        message: 'Login email sent successfully',
        data: {
          email: validatedData.email,
          expires_at: expiresAt
        }
      });
    } catch (error) {
      console.error('Error requesting passwordless login:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to request login'
      });
    }
  }

  static async verifyPasswordlessToken(req: Request, res: Response) {
    try {
      const validatedData = VerifyTokenSchema.parse(req.body);
      
      // Find token in database
      const authToken = await AuthTokenRepository.findByToken(validatedData.token);
      
      if (!authToken) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired token'
        });
      }

      // Check if token is expired
      if (new Date() > new Date(authToken.expires_at)) {
        await AuthTokenRepository.markAsExpired(validatedData.token);
        return res.status(400).json({
          success: false,
          error: 'Token has expired'
        });
      }

      // Check if token is already used
      if (authToken.status === 'USED') {
        return res.status(400).json({
          success: false,
          error: 'Token has already been used'
        });
      }

      // Get user
      const user = await UserRepository.findById(authToken.user_id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Mark token as used
      await AuthTokenRepository.markAsUsed(validatedData.token);

      // Create session with device information
      const deviceInfo = SessionService.extractDeviceInfo(req);
      const session = await SessionService.createSession(user.id, deviceInfo);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            uuid: user.uuid,
            email: user.email,
            name: user.name,
            status: user.status
          },
          access_token: session.accessToken,
          refresh_token: session.refreshToken,
          expires_in: session.expiresIn,
          session_data: session.sessionData
        }
      });
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify token'
      });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.body.refresh_token || req.headers['x-refresh-token'];
      
      if (refreshToken) {
        // Revoke the specific session
        await SessionService.revokeSession(refreshToken as string);
      } else {
        // If no refresh token provided, get user from access token and revoke all sessions
        const userId = (req as any).user?.userId;
        if (userId) {
          await SessionService.revokeAllUserSessions(parseInt(userId));
        }
      }
      
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to logout'
      });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.body.refresh_token || req.headers['x-refresh-token'];
      
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required'
        });
      }

      const result = await SessionService.refreshAccessToken(refreshToken as string);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          access_token: result.accessToken,
          expires_in: result.expiresIn
        }
      });
    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token'
      });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const user = await UserRepository.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          uuid: user.uuid,
          email: user.email,
          name: user.name,
          status: user.status,
          created_at: user.created_at
        }
      });
    } catch (error) {
      console.error('Error getting profile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get profile'
      });
    }
  }
}
