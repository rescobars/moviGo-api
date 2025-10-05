import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('orders', (table) => {
    // Add details column as jsonb
    table.jsonb('details').nullable();
    
    // Make pickup_address nullable
    table.string('pickup_address').nullable().alter();
    
    // Make total_amount nullable
    table.decimal('total_amount', 10, 2).nullable().alter();
    
    // Add GIN index for efficient querying of JSONB data
    table.index(['details'], 'idx_orders_details', 'gin');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('orders', (table) => {
    // Drop the GIN index first
    table.dropIndex(['details'], 'idx_orders_details');
    
    // Drop the details column
    table.dropColumn('details');
    
    // Revert pickup_address to not nullable
    table.string('pickup_address').notNullable().alter();
    
    // Revert total_amount to not nullable with default
    table.decimal('total_amount', 10, 2).notNullable().defaultTo(0).alter();
  });
}
