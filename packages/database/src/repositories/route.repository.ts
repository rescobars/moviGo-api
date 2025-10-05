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

  async findAllWithOrdersByOrganization(organizationId: number, filters?: any): Promise<{ routes: any[], pagination: any }> {
    console.log('🔍 RouteRepository - Applying filters:', filters);
    
    // Build base query for counting
    let countQuery = this.knex('routes').where('organization_id', organizationId);
    let dataQuery = this.knex('routes').where('organization_id', organizationId);

    // Apply filters to both queries
    if (filters) {
      // Status filter
      if (filters.status) {
        const statusArray = Array.isArray(filters.status) ? filters.status : [filters.status];
        countQuery = countQuery.whereIn('status', statusArray);
        dataQuery = dataQuery.whereIn('status', statusArray);
      }

      // Priority filter
      if (filters.priority) {
        const priorityArray = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
        countQuery = countQuery.whereIn('priority', priorityArray);
        dataQuery = dataQuery.whereIn('priority', priorityArray);
      }

      // Search filter (search in route_name, description, origin_name, destination_name)
      if (filters.search) {
        const searchCondition = function(this: any) {
          this.where('route_name', 'ilike', `%${filters.search}%`)
            .orWhere('description', 'ilike', `%${filters.search}%`)
            .orWhere('origin_name', 'ilike', `%${filters.search}%`)
            .orWhere('destination_name', 'ilike', `%${filters.search}%`);
        };
        countQuery = countQuery.where(searchCondition);
        dataQuery = dataQuery.where(searchCondition);
      }

      // Date filters
      if (filters.created_after) {
        countQuery = countQuery.where('created_at', '>=', filters.created_after);
        dataQuery = dataQuery.where('created_at', '>=', filters.created_after);
      }
      if (filters.created_before) {
        countQuery = countQuery.where('created_at', '<=', filters.created_before);
        dataQuery = dataQuery.where('created_at', '<=', filters.created_before);
      }
      if (filters.updated_after) {
        countQuery = countQuery.where('updated_at', '>=', filters.updated_after);
        dataQuery = dataQuery.where('updated_at', '>=', filters.updated_after);
      }
      if (filters.updated_before) {
        countQuery = countQuery.where('updated_at', '<=', filters.updated_before);
        dataQuery = dataQuery.where('updated_at', '<=', filters.updated_before);
      }

      // Traffic delay filters
      if (filters.min_traffic_delay) {
        countQuery = countQuery.where('traffic_delay', '>=', filters.min_traffic_delay);
        dataQuery = dataQuery.where('traffic_delay', '>=', filters.min_traffic_delay);
      }
      if (filters.max_traffic_delay) {
        countQuery = countQuery.where('traffic_delay', '<=', filters.max_traffic_delay);
        dataQuery = dataQuery.where('traffic_delay', '<=', filters.max_traffic_delay);
      }

      // Location filters (basic implementation)
      if (filters.origin_lat && filters.origin_lon && filters.radius) {
        const lat = parseFloat(filters.origin_lat);
        const lon = parseFloat(filters.origin_lon);
        const radius = parseFloat(filters.radius);
        
        const locationCondition = function(this: any) {
          this.whereRaw(`
            (6371 * acos(cos(radians(?)) * cos(radians(origin_lat)) * 
            cos(radians(origin_lon) - radians(?)) + sin(radians(?)) * 
            sin(radians(origin_lat)))) <= ?
          `, [lat, lon, lat, radius]);
        };
        countQuery = countQuery.where(locationCondition);
        dataQuery = dataQuery.where(locationCondition);
      }

      // Sorting
      const sortBy = filters.sort_by || 'created_at';
      const sortOrder = filters.sort_order || 'desc';
      dataQuery = dataQuery.orderBy(sortBy, sortOrder);

      // Pagination
      if (filters.limit) {
        const limit = parseInt(filters.limit);
        dataQuery = dataQuery.limit(limit);
        
        if (filters.page) {
          const page = parseInt(filters.page);
          const offset = (page - 1) * limit;
          dataQuery = dataQuery.offset(offset);
        }
      }
    } else {
      // Default sorting if no filters
      dataQuery = dataQuery.orderBy('created_at', 'desc');
    }

    // Execute both queries in parallel
    const [routes, totalResult] = await Promise.all([
      dataQuery,
      countQuery.count('* as total').first()
    ]);

    const total = parseInt(String(totalResult?.total || 0));
    const page = filters?.page ? parseInt(filters.page) : 1;
    const limit = filters?.limit ? parseInt(filters.limit) : total;
    const totalPages = Math.ceil(total / limit);

    const pagination = {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };

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

    return {
      routes: routesWithOrders,
      pagination
    };
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
