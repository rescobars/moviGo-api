import { RouteOrder, CreateRouteOrder, UpdateRouteOrder } from '../../../types/src/schemas/route-order';
import { db } from '../db-config';

export class RouteOrderRepository {

  static async create(data: Omit<CreateRouteOrder, 'route_uuid' | 'order_uuid' | 'pickup_waypoint_uuid' | 'delivery_waypoint_uuid'> & { 
    route_id: number; 
    order_id: number; 
    pickup_waypoint_id?: number; 
    delivery_waypoint_id?: number; 
  }): Promise<RouteOrder> {
    const [routeOrder] = await db('route_orders')
      .insert({
        ...data,
        uuid: db.raw('gen_random_uuid()'),
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');

    return routeOrder;
  }

  static async createMany(data: Array<Omit<CreateRouteOrder, 'route_uuid' | 'order_uuid' | 'pickup_waypoint_uuid' | 'delivery_waypoint_uuid'> & { 
    route_id: number; 
    order_id: number; 
    pickup_waypoint_id?: number; 
    delivery_waypoint_id?: number; 
  }>): Promise<RouteOrder[]> {
    const routeOrders = data.map(item => ({
      ...item,
      uuid: db.raw('gen_random_uuid()'),
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    }));

    return db('route_orders')
      .insert(routeOrders)
      .returning('*');
  }

  static async findByUuid(uuid: string): Promise<RouteOrder | null> {
    const routeOrder = await db('route_orders')
      .where('uuid', uuid)
      .first();

    return routeOrder || null;
  }

  static async findById(id: number): Promise<RouteOrder | null> {
    const routeOrder = await db('route_orders')
      .where('id', id)
      .first();

    return routeOrder || null;
  }

  static async findByRouteId(routeId: number): Promise<RouteOrder[]> {
    return db('route_orders')
      .where('route_id', routeId)
      .orderBy('sequence_order', 'asc');
  }

  static async findByOrderId(orderId: number): Promise<RouteOrder[]> {
    return db('route_orders')
      .where('order_id', orderId);
  }

  static async update(id: number, data: UpdateRouteOrder): Promise<RouteOrder | null> {
    const [routeOrder] = await db('route_orders')
      .where('id', id)
      .update({
        ...data,
        updated_at: db.fn.now()
      })
      .returning('*');

    return routeOrder || null;
  }

  static async delete(id: number): Promise<boolean> {
    const deletedCount = await db('route_orders')
      .where('id', id)
      .del();

    return deletedCount > 0;
  }

  static async deleteByUuid(uuid: string): Promise<boolean> {
    const deletedCount = await db('route_orders')
      .where('uuid', uuid)
      .del();

    return deletedCount > 0;
  }

  static async deleteByRouteId(routeId: number): Promise<boolean> {
    const deletedCount = await db('route_orders')
      .where('route_id', routeId)
      .del();

    return deletedCount > 0;
  }
}
