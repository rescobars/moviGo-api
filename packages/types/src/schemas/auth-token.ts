import { z } from 'zod';

// Auth token type enum
export const AuthTokenTypeEnum = z.enum(['EMAIL_VERIFICATION', 'PASSWORDLESS_LOGIN', 'PASSWORD_RESET']);

// Auth token status enum
export const AuthTokenStatusEnum = z.enum(['PENDING', 'USED', 'EXPIRED']);

// Base auth token schema
export const AuthTokenSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  user_id: z.number().int().positive(),
  token: z.string(),
  type: AuthTokenTypeEnum,
  status: AuthTokenStatusEnum,
  expires_at: z.date(),
  is_active: z.boolean(),
  created_at: z.date(),
  updated_at: z.date()
});

// Schema for creating a new auth token
export const CreateAuthTokenSchema = z.object({
  user_id: z.number().int().positive(),
  type: AuthTokenTypeEnum,
  expires_at: z.date()
});

// Schema for passwordless login request
export const PasswordlessLoginSchema = z.object({
  email: z.string().email('Invalid email format')
});

// Schema for token verification
export const VerifyTokenSchema = z.object({
  token: z.string().min(1, 'Token is required')
});

// Type exports
export type AuthToken = z.infer<typeof AuthTokenSchema>;
export type CreateAuthToken = z.infer<typeof CreateAuthTokenSchema>;
export type PasswordlessLogin = z.infer<typeof PasswordlessLoginSchema>;
export type VerifyToken = z.infer<typeof VerifyTokenSchema>;
export type AuthTokenType = z.infer<typeof AuthTokenTypeEnum>;
export type AuthTokenStatus = z.infer<typeof AuthTokenStatusEnum>;
