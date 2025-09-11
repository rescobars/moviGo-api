import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('route_driver', (table) => {
    table.bigIncrements('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Foreign keys
    table.bigInteger('route_id').notNullable().references('id').inTable('routes').onDelete('CASCADE');
    table.bigInteger('driver_user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    
    // Driver assignment details
    table.timestamp('assigned_at').defaultTo(knex.fn.now()); // Cuando se asignó la ruta al conductor
    table.timestamp('start_time').nullable(); // Hora de inicio programada para este conductor
    table.timestamp('actual_start_time').nullable(); // Hora de inicio real
    table.timestamp('estimated_end_time').nullable(); // Hora estimada de finalización
    table.timestamp('actual_end_time').nullable(); // Hora real de finalización
    
    // Execution details specific to this driver
    table.integer('estimated_duration_minutes').nullable(); // Duración estimada en minutos
    table.integer('actual_duration_minutes').nullable(); // Duración real en minutos
    table.decimal('total_distance_km', 10, 2).nullable(); // Distancia total en km
    
    // Driver-specific information
    table.text('driver_notes').nullable(); // Notas del conductor sobre la ruta
    table.jsonb('driver_instructions').nullable(); // Instrucciones específicas para este conductor
    table.jsonb('vehicle_info').nullable(); // Información del vehículo asignado a este conductor
    table.jsonb('route_progress').nullable(); // Progreso de la ruta (checkpoints, etc.)
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['route_id']);
    table.index(['driver_user_id']);
    table.index(['start_time']);
    table.index(['assigned_at']);
    
    // Unique constraint to prevent duplicate driver-route assignments
    table.unique(['route_id', 'driver_user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('route_driver');
}
