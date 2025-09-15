import { RouteDriverRepository } from '../../../database/src/repositories/route-driver.repository';
import { RouteRepository } from '../../../database/src/repositories/route.repository';
import { CreateRouteDriverRequest, RouteDriver } from '../../../types/src/schemas/route-driver';
import { db } from '../../../database/src/db-config';

export class RouteDriverService {
  constructor(
    private readonly routeDriverRepository: RouteDriverRepository,
    private readonly routeRepository: RouteRepository
  ) {}

  async assignDriverToRoute(routeUuid: string, driverUuid: string, routeDriverData: CreateRouteDriverRequest): Promise<RouteDriver> {
    // Validate inputs before processing
    if (!routeUuid || routeUuid === 'undefined' || routeUuid === 'null') {
      throw new Error('Valid route UUID is required');
    }

    if (!driverUuid || driverUuid === 'undefined' || driverUuid === 'null') {
      throw new Error('Valid driver UUID is required');
    }

    console.log('🔍 RouteDriverService - Looking up IDs:', {
      routeUuid,
      driverUuid
    });

    // Get route and driver organization member IDs from UUIDs
    const routeId = await this.routeDriverRepository.getRouteIdFromUuid(routeUuid);
    const driverOrganizationMemberId = await this.routeDriverRepository.getDriverOrganizationMemberIdFromUuid(driverUuid);

    console.log('🔍 RouteDriverService - Found IDs:', {
      routeId,
      driverOrganizationMemberId
    });

    if (!routeId) {
      throw new Error(`Route with UUID ${routeUuid} not found`);
    }

    if (!driverOrganizationMemberId) {
      throw new Error(`Driver with UUID ${driverUuid} not found`);
    }

    // Check if driver is already assigned to this route
    const exists = await this.routeDriverRepository.existsByUuid(routeUuid, driverUuid);
    if (exists) {
      throw new Error('Driver is already assigned to this route');
    }

    // Use transaction to ensure both operations succeed or fail together
    return await db.transaction(async (trx) => {
      // Create the route driver assignment
      const routeDriver = await this.routeDriverRepository.createWithTransaction(trx, routeId, driverOrganizationMemberId, routeDriverData);

      // Update route status to ASSIGNED when driver is assigned
      await this.routeRepository.updateStatusWithTransaction(trx, routeId, 'ASSIGNED');

      return routeDriver;
    });
  }
}