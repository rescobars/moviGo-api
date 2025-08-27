import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('routes', (table) => {
    // Identificadores según reglas
    table.bigIncrements('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Campos obligatorios
    table.bigInteger('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    
    // Información básica de la ruta
    table.string('name').notNullable();
    table.text('description');
    
    // Estados de la ruta
    table.enum('status', ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).notNullable().defaultTo('PLANNED');
    
    // Tipos de ruta
    table.enum('type', ['SCHEDULED', 'ON_DEMAND', 'OPTIMIZED']).notNullable().defaultTo('ON_DEMAND');
    
    // Configuración de la ruta
    table.timestamp('planned_start_time');
    table.timestamp('planned_end_time');
    table.timestamp('actual_start_time');
    table.timestamp('actual_end_time');
    
    // Información de la ruta
    table.integer('total_distance_km').defaultTo(0); // Distancia total en kilómetros
    table.integer('estimated_duration_minutes').defaultTo(0); // Duración estimada en minutos
    table.integer('total_orders').defaultTo(0); // Número total de pedidos en la ruta
    
    // Campos de auditoría según reglas
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Índices para optimización
    table.index(['organization_id']);
    table.index(['status']);
    table.index(['type']);
    table.index(['planned_start_time']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('routes');
}
