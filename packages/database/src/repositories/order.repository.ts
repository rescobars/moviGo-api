import { db } from '../db-config';
import { Order, CreateOrder, UpdateOrder, OrderDataForInsert } from '../../../types/src/schemas/order';

export class OrderRepository {
  static async findAll(organizationUuid: string): Promise<Order[]> {
    return db('orders')
      .join('organizations', 'orders.organization_id', 'organizations.id')
      .select('orders.*')
      .where('organizations.uuid', organizationUuid)
      .orderBy('orders.created_at', 'desc');
  }

  static async findPending(organizationUuid: string): Promise<Order[]> {
    return db('orders')
      .join('organizations', 'orders.organization_id', 'organizations.id')
      .select('orders.*')
      .where('organizations.uuid', organizationUuid)
      .where('orders.status', 'PENDING')
      .orderBy('orders.created_at', 'asc');
  }

  static async findByUuid(uuid: string): Promise<Order | null> {
    const [order] = await db('orders')
      .select('*')
      .where('uuid', uuid);
    return order || null;
  }

  static async create(orderData: OrderDataForInsert): Promise<Order> {
    const [order] = await db('orders')
      .insert({
        ...orderData,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');
    return order;
  }

  static async updateByUuid(uuid: string, orderData: UpdateOrder): Promise<Order | null> {
    const [order] = await db('orders')
      .where('uuid', uuid)
      .update({
        ...orderData,
        updated_at: new Date()
      })
      .returning('*');
    return order || null;
  }

  static async deleteByUuid(uuid: string): Promise<boolean> {
    const deleted = await db('orders')
      .where('uuid', uuid)
      .delete();
    return deleted > 0;
  }

  static async bulkCreate(orders: OrderDataForInsert[]): Promise<Order[]> {
    // Generate unique order numbers for each order
    const ordersWithTimestamps = [];
    for (const order of orders) {
      const orderNumber = order.order_number || await this.generateOrderNumber(order.organization_id);
      ordersWithTimestamps.push({
        ...order,
        order_number: orderNumber,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    return db('orders')
      .insert(ordersWithTimestamps)
      .returning('*');
  }

  static async generateOrderNumber(organizationId: number): Promise<string> {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `O${today}-${timestamp}-${random}`;
  }

  // Helper method to get organization ID from UUID
  static async getOrganizationIdFromUuid(organizationUuid: string): Promise<number | null> {
    const [org] = await db('organizations')
      .select('id')
      .where('uuid', organizationUuid);
    return org?.id || null;
  }

  // Helper method to get user ID from UUID
  static async getUserIdFromUuid(userUuid: string): Promise<number | null> {
    const [user] = await db('users')
      .select('id')
      .where('uuid', userUuid);
    return user?.id || null;
  }
}
