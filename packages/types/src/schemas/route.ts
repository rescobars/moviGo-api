import { z } from 'zod';
import { CreateRouteWaypointSchema } from './route-waypoint';
import { CreateRouteOrderSchema } from './route-order';

export const RouteStatusSchema = z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);
export const RouteTypeSchema = z.enum(['SCHEDULED', 'ON_DEMAND', 'OPTIMIZED']);

export const RouteSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  organization_id: z.number().int().positive(),
  name: z.string(),
  description: z.string().nullable(),
  status: RouteStatusSchema,
  type: RouteTypeSchema,
  planned_start_time: z.date().nullable(),
  planned_end_time: z.date().nullable(),
  actual_start_time: z.date().nullable(),
  actual_end_time: z.date().nullable(),
  total_distance_km: z.number().int().default(0),
  estimated_duration_minutes: z.number().int().default(0),
  total_orders: z.number().int().default(0),
  created_at: z.date(),
  updated_at: z.date()
});

export const CreateRouteSchema = z.object({
  organization_uuid: z.string().uuid(),
  name: z.string().min(1, 'Route name is required'),
  description: z.string().optional(),
  type: RouteTypeSchema.optional().default('ON_DEMAND'),
  planned_start_time: z.string().datetime().optional(),
  planned_end_time: z.string().datetime().optional(),
  total_distance_km: z.union([z.number().int().positive(), z.string()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val);
      return isNaN(num) ? 0 : num;
    }
    return val || 0;
  }),
  estimated_duration_minutes: z.union([z.number().int().positive(), z.string()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val);
      return isNaN(num) ? 0 : num;
    }
    return val || 0;
  })
});

export const UpdateRouteSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: RouteStatusSchema.optional(),
  type: RouteTypeSchema.optional(),
  planned_start_time: z.string().datetime().optional(),
  planned_end_time: z.string().datetime().optional(),
  total_distance_km: z.union([z.number().int().positive(), z.string()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }),
  estimated_duration_minutes: z.union([z.number().int().positive(), z.string()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  })
});

export const CreateCompleteRouteSchema = z.object({
  organization_uuid: z.string().uuid(),
  name: z.string().min(1, 'Route name is required'),
  description: z.string().optional(),
  type: RouteTypeSchema.optional().default('ON_DEMAND'),
  planned_start_time: z.string().datetime().optional(),
  planned_end_time: z.string().datetime().optional(),
  total_distance_km: z.union([z.number().int().positive(), z.string()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val);
      return isNaN(num) ? 0 : num;
    }
    return val || 0;
  }),
  estimated_duration_minutes: z.union([z.number().int().positive(), z.string()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val);
      return isNaN(num) ? 0 : num;
    }
    return val || 0;
  }),
  waypoints: z.array(CreateRouteWaypointSchema).min(1, 'At least one waypoint is required'),
  orders: z.array(CreateRouteOrderSchema).optional().default([])
});

export type Route = z.infer<typeof RouteSchema>;
export type CreateRoute = z.infer<typeof CreateRouteSchema>;
export type UpdateRoute = z.infer<typeof UpdateRouteSchema>;
export type RouteStatus = z.infer<typeof RouteStatusSchema>;
export type RouteType = z.infer<typeof RouteTypeSchema>;
export type CreateCompleteRoute = z.infer<typeof CreateCompleteRouteSchema>;
