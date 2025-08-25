import { z } from 'zod';

// User status enum
export const UserStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']);

// Base user schema
export const UserSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1, 'Name is required'),
  password_hash: z.string().min(1, 'Password hash is required'),
  status: UserStatusEnum,
  is_active: z.boolean(),
  created_at: z.date(),
  updated_at: z.date()
});

// Schema for creating a new user (without id, uuid, timestamps)
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  status: UserStatusEnum.optional().default('ACTIVE')
});

// Schema for updating a user
export const UpdateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  status: UserStatusEnum.optional(),
  is_active: z.boolean().optional()
});

// Schema for user login
export const LoginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type LoginUser = z.infer<typeof LoginUserSchema>;
export type UserStatus = z.infer<typeof UserStatusEnum>;
