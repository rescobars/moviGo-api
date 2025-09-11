import { Knex } from 'knex';
import { db } from '../db-config';

export class AuthRepository {
  static async verifyCodeAndActivateUser(code: string, userId: number): Promise<{
    user: any;
    member: any;
  }> {
    return db.transaction(async (trx) => {
      // Find token by verification code
      const authToken = await trx('auth_tokens')
        .where('verification_code', code)
        .where('status', 'PENDING')
        .first();

      if (!authToken) {
        throw new Error('Invalid or expired verification code');
      }

      // Check if token is expired
      if (new Date() > new Date(authToken.expires_at)) {
        await trx('auth_tokens')
          .where('token', authToken.token)
          .update({ status: 'EXPIRED' });
        throw new Error('Verification code has expired');
      }

      // Check if token is already used
      if (authToken.status === 'USED') {
        throw new Error('Verification code has already been used');
      }

      // Get user
      const user = await trx('users')
        .where('id', userId)
        .first();

      if (!user) {
        throw new Error('User not found');
      }

      let member = null;

      // If this is an EMAIL_VERIFICATION token, activate user and member
      if (authToken.type === 'EMAIL_VERIFICATION') {
        // Activate user if not already active
        if (user.status !== 'ACTIVE') {
          await trx('users')
            .where('id', userId)
            .update({
              status: 'ACTIVE',
              updated_at: trx.fn.now()
            });
        }

        // Find and activate organization member
        member = await trx('organization_members')
          .where('user_id', userId)
          .where('is_active', true)
          .first();

        if (member && member.status !== 'ACTIVE') {
          await trx('organization_members')
            .where('id', member.id)
            .update({
              status: 'ACTIVE',
              updated_at: trx.fn.now()
            });
        }
      }

      // Mark token as used
      await trx('auth_tokens')
        .where('token', authToken.token)
        .update({
          status: 'USED',
          updated_at: trx.fn.now()
        });

      return { user, member };
    });
  }

  static async findTokenByVerificationCode(code: string): Promise<any> {
    return db('auth_tokens')
      .where('verification_code', code)
      .where('status', 'PENDING')
      .first();
  }

  static async markTokenAsExpired(token: string): Promise<void> {
    await db('auth_tokens')
      .where('token', token)
      .update({
        status: 'EXPIRED',
        updated_at: db.fn.now()
      });
  }

  static async markTokenAsUsed(token: string): Promise<void> {
    await db('auth_tokens')
      .where('token', token)
      .update({
        status: 'USED',
        updated_at: db.fn.now()
      });
  }
}
