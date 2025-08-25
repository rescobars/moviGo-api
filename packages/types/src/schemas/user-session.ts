import { z } from 'zod';

// User session status enum
export const UserSessionStatusEnum = z.enum(['ACTIVE', 'EXPIRED', 'REVOKED']);

// Session data schema
export const SessionDataSchema = z.object({
  organizations: z.array(z.object({
    uuid: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    domain: z.string().optional(),
    logo_url: z.string().optional(),
    website_url: z.string().optional(),
    contact_email: z.string().optional(),
    contact_phone: z.string().optional(),
    address: z.string().optional(),
    status: z.string(),
    plan_type: z.string(),
    subscription_expires_at: z.date().optional(),
    roles: z.array(z.object({
      uuid: z.string(),
      name: z.string(),
      description: z.string().optional(),
      permissions: z.record(z.any()).optional()
    })),
    member_since: z.date(),
    is_owner: z.boolean(),
    is_admin: z.boolean()
  })).optional(),
  preferences: z.record(z.any()).optional(),
  lastOrganizationUuid: z.string().optional(),
  total_organizations: z.number().optional()
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
    uuid: z.string(),
    email: z.string(),
    name: z.string(),
    status: z.string(),
    created_at: z.date(),
    updated_at: z.date()
  }),
  organizations: z.array(z.object({
    uuid: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    domain: z.string().optional(),
    logo_url: z.string().optional(),
    website_url: z.string().optional(),
    contact_email: z.string().optional(),
    contact_phone: z.string().optional(),
    address: z.string().optional(),
    status: z.string(),
    plan_type: z.string(),
    subscription_expires_at: z.date().optional(),
    roles: z.array(z.object({
      uuid: z.string(),
      name: z.string(),
      description: z.string().optional(),
      permissions: z.record(z.any()).optional()
    })),
    member_since: z.date(),
    is_owner: z.boolean(),
    is_admin: z.boolean()
  })),
  default_organization: z.object({
    uuid: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    domain: z.string().optional(),
    logo_url: z.string().optional(),
    website_url: z.string().optional(),
    contact_email: z.string().optional(),
    contact_phone: z.string().optional(),
    address: z.string().optional(),
    status: z.string(),
    plan_type: z.string(),
    subscription_expires_at: z.date().optional(),
    roles: z.array(z.object({
      uuid: z.string(),
      name: z.string(),
      description: z.string().optional(),
      permissions: z.record(z.any()).optional()
    })),
    member_since: z.date(),
    is_owner: z.boolean(),
    is_admin: z.boolean()
  }).optional(),
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number() // seconds
});

// Type exports
export type UserSession = z.infer<typeof UserSessionSchema>;
export type CreateUserSession = z.infer<typeof CreateUserSessionSchema>;
export type UpdateUserSession = z.infer<typeof UpdateUserSessionSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type SessionData = z.infer<typeof SessionDataSchema>;
export type UserSessionStatus = z.infer<typeof UserSessionStatusEnum>;
