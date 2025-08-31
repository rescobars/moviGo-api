import { RouteRepository } from '../../../database/src/repositories/route.repository';
import { RouteOrderRepository } from '../../../database/src/repositories/route-order.repository';
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

    // Create the route
    const route = await this.routeRepository.create(validatedData);

    // Create route orders if provided
    if (validatedData.ordered_waypoints && validatedData.ordered_waypoints.length > 0) {
      const routeOrdersData = validatedData.ordered_waypoints.map(waypoint => ({
        orderId: waypoint.order_id,
        sequenceOrder: waypoint.order
      }));

      await this.routeOrderRepository.createMany(route.id, routeOrdersData);
    }

    return route;
  }
}
