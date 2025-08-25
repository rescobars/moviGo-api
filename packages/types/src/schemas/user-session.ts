import { z } from 'zod';

// User session status enum
export const UserSessionStatusEnum = z.enum(['ACTIVE', 'EXPIRED', 'REVOKED']);

// Session data schema
export const SessionDataSchema = z.object({
  organizations: z.array(z.object({
    id: z.number(),
    name: z.string(),
    roles: z.array(z.string()),
    permissions: z.record(z.any()).optional()
  })).optional(),
  preferences: z.record(z.any()).optional(),
  lastOrganizationId: z.number().optional()
});

// Base user session schema
export const UserSessionSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  user_id: z.number().int().positive(),
  refresh_token_hash: z.string(),
  session_data: SessionDataSchema,
  device_id: z.string().optional(),
  device_name: z.string().optional(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
  status: UserSessionStatusEnum,
  is_active: z.boolean(),
  last_activity: z.date(),
  expires_at: z.date(),
  created_at: z.date(),
  updated_at: z.date()
});

// Schema for creating a new user session
export const CreateUserSessionSchema = z.object({
  user_id: z.number().int().positive('Invalid user ID'),
  refresh_token_hash: z.string().min(1, 'Refresh token hash is required'),
  session_data: SessionDataSchema.optional().default({}),
  device_id: z.string().optional(),
  device_name: z.string().optional(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
  expires_at: z.date()
});

// Schema for updating a user session
export const UpdateUserSessionSchema = z.object({
  session_data: SessionDataSchema.optional(),
  status: UserSessionStatusEnum.optional(),
  is_active: z.boolean().optional()
});

// Schema for login response
export const LoginResponseSchema = z.object({
  user: z.object({
    id: z.number(),
    uuid: z.string(),
    email: z.string(),
    name: z.string(),
    status: z.string()
  }),
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(), // seconds
  session_data: SessionDataSchema
});

// Type exports
export type UserSession = z.infer<typeof UserSessionSchema>;
export type CreateUserSession = z.infer<typeof CreateUserSessionSchema>;
export type UpdateUserSession = z.infer<typeof UpdateUserSessionSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type SessionData = z.infer<typeof SessionDataSchema>;
export type UserSessionStatus = z.infer<typeof UserSessionStatusEnum>;
