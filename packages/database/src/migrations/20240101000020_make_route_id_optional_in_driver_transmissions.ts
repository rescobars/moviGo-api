import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Hacer route_id opcional
  await knex.schema.alterTable('driver_transmissions', (table) => {
    table.bigInteger('route_id').nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Revertir: hacer route_id obligatorio nuevamente
  await knex.schema.alterTable('driver_transmissions', (table) => {
    table.bigInteger('route_id').notNullable().alter();
  });
}
