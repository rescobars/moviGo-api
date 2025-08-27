import { z } from 'zod';

export const RouteUserRoleSchema = z.enum(['DRIVER', 'BACKUP_DRIVER', 'SUPERVISOR']);

export const RouteUserSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  route_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  role: RouteUserRoleSchema,
  notes: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.date(),
  updated_at: z.date()
});

export const CreateRouteUserSchema = z.object({
  route_uuid: z.string().uuid(),
  user_uuid: z.string().uuid(),
  role: RouteUserRoleSchema.optional().default('DRIVER'),
  notes: z.string().optional()
});

export const UpdateRouteUserSchema = z.object({
  role: RouteUserRoleSchema.optional(),
  notes: z.string().optional(),
  is_active: z.boolean().optional()
});

export type RouteUser = z.infer<typeof RouteUserSchema>;
export type CreateRouteUser = z.infer<typeof CreateRouteUserSchema>;
export type UpdateRouteUser = z.infer<typeof UpdateRouteUserSchema>;
export type RouteUserRole = z.infer<typeof RouteUserRoleSchema>;
