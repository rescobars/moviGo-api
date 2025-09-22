import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('driver_transmissions', (table) => {
    table.timestamp('transmission_timestamp').nullable().comment('Timestamp from the producer/driver device');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('driver_transmissions', (table) => {
    table.dropColumn('transmission_timestamp');
  });
}
