import { z } from 'zod';

export const CreateRouteDriverRequestSchema = z.object({
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
  driver_notes: z.string().optional(),
  driver_instructions: z.record(z.any()).optional()
});

export const UpdateRouteDriverRequestSchema = z.object({
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
  driver_notes: z.string().optional(),
  driver_instructions: z.record(z.any()).optional()
});

export const RouteDriverSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  route_id: z.number().int().positive(),
  driver_organization_member_id: z.number().int().positive(),
  start_time: z.string().datetime().nullable(),
  end_time: z.string().datetime().nullable(),
  driver_notes: z.string().nullable(),
  driver_instructions: z.record(z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const RouteDriverWithDetailsSchema = RouteDriverSchema.extend({
  driver_uuid: z.string().uuid(),
  driver_name: z.string(),
  driver_email: z.string().email(),
  driver_status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  route_uuid: z.string().uuid(),
  route_name: z.string(),
  route_description: z.string().optional(),
  route_origin_name: z.string(),
  route_destination_name: z.string(),
  route_status: z.enum(['PLANNED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PAUSED']),
  route_priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
});

export type CreateRouteDriverRequest = z.infer<typeof CreateRouteDriverRequestSchema>;
export type UpdateRouteDriverRequest = z.infer<typeof UpdateRouteDriverRequestSchema>;
export type RouteDriver = z.infer<typeof RouteDriverSchema>;
export type RouteDriverWithDetails = z.infer<typeof RouteDriverWithDetailsSchema>;