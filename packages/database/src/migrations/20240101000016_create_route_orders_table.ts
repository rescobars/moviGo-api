import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('route_orders', (table) => {
    // Identificadores según reglas
    table.bigIncrements('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Campos obligatorios
    table.bigInteger('route_id').notNullable().references('id').inTable('routes').onDelete('CASCADE');
    table.bigInteger('order_id').notNullable().references('id').inTable('orders').onDelete('CASCADE');
    
    // Información de la relación
    table.integer('sequence_order').notNullable(); // Orden del pedido en la ruta
    table.bigInteger('pickup_waypoint_id').references('id').inTable('route_waypoints').onDelete('SET NULL');
    table.bigInteger('delivery_waypoint_id').references('id').inTable('route_waypoints').onDelete('SET NULL');
    
    // Estado del pedido en la ruta
    table.enum('status', ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED']).notNullable().defaultTo('PENDING');
    
    // Información de tiempo
    table.timestamp('estimated_pickup_time');
    table.timestamp('actual_pickup_time');
    table.timestamp('estimated_delivery_time');
    table.timestamp('actual_delivery_time');
    
    // Campos de auditoría según reglas
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Índices para optimización
    table.index(['route_id']);
    table.index(['order_id']);
    table.index(['sequence_order']);
    table.index(['status']);
    table.index(['estimated_pickup_time']);
    table.index(['estimated_delivery_time']);
    
    // Restricción única para evitar duplicados
    table.unique(['route_id', 'order_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('route_orders');
}
