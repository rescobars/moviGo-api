import { Knex } from 'knex';
import { RouteDriver, CreateRouteDriverRequest } from '../../../types/src/schemas/route-driver';
import { db } from '../db-config';

export class RouteDriverRepository {
  constructor(public readonly knex: Knex) {}

  async createWithTransaction(trx: Knex.Transaction, routeId: number, driverOrganizationMemberId: number, routeDriverData: Omit<CreateRouteDriverRequest, 'route_id' | 'driver_organization_member_id'>): Promise<RouteDriver> {
    const [routeDriver] = await trx('route_driver')
      .insert({
        route_id: routeId,
        driver_organization_member_id: driverOrganizationMemberId,
        start_time: routeDriverData.start_time || null,
        end_time: routeDriverData.end_time || null,
        driver_notes: routeDriverData.driver_notes || null,
        driver_instructions: routeDriverData.driver_instructions ? JSON.stringify(routeDriverData.driver_instructions) : null,
      })
      .returning('*');

    return this.mapDbRouteDriverToRouteDriver(routeDriver);
  }

  async existsByUuid(routeUuid: string, driverUuid: string): Promise<boolean> {
    const count = await db('route_driver')
      .join('routes', 'route_driver.route_id', 'routes.id')
      .join('organization_members', 'route_driver.driver_organization_member_id', 'organization_members.id')
      .where('routes.uuid', routeUuid)
      .where('organization_members.uuid', driverUuid)
      .count('* as count')
      .first();

    return Number(count?.count) > 0;
  }

  async getRouteIdFromUuid(routeUuid: string): Promise<number | null> {
    const route = await db('routes')
      .where('uuid', routeUuid)
      .select('id')
      .first();

    return route ? route.id : null;
  }

  async getDriverOrganizationMemberIdFromUuid(driverUuid: string): Promise<number | null> {
    const member = await db('organization_members')
      .where('uuid', driverUuid)
      .select('id')
      .first();

    return member ? member.id : null;
  }

  async getRoutesByUserUuid(userUuid: string, status?: string): Promise<any[]> {
    let query = db('route_driver')
      .join('routes', 'route_driver.route_id', 'routes.id')
      .join('organization_members', 'route_driver.driver_organization_member_id', 'organization_members.id')
      .join('users', 'organization_members.user_id', 'users.id')
      .join('organizations', 'routes.organization_id', 'organizations.id')
      .where('users.uuid', userUuid);

    // Aplicar filtro por status si se proporciona
    if (status) {
      query = query.where('routes.status', status);
    }

    const routes = await query
      .select(
        'routes.uuid as route_uuid',
        'routes.route_name',
        'routes.description',
        'routes.status as route_status',
        'routes.priority',
        'routes.origin_name',
        'routes.destination_name',
        'routes.traffic_delay',
        'routes.created_at as route_created_at',
        'route_driver.start_time',
        'route_driver.end_time',
        'route_driver.driver_notes',
        'organizations.name as organization_name'
      );

    return routes;
  }

  private mapDbRouteDriverToRouteDriver(dbRouteDriver: any): RouteDriver {
    return {
      id: dbRouteDriver.id,
      uuid: dbRouteDriver.uuid,
      route_id: dbRouteDriver.route_id,
      driver_organization_member_id: dbRouteDriver.driver_organization_member_id,
      start_time: dbRouteDriver.start_time,
      end_time: dbRouteDriver.end_time,
      driver_notes: dbRouteDriver.driver_notes,
      driver_instructions: dbRouteDriver.driver_instructions ? (typeof dbRouteDriver.driver_instructions === 'string' ? JSON.parse(dbRouteDriver.driver_instructions) : dbRouteDriver.driver_instructions) : null,
      created_at: dbRouteDriver.created_at,
      updated_at: dbRouteDriver.updated_at,
    };
  }
}