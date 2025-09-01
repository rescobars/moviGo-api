import { Knex } from 'knex';

export class RouteOrderRepository {
  constructor(private readonly knex: Knex) {}

  async createMany(routeId: number, orders: Array<{ orderId: string; sequenceOrder: number }>): Promise<any[]> {
    // Convert order UUIDs to numeric IDs
    const routeOrdersData = await Promise.all(
      orders.map(async (order) => {
        const orderRecord = await this.knex('orders')
          .where('uuid', order.orderId)
          .first();
        
        if (!orderRecord) {
          throw new Error(`Order with UUID ${order.orderId} not found`);
        }

        return {
          route_id: routeId,
          order_id: orderRecord.id, // Use numeric ID
          sequence_order: order.sequenceOrder,
        };
      })
    );

    const routeOrders = await this.knex('route_orders')
      .insert(routeOrdersData)
      .returning('*');

    return routeOrders;
  }
}
