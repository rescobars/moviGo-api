import { Knex } from 'knex';
import { RouteDriver, CreateRouteDriverRequest, UpdateRouteDriverRequest, RouteDriverWithDetails } from '../../../types/src/schemas/route-driver';

export class RouteDriverRepository {
  constructor(public readonly knex: Knex) {}

  async create(routeDriverData: CreateRouteDriverRequest): Promise<RouteDriver> {
    const [routeDriver] = await this.knex('route_driver')
      .insert({
        route_id: routeDriverData.route_id,
        driver_user_id: routeDriverData.driver_user_id,
        start_time: routeDriverData.start_time || null,
        estimated_duration_minutes: routeDriverData.estimated_duration_minutes || null,
        total_distance_km: routeDriverData.total_distance_km || null,
        driver_notes: routeDriverData.driver_notes || null,
        driver_instructions: routeDriverData.driver_instructions ? JSON.stringify(routeDriverData.driver_instructions) : null,
        vehicle_info: routeDriverData.vehicle_info ? JSON.stringify(routeDriverData.vehicle_info) : null,
        route_progress: routeDriverData.route_progress ? JSON.stringify(routeDriverData.route_progress) : null,
      })
      .returning('*');

    return this.mapDbRouteDriverToRouteDriver(routeDriver);
  }

  async createWithTransaction(trx: Knex.Transaction, routeDriverData: CreateRouteDriverRequest): Promise<RouteDriver> {
    const [routeDriver] = await trx('route_driver')
      .insert({
        route_id: routeDriverData.route_id,
        driver_user_id: routeDriverData.driver_user_id,
        start_time: routeDriverData.start_time || null,
        estimated_duration_minutes: routeDriverData.estimated_duration_minutes || null,
        total_distance_km: routeDriverData.total_distance_km || null,
        driver_notes: routeDriverData.driver_notes || null,
        driver_instructions: routeDriverData.driver_instructions ? JSON.stringify(routeDriverData.driver_instructions) : null,
        vehicle_info: routeDriverData.vehicle_info ? JSON.stringify(routeDriverData.vehicle_info) : null,
        route_progress: routeDriverData.route_progress ? JSON.stringify(routeDriverData.route_progress) : null,
      })
      .returning('*');

    return this.mapDbRouteDriverToRouteDriver(routeDriver);
  }

  async findById(id: number): Promise<RouteDriver | null> {
    const routeDriver = await this.knex('route_driver')
      .where('id', id)
      .first();

    return routeDriver ? this.mapDbRouteDriverToRouteDriver(routeDriver) : null;
  }

  async findByUuid(uuid: string): Promise<RouteDriver | null> {
    const routeDriver = await this.knex('route_driver')
      .where('uuid', uuid)
      .first();

    return routeDriver ? this.mapDbRouteDriverToRouteDriver(routeDriver) : null;
  }

  async findByRouteId(routeId: number): Promise<RouteDriver[]> {
    const routeDrivers = await this.knex('route_driver')
      .where('route_id', routeId)
      .orderBy('assigned_at', 'desc');

    return routeDrivers.map(rd => this.mapDbRouteDriverToRouteDriver(rd));
  }

  async findByDriverId(driverId: number): Promise<RouteDriver[]> {
    const routeDrivers = await this.knex('route_driver')
      .where('driver_user_id', driverId)
      .orderBy('assigned_at', 'desc');

    return routeDrivers.map(rd => this.mapDbRouteDriverToRouteDriver(rd));
  }

  async findByRouteIdWithDetails(routeId: number): Promise<RouteDriverWithDetails[]> {
    const routeDrivers = await this.knex('route_driver')
      .leftJoin('users', 'route_driver.driver_user_id', 'users.id')
      .leftJoin('routes', 'route_driver.route_id', 'routes.id')
      .where('route_driver.route_id', routeId)
      .select(
        'route_driver.*',
        'users.uuid as driver_uuid',
        'users.name as driver_name',
        'users.email as driver_email',
        'users.status as driver_status',
        'routes.uuid as route_uuid',
        'routes.route_name',
        'routes.description as route_description',
        'routes.origin_name',
        'routes.destination_name',
        'routes.status as route_status',
        'routes.priority as route_priority'
      )
      .orderBy('route_driver.assigned_at', 'desc');

    return routeDrivers.map(rd => this.mapDbRouteDriverWithDetailsToRouteDriverWithDetails(rd));
  }

  async findByDriverIdWithDetails(driverId: number): Promise<RouteDriverWithDetails[]> {
    const routeDrivers = await this.knex('route_driver')
      .leftJoin('users', 'route_driver.driver_user_id', 'users.id')
      .leftJoin('routes', 'route_driver.route_id', 'routes.id')
      .where('route_driver.driver_user_id', driverId)
      .select(
        'route_driver.*',
        'users.uuid as driver_uuid',
        'users.name as driver_name',
        'users.email as driver_email',
        'users.status as driver_status',
        'routes.uuid as route_uuid',
        'routes.route_name',
        'routes.description as route_description',
        'routes.origin_name',
        'routes.destination_name',
        'routes.status as route_status',
        'routes.priority as route_priority'
      )
      .orderBy('route_driver.assigned_at', 'desc');

    return routeDrivers.map(rd => this.mapDbRouteDriverWithDetailsToRouteDriverWithDetails(rd));
  }

  async update(id: number, updateData: UpdateRouteDriverRequest): Promise<RouteDriver | null> {
    const updateFields: any = {
      updated_at: this.knex.fn.now()
    };

    // Only update fields that are provided
    if (updateData.start_time !== undefined) updateFields.start_time = updateData.start_time;
    if (updateData.actual_start_time !== undefined) updateFields.actual_start_time = updateData.actual_start_time;
    if (updateData.estimated_end_time !== undefined) updateFields.estimated_end_time = updateData.estimated_end_time;
    if (updateData.actual_end_time !== undefined) updateFields.actual_end_time = updateData.actual_end_time;
    if (updateData.estimated_duration_minutes !== undefined) updateFields.estimated_duration_minutes = updateData.estimated_duration_minutes;
    if (updateData.actual_duration_minutes !== undefined) updateFields.actual_duration_minutes = updateData.actual_duration_minutes;
    if (updateData.total_distance_km !== undefined) updateFields.total_distance_km = updateData.total_distance_km;
    if (updateData.driver_notes !== undefined) updateFields.driver_notes = updateData.driver_notes;
    if (updateData.driver_instructions !== undefined) {
      updateFields.driver_instructions = updateData.driver_instructions ? JSON.stringify(updateData.driver_instructions) : null;
    }
    if (updateData.vehicle_info !== undefined) {
      updateFields.vehicle_info = updateData.vehicle_info ? JSON.stringify(updateData.vehicle_info) : null;
    }
    if (updateData.route_progress !== undefined) {
      updateFields.route_progress = updateData.route_progress ? JSON.stringify(updateData.route_progress) : null;
    }

    const [updatedRouteDriver] = await this.knex('route_driver')
      .where('id', id)
      .update(updateFields)
      .returning('*');

    return updatedRouteDriver ? this.mapDbRouteDriverToRouteDriver(updatedRouteDriver) : null;
  }

  async updateWithTransaction(trx: Knex.Transaction, id: number, updateData: UpdateRouteDriverRequest): Promise<RouteDriver | null> {
    const updateFields: any = {
      updated_at: trx.fn.now()
    };

    // Only update fields that are provided
    if (updateData.start_time !== undefined) updateFields.start_time = updateData.start_time;
    if (updateData.actual_start_time !== undefined) updateFields.actual_start_time = updateData.actual_start_time;
    if (updateData.estimated_end_time !== undefined) updateFields.estimated_end_time = updateData.estimated_end_time;
    if (updateData.actual_end_time !== undefined) updateFields.actual_end_time = updateData.actual_end_time;
    if (updateData.estimated_duration_minutes !== undefined) updateFields.estimated_duration_minutes = updateData.estimated_duration_minutes;
    if (updateData.actual_duration_minutes !== undefined) updateFields.actual_duration_minutes = updateData.actual_duration_minutes;
    if (updateData.total_distance_km !== undefined) updateFields.total_distance_km = updateData.total_distance_km;
    if (updateData.driver_notes !== undefined) updateFields.driver_notes = updateData.driver_notes;
    if (updateData.driver_instructions !== undefined) {
      updateFields.driver_instructions = updateData.driver_instructions ? JSON.stringify(updateData.driver_instructions) : null;
    }
    if (updateData.vehicle_info !== undefined) {
      updateFields.vehicle_info = updateData.vehicle_info ? JSON.stringify(updateData.vehicle_info) : null;
    }
    if (updateData.route_progress !== undefined) {
      updateFields.route_progress = updateData.route_progress ? JSON.stringify(updateData.route_progress) : null;
    }

    const [updatedRouteDriver] = await trx('route_driver')
      .where('id', id)
      .update(updateFields)
      .returning('*');

    return updatedRouteDriver ? this.mapDbRouteDriverToRouteDriver(updatedRouteDriver) : null;
  }

  async delete(id: number): Promise<boolean> {
    const deletedCount = await this.knex('route_driver')
      .where('id', id)
      .del();

    return deletedCount > 0;
  }

  async exists(routeId: number, driverId: number): Promise<boolean> {
    const count = await this.knex('route_driver')
      .where('route_id', routeId)
      .where('driver_user_id', driverId)
      .count('* as count')
      .first();

    return Number(count?.count) > 0;
  }

  private mapDbRouteDriverToRouteDriver(dbRouteDriver: any): RouteDriver {
    return {
      id: dbRouteDriver.id,
      uuid: dbRouteDriver.uuid,
      route_id: dbRouteDriver.route_id,
      driver_user_id: dbRouteDriver.driver_user_id,
      assigned_at: dbRouteDriver.assigned_at,
      start_time: dbRouteDriver.start_time,
      actual_start_time: dbRouteDriver.actual_start_time,
      estimated_end_time: dbRouteDriver.estimated_end_time,
      actual_end_time: dbRouteDriver.actual_end_time,
      estimated_duration_minutes: dbRouteDriver.estimated_duration_minutes,
      actual_duration_minutes: dbRouteDriver.actual_duration_minutes,
      total_distance_km: dbRouteDriver.total_distance_km,
      driver_notes: dbRouteDriver.driver_notes,
      driver_instructions: dbRouteDriver.driver_instructions ? 
        (typeof dbRouteDriver.driver_instructions === 'string' ? JSON.parse(dbRouteDriver.driver_instructions) : dbRouteDriver.driver_instructions) : null,
      vehicle_info: dbRouteDriver.vehicle_info ? 
        (typeof dbRouteDriver.vehicle_info === 'string' ? JSON.parse(dbRouteDriver.vehicle_info) : dbRouteDriver.vehicle_info) : null,
      route_progress: dbRouteDriver.route_progress ? 
        (typeof dbRouteDriver.route_progress === 'string' ? JSON.parse(dbRouteDriver.route_progress) : dbRouteDriver.route_progress) : null,
      created_at: dbRouteDriver.created_at,
      updated_at: dbRouteDriver.updated_at,
    };
  }

  private mapDbRouteDriverWithDetailsToRouteDriverWithDetails(dbRouteDriver: any): RouteDriverWithDetails {
    const baseRouteDriver = this.mapDbRouteDriverToRouteDriver(dbRouteDriver);
    
    return {
      ...baseRouteDriver,
      driver: dbRouteDriver.driver_uuid ? {
        id: dbRouteDriver.driver_user_id,
        uuid: dbRouteDriver.driver_uuid,
        name: dbRouteDriver.driver_name,
        email: dbRouteDriver.driver_email,
        status: dbRouteDriver.driver_status
      } : undefined,
      route: dbRouteDriver.route_uuid ? {
        id: dbRouteDriver.route_id,
        uuid: dbRouteDriver.route_uuid,
        route_name: dbRouteDriver.route_name,
        description: dbRouteDriver.route_description,
        origin_name: dbRouteDriver.origin_name,
        destination_name: dbRouteDriver.destination_name,
        status: dbRouteDriver.route_status,
        priority: dbRouteDriver.route_priority
      } : undefined
    };
  }
}
