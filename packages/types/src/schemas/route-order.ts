import { z } from 'zod';

export const RouteOrderStatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED']);

export const RouteOrderSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  route_id: z.number().int().positive(),
  order_id: z.number().int().positive(),
  sequence_order: z.number().int().positive(),
  pickup_waypoint_id: z.number().int().positive().nullable(),
  delivery_waypoint_id: z.number().int().positive().nullable(),
  status: RouteOrderStatusSchema,
  estimated_pickup_time: z.date().nullable(),
  actual_pickup_time: z.date().nullable(),
  estimated_delivery_time: z.date().nullable(),
  actual_delivery_time: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date()
});

export const CreateRouteOrderSchema = z.object({
  route_uuid: z.string().uuid(),
  order_uuid: z.string().uuid(),
  sequence_order: z.number().int().positive(),
  pickup_waypoint_uuid: z.string().uuid().optional(),
  delivery_waypoint_uuid: z.string().uuid().optional(),
  status: RouteOrderStatusSchema.optional().default('PENDING'),
  estimated_pickup_time: z.string().datetime().optional(),
  estimated_delivery_time: z.string().datetime().optional()
});

export const UpdateRouteOrderSchema = z.object({
  sequence_order: z.number().int().positive().optional(),
  pickup_waypoint_uuid: z.string().uuid().optional(),
  delivery_waypoint_uuid: z.string().uuid().optional(),
  status: RouteOrderStatusSchema.optional(),
  estimated_pickup_time: z.string().datetime().optional(),
  estimated_delivery_time: z.string().datetime().optional()
});

export type RouteOrder = z.infer<typeof RouteOrderSchema>;
export type CreateRouteOrder = z.infer<typeof CreateRouteOrderSchema>;
export type UpdateRouteOrder = z.infer<typeof UpdateRouteOrderSchema>;
export type RouteOrderStatus = z.infer<typeof RouteOrderStatusSchema>;
