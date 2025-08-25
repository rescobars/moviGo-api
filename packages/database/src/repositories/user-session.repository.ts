import { Knex } from 'knex';
import { UserSession, CreateUserSession, UpdateUserSession } from '../../../types/src/schemas/user-session';
import { db } from '../db-config';
import crypto from 'crypto';

export class UserSessionRepository {
  static async create(sessionData: CreateUserSession): Promise<UserSession> {
    const [session] = await db('user_sessions')
      .insert(sessionData)
      .returning('*');
    return session;
  }

  static async findById(id: number): Promise<UserSession | null> {
    const session = await db('user_sessions')
      .where('id', id)
      .where('is_active', true)
      .first();
    return session || null;
  }

  static async findByUuid(uuid: string): Promise<UserSession | null> {
    const session = await db('user_sessions')
      .where('uuid', uuid)
      .where('is_active', true)
      .first();
    return session || null;
  }

  static async findByRefreshTokenHash(refreshTokenHash: string): Promise<UserSession | null> {
    const session = await db('user_sessions')
      .where('refresh_token_hash', refreshTokenHash)
      .where('is_active', true)
      .where('status', 'ACTIVE')
      .first();
    return session || null;
  }

  static async findByUserId(userId: number): Promise<UserSession[]> {
    return db('user_sessions')
      .where('user_id', userId)
      .where('is_active', true)
      .orderBy('last_activity', 'desc');
  }

  static async update(id: number, updateData: UpdateUserSession): Promise<UserSession | null> {
    const [session] = await db('user_sessions')
      .where('id', id)
      .update({
        ...updateData,
        updated_at: db.fn.now()
      })
      .returning('*');
    return session || null;
  }

  static async updateLastActivity(id: number): Promise<void> {
    await db('user_sessions')
      .where('id', id)
      .update({
        last_activity: db.fn.now(),
        updated_at: db.fn.now()
      });
  }

  static async revokeSession(id: number): Promise<void> {
    await db('user_sessions')
      .where('id', id)
      .update({
        status: 'REVOKED',
        is_active: false,
        updated_at: db.fn.now()
      });
  }

  static async revokeAllUserSessions(userId: number): Promise<void> {
    await db('user_sessions')
      .where('user_id', userId)
      .where('status', 'ACTIVE')
      .update({
        status: 'REVOKED',
        is_active: false,
        updated_at: db.fn.now()
      });
  }

  static async revokeSessionByRefreshToken(refreshTokenHash: string): Promise<void> {
    await db('user_sessions')
      .where('refresh_token_hash', refreshTokenHash)
      .update({
        status: 'REVOKED',
        is_active: false,
        updated_at: db.fn.now()
      });
  }

  static async cleanExpiredSessions(): Promise<number> {
    const result = await db('user_sessions')
      .where('expires_at', '<', db.fn.now())
      .where('status', 'ACTIVE')
      .update({
        status: 'EXPIRED',
        is_active: false,
        updated_at: db.fn.now()
      });
    return result;
  }

  static async getActiveSessionsCount(userId: number): Promise<number> {
    const result = await db('user_sessions')
      .where('user_id', userId)
      .where('status', 'ACTIVE')
      .where('is_active', true)
      .count('id as count')
      .first();
    return parseInt(result?.count as string || '0');
  }

  // Utility method to hash refresh tokens
  static hashRefreshToken(refreshToken: string): string {
    return crypto.createHash('sha256').update(refreshToken).digest('hex');
  }
}
