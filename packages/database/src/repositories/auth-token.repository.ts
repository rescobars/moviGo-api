import { Knex } from 'knex';
import { AuthToken, CreateAuthToken } from '../../../types/src/schemas/auth-token';

export class AuthTokenRepository {
  private static db: Knex;

  static setDb(database: Knex) {
    AuthTokenRepository.db = database;
  }

  static async create(tokenData: CreateAuthToken & { token: string }): Promise<AuthToken> {
    const [authToken] = await AuthTokenRepository.db('auth_tokens')
      .insert(tokenData)
      .returning('*');
    
    return authToken;
  }

  static async findByToken(token: string): Promise<AuthToken | null> {
    const authToken = await AuthTokenRepository.db('auth_tokens')
      .select('*')
      .where({ token, is_active: true })
      .first();
    
    return authToken || null;
  }

  static async findByUserIdAndType(userId: string, type: string): Promise<AuthToken[]> {
    return AuthTokenRepository.db('auth_tokens')
      .select('*')
      .where({ user_id: userId, type, is_active: true });
  }

  static async markAsUsed(token: string): Promise<AuthToken | null> {
    const [authToken] = await AuthTokenRepository.db('auth_tokens')
      .where({ token })
      .update({ 
        status: 'USED', 
        updated_at: AuthTokenRepository.db.fn.now() 
      })
      .returning('*');
    
    return authToken || null;
  }

  static async markAsExpired(token: string): Promise<AuthToken | null> {
    const [authToken] = await AuthTokenRepository.db('auth_tokens')
      .where({ token })
      .update({ 
        status: 'EXPIRED', 
        updated_at: AuthTokenRepository.db.fn.now() 
      })
      .returning('*');
    
    return authToken || null;
  }

  static async deleteExpiredTokens(): Promise<number> {
    const result = await AuthTokenRepository.db('auth_tokens')
      .where('expires_at', '<', AuthTokenRepository.db.fn.now())
      .update({ 
        status: 'EXPIRED', 
        is_active: false,
        updated_at: AuthTokenRepository.db.fn.now() 
      });
    
    return result;
  }

  static async deleteByUserId(userId: string): Promise<number> {
    const result = await AuthTokenRepository.db('auth_tokens')
      .where({ user_id: userId })
      .update({ 
        is_active: false,
        updated_at: AuthTokenRepository.db.fn.now() 
      });
    
    return result;
  }
}
