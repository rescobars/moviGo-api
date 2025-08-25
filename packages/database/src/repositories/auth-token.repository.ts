import { Knex } from 'knex';
import { AuthToken, CreateAuthToken } from '../../../types/src/schemas/auth-token';
import { db } from '../db-config';

export class AuthTokenRepository {

  static async create(tokenData: CreateAuthToken & { token: string }): Promise<AuthToken> {
    const [authToken] = await db('auth_tokens')
      .insert(tokenData)
      .returning('*');
    
    return authToken;
  }

  static async findByToken(token: string): Promise<AuthToken | null> {
    const authToken = await db('auth_tokens')
      .select('*')
      .where({ token, is_active: true })
      .first();
    
    return authToken || null;
  }

  static async findByVerificationCode(verificationCode: string): Promise<AuthToken | null> {
    const authToken = await db('auth_tokens')
      .select('*')
      .where({ verification_code: verificationCode, is_active: true })
      .first();
    
    return authToken || null;
  }

  static async findByUserIdAndType(userId: number, type: string): Promise<AuthToken[]> {
    return db('auth_tokens')
      .select('*')
      .where({ user_id: userId, type, is_active: true });
  }

  static async markAsUsed(token: string): Promise<AuthToken | null> {
    const [authToken] = await db('auth_tokens')
      .where({ token })
      .update({ 
        status: 'USED', 
        updated_at: db.fn.now() 
      })
      .returning('*');
    
    return authToken || null;
  }

  static async markAsExpired(token: string): Promise<AuthToken | null> {
    const [authToken] = await db('auth_tokens')
      .where({ token })
      .update({ 
        status: 'EXPIRED', 
        updated_at: db.fn.now() 
      })
      .returning('*');
    
    return authToken || null;
  }

  static async deleteExpiredTokens(): Promise<number> {
    const result = await db('auth_tokens')
      .where('expires_at', '<', db.fn.now())
      .update({ 
        status: 'EXPIRED', 
        is_active: false,
        updated_at: db.fn.now() 
      });
    
    return result;
  }

  static async deleteByUserId(userId: number): Promise<number> {
    const result = await db('auth_tokens')
      .where({ user_id: userId })
      .update({ 
        is_active: false,
        updated_at: db.fn.now() 
      });
    
    return result;
  }
}
