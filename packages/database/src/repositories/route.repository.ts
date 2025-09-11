import { Knex } from 'knex';
import { Route, CreateRouteRequest, OrderedWaypoint } from '../../../types/src/schemas/route';

export class RouteRepository {
  constructor(public readonly knex: Knex) {}

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
        // Status and priority
        status: routeData.status || 'PLANNED',
        priority: routeData.priority || 'MEDIUM',
      })
      .returning('*');

    return this.mapDbRouteToRoute(route);
  }

  async findAllByOrganization(organizationId: number): Promise<Route[]> {
    const routes = await this.knex('routes')
      .where('organization_id', organizationId)
      .orderBy('created_at', 'desc');

    return routes.map(route => this.mapDbRouteToRoute(route));
  }

  async updateStatus(routeId: number, status: string): Promise<Route | null> {
    const [updatedRoute] = await this.knex('routes')
      .where('id', routeId)
      .update({
        status,
        updated_at: this.knex.fn.now()
      })
      .returning('*');

    return updatedRoute ? this.mapDbRouteToRoute(updatedRoute) : null;
  }

  async updatePriority(routeId: number, priority: string): Promise<Route | null> {
    const [updatedRoute] = await this.knex('routes')
      .where('id', routeId)
      .update({
        priority,
        updated_at: this.knex.fn.now()
      })
      .returning('*');

    return updatedRoute ? this.mapDbRouteToRoute(updatedRoute) : null;
  }

  async updateStatusWithTransaction(trx: Knex.Transaction, routeId: number, status: string): Promise<Route | null> {
    const [updatedRoute] = await trx('routes')
      .where('id', routeId)
      .update({
        status,
        updated_at: trx.fn.now()
      })
      .returning('*');

    return updatedRoute ? this.mapDbRouteToRoute(updatedRoute) : null;
  }

  async findAllWithOrdersByOrganization(organizationId: number): Promise<any[]> {
    const routes = await this.knex('routes')
      .where('organization_id', organizationId)
      .orderBy('created_at', 'desc');

    // Para cada ruta, obtener los orders asociados
    const routesWithOrders = await Promise.all(
      routes.map(async (route) => {
        const routeData = this.mapDbRouteToRoute(route);
        
        // Obtener los orders asociados a esta ruta
        const orders = await this.knex('route_orders')
          .join('orders', 'route_orders.order_id', 'orders.id')
          .where('route_orders.route_id', route.id)
          .select(
            'orders.uuid as order_uuid',
            'orders.order_number',
            'orders.status',
            'orders.pickup_address',
            'orders.delivery_address',
            'orders.pickup_lat',
            'orders.pickup_lng',
            'orders.delivery_lat',
            'orders.delivery_lng',
            'orders.total_amount',
            'route_orders.sequence_order'
          )
          .orderBy('route_orders.sequence_order');

        return {
          ...routeData,
          orders: orders.map(order => ({
            order_uuid: order.order_uuid,
            order_number: order.order_number,
            status: order.status,
            pickup_address: order.pickup_address,
            delivery_address: order.delivery_address,
            pickup_lat: order.pickup_lat,
            pickup_lng: order.pickup_lng,
            delivery_lat: order.delivery_lat,
            delivery_lng: order.delivery_lng,
            total_amount: order.total_amount,
            sequence_order: order.sequence_order
          }))
        };
      })
    );

    return routesWithOrders;
  }

  private mapDbRouteToRoute(dbRoute: any): Route {
    return {
      id: dbRoute.id,
      uuid: dbRoute.uuid,
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
      // Status and priority
      status: dbRoute.status || 'PLANNED',
      priority: dbRoute.priority || 'MEDIUM',
      created_at: dbRoute.created_at,
      updated_at: dbRoute.updated_at,
    };
  }
}
