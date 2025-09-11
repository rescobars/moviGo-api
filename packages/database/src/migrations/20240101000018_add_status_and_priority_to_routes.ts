import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('routes', (table) => {
    // Add status and priority columns
    table.enum('status', ['PLANNED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PAUSED']).defaultTo('PLANNED');
    table.enum('priority', ['LOW', 'MEDIUM', 'HIGH', 'URGENT']).defaultTo('MEDIUM');
    
    // Add indexes for better query performance
    table.index(['status']);
    table.index(['priority']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('routes', (table) => {
    table.dropColumn('status');
    table.dropColumn('priority');
  });
}
