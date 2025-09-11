import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('route_driver', (table) => {
    table.bigIncrements('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Foreign keys
    table.bigInteger('route_id').notNullable().references('id').inTable('routes').onDelete('CASCADE');
    table.bigInteger('driver_organization_member_id').notNullable().references('id').inTable('organization_members').onDelete('CASCADE');
    
    // Driver assignment details
    table.timestamp('start_time').nullable(); // Hora de inicio programada
    table.timestamp('end_time').nullable(); // Hora de finalización
    
    // Driver-specific information
    table.text('driver_notes').nullable(); // Notas del conductor sobre la ruta
    table.jsonb('driver_instructions').nullable(); // Instrucciones específicas para este conductor
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['route_id']);
    table.index(['driver_organization_member_id']);
    table.index(['uuid']);
    
    // Unique constraint to prevent duplicate driver-route assignments
    table.unique(['route_id', 'driver_organization_member_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('route_driver');
}
