import { z } from 'zod';

export const WaypointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  name: z.string().min(1)
});

export const RoutePointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  name: z.string().min(1),
  traffic_delay: z.number().min(0),
  speed: z.number().min(0),
  congestion_level: z.enum(['free_flow', 'light', 'moderate', 'heavy', 'severe']),
  waypoint_type: z.enum(['origin', 'destination', 'waypoint', 'route']),
  waypoint_index: z.number().nullable()
});

export const OrderedWaypointSchema = z.object({
  order_id: z.string().min(1),
  order: z.number().min(1)
});

export const TrafficConditionSchema = z.object({
  current_time: z.string().datetime(),
  weather: z.string().min(1),
  road_conditions: z.string().min(1),
  general_congestion: z.string().min(1)
});

export const CreateRouteRequestSchema = z.object({
  organization_id: z.string().min(1),
  route_name: z.string().min(1),
  description: z.string().optional(),
  origin: WaypointSchema,
  destination: WaypointSchema,
  waypoints: z.array(WaypointSchema).min(1),
  route: z.array(RoutePointSchema).min(1),
  ordered_waypoints: z.array(OrderedWaypointSchema).min(1),
  traffic_condition: TrafficConditionSchema,
  traffic_delay: z.number().min(0).optional()
});

export const RouteSchema = z.object({
  id: z.string().min(1),
  organization_id: z.string().min(1),
  route_name: z.string().min(1),
  description: z.string().optional(),
  origin_lat: z.number().min(-90).max(90),
  origin_lon: z.number().min(-180).max(180),
  origin_name: z.string().min(1),
  destination_lat: z.number().min(-90).max(90),
  destination_lon: z.number().min(-180).max(180),
  destination_name: z.string().min(1),
  waypoints: z.array(WaypointSchema),
  route_points: z.array(RoutePointSchema),
  ordered_waypoints: z.array(OrderedWaypointSchema),
  traffic_condition: TrafficConditionSchema,
  traffic_delay: z.number().min(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const RouteOrderSchema = z.object({
  id: z.string().min(1),
  route_id: z.string().min(1),
  order_id: z.string().min(1),
  sequence_order: z.number().min(1),
  created_at: z.string().datetime()
});

export const UpdateRouteRequestSchema = z.object({
  route_name: z.string().min(1).optional(),
  description: z.string().optional(),
  waypoints: z.array(WaypointSchema).optional(),
  route: z.array(RoutePointSchema).optional(),
  ordered_waypoints: z.array(OrderedWaypointSchema).optional(),
  traffic_condition: TrafficConditionSchema.optional(),
  traffic_delay: z.number().min(0).optional()
});

// Type exports for backward compatibility
export type Waypoint = z.infer<typeof WaypointSchema>;
export type RoutePoint = z.infer<typeof RoutePointSchema>;
export type OrderedWaypoint = z.infer<typeof OrderedWaypointSchema>;
export type TrafficCondition = z.infer<typeof TrafficConditionSchema>;
export type CreateRouteRequest = z.infer<typeof CreateRouteRequestSchema>;
export type Route = z.infer<typeof RouteSchema>;
export type RouteOrder = z.infer<typeof RouteOrderSchema>;
export type UpdateRouteRequest = z.infer<typeof UpdateRouteRequestSchema>;
