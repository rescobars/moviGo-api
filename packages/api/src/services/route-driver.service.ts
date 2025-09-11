import { RouteDriverRepository } from '../../../database/src/repositories/route-driver.repository';
import { RouteRepository } from '../../../database/src/repositories/route.repository';
import { CreateRouteDriverRequest, RouteDriver } from '../../../types/src/schemas/route-driver';

export class RouteDriverService {
  constructor(
    private readonly routeDriverRepository: RouteDriverRepository,
    private readonly routeRepository: RouteRepository
  ) {}

  async assignDriverToRoute(routeUuid: string, driverUuid: string, routeDriverData: Omit<CreateRouteDriverRequest, 'route_id' | 'driver_user_id'>): Promise<RouteDriver> {
    const routeId = await this.routeDriverRepository.getRouteIdFromUuid(routeUuid);
    const driverId = await this.routeDriverRepository.getDriverIdFromUuid(driverUuid);

    if (!routeId) {
      throw new Error(`Route with UUID ${routeUuid} not found`);
    }

    if (!driverId) {
      throw new Error(`Driver with UUID ${driverUuid} not found`);
    }

    const exists = await this.routeDriverRepository.existsByUuid(routeUuid, driverUuid);
    if (exists) {
      throw new Error('Driver is already assigned to this route');
    }

    return await this.routeDriverRepository.knex.transaction(async (trx) => {
      const routeDriver = await this.routeDriverRepository.createWithTransaction(trx, {
        ...routeDriverData,
        route_id: routeId,
        driver_user_id: driverId
      });

      await this.routeRepository.updateStatusWithTransaction(trx, routeId, 'ASSIGNED');

      return routeDriver;
    });
  }
}
