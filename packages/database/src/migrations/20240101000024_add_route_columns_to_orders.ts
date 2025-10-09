import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('orders', (table) => {
    // Add route_points column as jsonb for storing route points
    table.jsonb('route_points').nullable();
    
    // Add route_details column as json for storing route details
    table.json('route_details').nullable();
    
    // Add GIN index for efficient querying of JSONB data
    table.index(['route_points'], 'idx_orders_route_points', 'gin');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('orders', (table) => {
    // Drop the GIN index first
    table.dropIndex(['route_points'], 'idx_orders_route_points');
    
    // Drop the route columns
    table.dropColumn('route_points');
    table.dropColumn('route_details');
  });
}
