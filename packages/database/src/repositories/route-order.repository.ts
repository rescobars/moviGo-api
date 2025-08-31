import { Knex } from 'knex';

export class RouteOrderRepository {
  constructor(private readonly knex: Knex) {}

  async createMany(routeId: number, orders: Array<{ orderId: string; sequenceOrder: number }>): Promise<any[]> {
    const routeOrdersData = orders.map(order => ({
      route_id: routeId,
      order_id: order.orderId,
      sequence_order: order.sequenceOrder,
    }));

    const routeOrders = await this.knex('route_orders')
      .insert(routeOrdersData)
      .returning('*');

    return routeOrders;
  }
}
