import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('orders', (table) => {
    // Identificadores según reglas
    table.bigIncrements('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Campos obligatorios
    table.bigInteger('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    
    // Campos opcionales
    table.bigInteger('user_id').references('id').inTable('users').onDelete('SET NULL');
    
    // Información básica del pedido
    table.string('order_number').notNullable().unique();
    table.text('description');
    table.decimal('total_amount', 10, 2).notNullable().defaultTo(0);
    
    // Estados del pedido
    table.enum('status', ['PENDING', 'ASSIGNED', 'COMPLETED', 'CANCELLED']).notNullable().defaultTo('PENDING');
    
    // Ubicaciones (punto A y punto B)
    table.string('pickup_address').notNullable();
    table.string('delivery_address').notNullable();
    table.decimal('pickup_lat', 10, 8);
    table.decimal('pickup_lng', 11, 8);
    table.decimal('delivery_lat', 10, 8);
    table.decimal('delivery_lng', 11, 8);
    
    // Campos de auditoría según reglas
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Índices para optimización
    table.index(['organization_id']);
    table.index(['user_id']);
    table.index(['status']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('orders');
}
