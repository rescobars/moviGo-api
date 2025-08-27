import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('route_waypoints', (table) => {
    // Identificadores según reglas
    table.bigIncrements('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Campos obligatorios
    table.bigInteger('route_id').notNullable().references('id').inTable('routes').onDelete('CASCADE');
    
    // Información del waypoint
    table.integer('sequence_order').notNullable(); // Orden en la secuencia de la ruta
    table.string('waypoint_type').notNullable(); // 'PICKUP', 'DELIVERY', 'WAYPOINT'
    table.string('address').notNullable();
    table.decimal('latitude', 10, 8).notNullable();
    table.decimal('longitude', 11, 8).notNullable();
    
    // Información adicional del waypoint
    table.text('instructions'); // Instrucciones específicas para el conductor
    table.string('contact_name');
    table.string('contact_phone');
    table.timestamp('estimated_arrival_time');
    table.timestamp('actual_arrival_time');
    
    // Campos de auditoría según reglas
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Índices para optimización
    table.index(['route_id']);
    table.index(['sequence_order']);
    table.index(['waypoint_type']);
    table.index(['estimated_arrival_time']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('route_waypoints');
}
