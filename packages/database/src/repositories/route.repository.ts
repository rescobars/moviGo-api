import { Route, CreateRoute, UpdateRoute } from '../../../types/src/schemas/route';
import { db } from '../db-config';

export class RouteRepository {

  static async create(data: Omit<CreateRoute, 'organization_uuid'> & { organization_id: number }): Promise<Route> {
    const [route] = await db('routes')
      .insert({
        ...data,
        uuid: db.raw('gen_random_uuid()'),
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');

    return route;
  }

  static async findByUuid(uuid: string): Promise<Route | null> {
    const route = await db('routes')
      .where('uuid', uuid)
      .first();

    return route || null;
  }

  static async findById(id: number): Promise<Route | null> {
    const route = await db('routes')
      .where('id', id)
      .first();

    return route || null;
  }

  static async update(id: number, data: UpdateRoute): Promise<Route | null> {
    const [route] = await db('routes')
      .where('id', id)
      .update({
        ...data,
        updated_at: db.fn.now()
      })
      .returning('*');

    return route || null;
  }

  static async delete(id: number): Promise<boolean> {
    const deletedCount = await db('routes')
      .where('id', id)
      .del();

    return deletedCount > 0;
  }

  static async deleteByUuid(uuid: string): Promise<boolean> {
    const deletedCount = await db('routes')
      .where('uuid', uuid)
      .del();

    return deletedCount > 0;
  }

  static async findByOrganizationId(organizationId: number): Promise<Route[]> {
    return db('routes')
      .where('organization_id', organizationId)
      .orderBy('created_at', 'desc');
  }

  static async updateTotalOrders(id: number, totalOrders: number): Promise<void> {
    await db('routes')
      .where('id', id)
      .update({
        total_orders: totalOrders,
        updated_at: db.fn.now()
      });
  }
}
