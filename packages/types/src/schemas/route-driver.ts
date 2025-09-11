import { z } from 'zod';

export const CreateRouteDriverRequestSchema = z.object({
  route_id: z.number().int().positive(),
  driver_user_id: z.number().int().positive(),
  start_time: z.string().datetime().optional(),
  estimated_duration_minutes: z.number().int().positive().optional(),
  total_distance_km: z.number().positive().optional(),
  driver_notes: z.string().optional(),
  driver_instructions: z.record(z.any()).optional(),
  vehicle_info: z.record(z.any()).optional(),
  route_progress: z.record(z.any()).optional()
});

export const UpdateRouteDriverRequestSchema = z.object({
  start_time: z.string().datetime().optional(),
  actual_start_time: z.string().datetime().optional(),
  estimated_end_time: z.string().datetime().optional(),
  actual_end_time: z.string().datetime().optional(),
  estimated_duration_minutes: z.number().int().positive().optional(),
  actual_duration_minutes: z.number().int().positive().optional(),
  total_distance_km: z.number().positive().optional(),
  driver_notes: z.string().optional(),
  driver_instructions: z.record(z.any()).optional(),
  vehicle_info: z.record(z.any()).optional(),
  route_progress: z.record(z.any()).optional()
});

export const RouteDriverSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  route_id: z.number().int().positive(),
  driver_user_id: z.number().int().positive(),
  assigned_at: z.string().datetime(),
  start_time: z.string().datetime().nullable(),
  actual_start_time: z.string().datetime().nullable(),
  estimated_end_time: z.string().datetime().nullable(),
  actual_end_time: z.string().datetime().nullable(),
  estimated_duration_minutes: z.number().int().positive().nullable(),
  actual_duration_minutes: z.number().int().positive().nullable(),
  total_distance_km: z.number().positive().nullable(),
  driver_notes: z.string().nullable(),
  driver_instructions: z.record(z.any()).nullable(),
  vehicle_info: z.record(z.any()).nullable(),
  route_progress: z.record(z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const RouteDriverWithDetailsSchema = RouteDriverSchema.extend({
  driver: z.object({
    id: z.number().int().positive(),
    uuid: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    status: z.string()
  }).optional(),
  route: z.object({
    id: z.number().int().positive(),
    uuid: z.string().uuid(),
    route_name: z.string(),
    description: z.string().nullable(),
    origin_name: z.string(),
    destination_name: z.string(),
    status: z.string(),
    priority: z.string()
  }).optional()
});

// Type exports
export type CreateRouteDriverRequest = z.infer<typeof CreateRouteDriverRequestSchema>;
export type UpdateRouteDriverRequest = z.infer<typeof UpdateRouteDriverRequestSchema>;
export type RouteDriver = z.infer<typeof RouteDriverSchema>;
export type RouteDriverWithDetails = z.infer<typeof RouteDriverWithDetailsSchema>;
