import { RouteDriverRepository } from '../../../database/src/repositories/route-driver.repository';
import { RouteRepository } from '../../../database/src/repositories/route.repository';
import { CreateRouteDriverRequest, UpdateRouteDriverRequest, RouteDriver, RouteDriverWithDetails } from '../../../types/src/schemas/route-driver';

export class RouteDriverService {
  constructor(
    private readonly routeDriverRepository: RouteDriverRepository,
    private readonly routeRepository: RouteRepository
  ) {}

  async assignDriverToRoute(routeDriverData: CreateRouteDriverRequest): Promise<RouteDriver> {
    // Check if driver is already assigned to this route
    const exists = await this.routeDriverRepository.exists(routeDriverData.route_id, routeDriverData.driver_user_id);
    if (exists) {
      throw new Error('Driver is already assigned to this route');
    }

    // Use transaction to ensure both operations succeed or fail together
    return await this.routeDriverRepository.knex.transaction(async (trx) => {
      // Create the route driver assignment
      const routeDriver = await this.routeDriverRepository.createWithTransaction(trx, routeDriverData);

      // Update route status to ASSIGNED when driver is assigned
      await this.routeRepository.updateStatusWithTransaction(trx, routeDriverData.route_id, 'ASSIGNED');

      return routeDriver;
    });
  }

  async getRouteDriverById(id: number): Promise<RouteDriver | null> {
    return await this.routeDriverRepository.findById(id);
  }

  async getRouteDriverByUuid(uuid: string): Promise<RouteDriver | null> {
    return await this.routeDriverRepository.findByUuid(uuid);
  }

  async getDriversByRoute(routeId: number): Promise<RouteDriver[]> {
    return await this.routeDriverRepository.findByRouteId(routeId);
  }

  async getDriversByRouteWithDetails(routeId: number): Promise<RouteDriverWithDetails[]> {
    return await this.routeDriverRepository.findByRouteIdWithDetails(routeId);
  }

  async getRoutesByDriver(driverId: number): Promise<RouteDriver[]> {
    return await this.routeDriverRepository.findByDriverId(driverId);
  }

  async getRoutesByDriverWithDetails(driverId: number): Promise<RouteDriverWithDetails[]> {
    return await this.routeDriverRepository.findByDriverIdWithDetails(driverId);
  }

  async updateRouteDriver(id: number, updateData: UpdateRouteDriverRequest): Promise<RouteDriver | null> {
    return await this.routeDriverRepository.update(id, updateData);
  }

  async removeDriverFromRoute(id: number): Promise<boolean> {
    return await this.routeDriverRepository.delete(id);
  }

  async startRoute(id: number): Promise<RouteDriver | null> {
    const startTime = new Date().toISOString();
    
    // Use transaction to ensure both operations succeed or fail together
    return await this.routeDriverRepository.knex.transaction(async (trx) => {
      const routeDriver = await this.routeDriverRepository.updateWithTransaction(trx, id, {
        actual_start_time: startTime
      });

      if (routeDriver) {
        // Update route status to IN_PROGRESS when route starts
        await this.routeRepository.updateStatusWithTransaction(trx, routeDriver.route_id, 'IN_PROGRESS');
      }

      return routeDriver;
    });
  }

  async completeRoute(id: number, actualDurationMinutes?: number): Promise<RouteDriver | null> {
    const endTime = new Date().toISOString();
    
    // Use transaction to ensure both operations succeed or fail together
    return await this.routeDriverRepository.knex.transaction(async (trx) => {
      const routeDriver = await this.routeDriverRepository.updateWithTransaction(trx, id, {
        actual_end_time: endTime,
        actual_duration_minutes: actualDurationMinutes
      });

      if (routeDriver) {
        // Update route status to COMPLETED when route is completed
        await this.routeRepository.updateStatusWithTransaction(trx, routeDriver.route_id, 'COMPLETED');
      }

      return routeDriver;
    });
  }

  async updateRouteProgress(id: number, progress: Record<string, any>): Promise<RouteDriver | null> {
    return await this.routeDriverRepository.update(id, {
      route_progress: progress
    });
  }
}
