import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('routes', (table) => {
    table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('routes', (table) => {
    table.dropColumn('uuid');
  });
}
