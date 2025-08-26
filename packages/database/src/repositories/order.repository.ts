import { db } from '../db-config';
import { Order, CreateOrder, UpdateOrder } from '../../../types/src/schemas/order';

export class OrderRepository {
  static async findAll(organizationId: string): Promise<Order[]> {
    return db('orders')
      .select('*')
      .where('organization_id', organizationId)
      .orderBy('created_at', 'desc');
  }

  static async findPending(organizationId: string): Promise<Order[]> {
    return db('orders')
      .select('*')
      .where('organization_id', organizationId)
      .where('status', 'PENDING')
      .orderBy('created_at', 'asc');
  }

  static async findById(id: string): Promise<Order | null> {
    const [order] = await db('orders')
      .select('*')
      .where('id', id);
    return order || null;
  }

  static async create(orderData: CreateOrder): Promise<Order> {
    const [order] = await db('orders')
      .insert({
        ...orderData,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');
    return order;
  }

  static async update(id: string, orderData: UpdateOrder): Promise<Order | null> {
    const [order] = await db('orders')
      .where('id', id)
      .update({
        ...orderData,
        updated_at: new Date()
      })
      .returning('*');
    return order || null;
  }

  static async delete(id: string): Promise<boolean> {
    const deleted = await db('orders')
      .where('id', id)
      .delete();
    return deleted > 0;
  }

  static async bulkCreate(orders: CreateOrder[]): Promise<Order[]> {
    const ordersWithTimestamps = orders.map(order => ({
      ...order,
      created_at: new Date(),
      updated_at: new Date()
    }));

    return db('orders')
      .insert(ordersWithTimestamps)
      .returning('*');
  }

  static async generateOrderNumber(organizationId: string): Promise<string> {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const count = await db('orders')
      .where('organization_id', organizationId)
      .whereRaw('DATE(created_at) = ?', [new Date().toISOString().split('T')[0]])
      .count('* as total');
    
    const orderNumber = Number(count[0]?.total || 0) + 1;
    return `O${today}-${orderNumber.toString().padStart(4, '0')}`;
  }
}
