import { z } from 'zod';

export const WaypointTypeSchema = z.enum(['PICKUP', 'DELIVERY', 'WAYPOINT']);

export const RouteWaypointSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  route_id: z.number().int().positive(),
  sequence_order: z.number().int().positive(),
  waypoint_type: WaypointTypeSchema,
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  instructions: z.string().nullable(),
  contact_name: z.string().nullable(),
  contact_phone: z.string().nullable(),
  estimated_arrival_time: z.date().nullable(),
  actual_arrival_time: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date()
});

export const CreateRouteWaypointSchema = z.object({
  route_uuid: z.string().uuid(),
  sequence_order: z.number().int().positive(),
  waypoint_type: WaypointTypeSchema,
  address: z.string().min(1, 'Address is required'),
  latitude: z.union([z.number(), z.string()]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    }
    return val;
  }),
  longitude: z.union([z.number(), z.string()]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    }
    return val;
  }),
  instructions: z.string().optional(),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  estimated_arrival_time: z.string().datetime().optional()
});

export const UpdateRouteWaypointSchema = z.object({
  sequence_order: z.number().int().positive().optional(),
  waypoint_type: WaypointTypeSchema.optional(),
  address: z.string().min(1).optional(),
  latitude: z.union([z.number(), z.string()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }),
  longitude: z.union([z.number(), z.string()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }),
  instructions: z.string().optional(),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  estimated_arrival_time: z.string().datetime().optional()
});

export type RouteWaypoint = z.infer<typeof RouteWaypointSchema>;
export type CreateRouteWaypoint = z.infer<typeof CreateRouteWaypointSchema>;
export type UpdateRouteWaypoint = z.infer<typeof UpdateRouteWaypointSchema>;
export type WaypointType = z.infer<typeof WaypointTypeSchema>;
