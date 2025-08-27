import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('route_users', (table) => {
    // Identificadores según reglas
    table.bigIncrements('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Campos obligatorios
    table.bigInteger('route_id').notNullable().references('id').inTable('routes').onDelete('CASCADE');
    table.bigInteger('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    
    // Información de la asignación
    table.string('role').notNullable().defaultTo('DRIVER'); // 'DRIVER', 'BACKUP_DRIVER', 'SUPERVISOR'
    table.text('notes'); // Notas sobre la asignación
    table.boolean('is_active').defaultTo(true);
    
    // Campos de auditoría según reglas
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Índices para optimización
    table.index(['route_id']);
    table.index(['user_id']);
    table.index(['role']);
    table.index(['is_active']);
    
    // Restricción única para evitar duplicados
    table.unique(['route_id', 'user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('route_users');
}
