import { Knex } from 'knex';
import { Route, CreateRouteRequest, OrderedWaypoint } from '../../../types/src/schemas/route';

export class RouteRepository {
  constructor(private readonly knex: Knex) {}

  async create(routeData: CreateRouteRequest): Promise<Route> {
    // Convert organization UUID to numeric ID
    const organization = await this.knex('organizations')
      .where('uuid', routeData.organization_id)
      .first();
    
    if (!organization) {
      throw new Error(`Organization with UUID ${routeData.organization_id} not found`);
    }

    // Convert order UUIDs to numeric IDs in ordered_waypoints
    const updatedOrderedWaypoints = await Promise.all(
      routeData.ordered_waypoints.map(async (waypoint: OrderedWaypoint) => {
        const order = await this.knex('orders')
          .where('uuid', waypoint.order_id)
          .first();
        
        if (!order) {
          throw new Error(`Order with UUID ${waypoint.order_id} not found`);
        }

        return {
          order_id: order.id, // Use numeric ID
          order: waypoint.order
        };
      })
    );

    const [route] = await this.knex('routes')
      .insert({
        organization_id: organization.id, // Use numeric ID
        route_name: routeData.route_name,
        description: routeData.description,
        origin_lat: routeData.origin.lat,
        origin_lon: routeData.origin.lon,
        origin_name: routeData.origin.name,
        destination_lat: routeData.destination.lat,
        destination_lon: routeData.destination.lon,
        destination_name: routeData.destination.name,
        waypoints: JSON.stringify(routeData.waypoints),
        route_points: JSON.stringify(routeData.route),
        ordered_waypoints: JSON.stringify(updatedOrderedWaypoints),
        traffic_condition: JSON.stringify(routeData.traffic_condition),
        traffic_delay: routeData.traffic_delay || 0,
      })
      .returning('*');

    return this.mapDbRouteToRoute(route);
  }

  private mapDbRouteToRoute(dbRoute: any): Route {
    return {
      id: dbRoute.id,
      organization_id: dbRoute.organization_id,
      route_name: dbRoute.route_name,
      description: dbRoute.description,
      origin_lat: dbRoute.origin_lat,
      origin_lon: dbRoute.origin_lon,
      origin_name: dbRoute.origin_name,
      destination_lat: dbRoute.destination_lat,
      destination_lon: dbRoute.destination_lon,
      destination_name: dbRoute.destination_name,
      waypoints: typeof dbRoute.waypoints === 'string' ? JSON.parse(dbRoute.waypoints) : dbRoute.waypoints,
      route_points: typeof dbRoute.route_points === 'string' ? JSON.parse(dbRoute.route_points) : dbRoute.route_points,
      ordered_waypoints: typeof dbRoute.ordered_waypoints === 'string' ? JSON.parse(dbRoute.ordered_waypoints) : dbRoute.ordered_waypoints,
      traffic_condition: typeof dbRoute.traffic_condition === 'string' ? JSON.parse(dbRoute.traffic_condition) : dbRoute.traffic_condition,
      traffic_delay: dbRoute.traffic_delay,
      created_at: dbRoute.created_at,
      updated_at: dbRoute.updated_at,
    };
  }
}
