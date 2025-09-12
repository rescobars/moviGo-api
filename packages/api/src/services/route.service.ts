import { RouteRepository } from '../../../database/src/repositories/route.repository';
import { RouteOrderRepository } from '../../../database/src/repositories/route-order.repository';
import { OrderRepository } from '../../../database/src/repositories/order.repository';
import { db } from '../../../database/src/db-config';
import { 
  Route, 
  CreateRouteRequest,
  CreateRouteRequestSchema
} from '../../../types/src/schemas/route';

export class RouteService {
  constructor(
    private readonly routeRepository: RouteRepository,
    private readonly routeOrderRepository: RouteOrderRepository
  ) {}

  async createRoute(routeData: CreateRouteRequest): Promise<Route> {
    // Validate route data using Zod
    const validatedData = CreateRouteRequestSchema.parse(routeData);

    // Execute everything in a transaction
    return await db.transaction(async (trx) => {
      // Create repositories with transaction
      const routeRepository = new RouteRepository(trx);
      const routeOrderRepository = new RouteOrderRepository(trx);

      // Create the route
      const route = await routeRepository.create(validatedData);

      // Create route orders if provided
      if (validatedData.ordered_waypoints && validatedData.ordered_waypoints.length > 0) {
        const routeOrdersData = validatedData.ordered_waypoints.map(waypoint => ({
          orderId: waypoint.order_id,
          sequenceOrder: waypoint.order
        }));

        await routeOrderRepository.createMany(route.id, routeOrdersData);

        // Update orders status to ASSIGNED
        // Convert order UUIDs to numeric IDs for bulk update
        const orderUuids = validatedData.ordered_waypoints.map(waypoint => waypoint.order_id);
        const orders = await OrderRepository.findByUuids(orderUuids, trx);
        const orderIds = orders.map(order => order.id);
        
        if (orderIds.length > 0) {
          await trx('orders')
            .whereIn('id', orderIds)
            .update({
              status: 'ASSIGNED',
              updated_at: new Date()
            });
        }
      }

      return route;
    });
  }

  async getAllRoutesByOrganization(organizationId: number, filters?: any): Promise<{ routes: any[], pagination: any }> {
    return await this.routeRepository.findAllWithOrdersByOrganization(organizationId, filters);
  }
}
