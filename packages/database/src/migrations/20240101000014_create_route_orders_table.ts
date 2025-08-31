import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('route_orders', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('route_id').notNullable().references('id').inTable('routes').onDelete('CASCADE');
    table.bigInteger('order_id').notNullable().references('id').inTable('orders').onDelete('CASCADE');
    table.integer('sequence_order').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['route_id']);
    table.index(['order_id']);
    table.index(['sequence_order']);
    
    // Unique constraint to prevent duplicate order-route combinations
    table.unique(['route_id', 'order_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('route_orders');
}
