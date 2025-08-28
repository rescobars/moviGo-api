import { RouteWaypoint, CreateRouteWaypoint, UpdateRouteWaypoint } from '../../../types/src/schemas/route-waypoint';
import { db } from '../db-config';

export class RouteWaypointRepository {

  static async create(data: Omit<CreateRouteWaypoint, 'route_uuid'> & { route_id: number }): Promise<RouteWaypoint> {
    const [waypoint] = await db('route_waypoints')
      .insert({
        ...data,
        uuid: db.raw('gen_random_uuid()'),
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');

    return waypoint;
  }

  static async createMany(data: Array<Omit<CreateRouteWaypoint, 'route_uuid'> & { route_id: number }>): Promise<RouteWaypoint[]> {
    const waypoints = data.map(item => ({
      ...item,
      uuid: db.raw('gen_random_uuid()'),
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    }));

    return db('route_waypoints')
      .insert(waypoints)
      .returning('*');
  }

  static async findByUuid(uuid: string): Promise<RouteWaypoint | null> {
    const waypoint = await db('route_waypoints')
      .where('uuid', uuid)
      .first();

    return waypoint || null;
  }

  static async findById(id: number): Promise<RouteWaypoint | null> {
    const waypoint = await db('route_waypoints')
      .where('id', id)
      .first();

    return waypoint || null;
  }

  static async findByRouteId(routeId: number): Promise<RouteWaypoint[]> {
    return db('route_waypoints')
      .where('route_id', routeId)
      .orderBy('sequence_order', 'asc');
  }

  static async update(id: number, data: UpdateRouteWaypoint): Promise<RouteWaypoint | null> {
    const [waypoint] = await db('route_waypoints')
      .where('id', id)
      .update({
        ...data,
        updated_at: db.fn.now()
      })
      .returning('*');

    return waypoint || null;
  }

  static async delete(id: number): Promise<boolean> {
    const deletedCount = await db('route_waypoints')
      .where('id', id)
      .del();

    return deletedCount > 0;
  }

  static async deleteByUuid(uuid: string): Promise<boolean> {
    const deletedCount = await db('route_waypoints')
      .where('uuid', uuid)
      .del();

    return deletedCount > 0;
  }

  static async deleteByRouteId(routeId: number): Promise<boolean> {
    const deletedCount = await db('route_waypoints')
      .where('route_id', routeId)
      .del();

    return deletedCount > 0;
  }
}
