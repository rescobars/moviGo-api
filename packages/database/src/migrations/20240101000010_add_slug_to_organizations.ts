import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('organizations', (table) => {
    table.string('slug').unique().after('name');
    table.index(['slug']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('organizations', (table) => {
    table.dropColumn('slug');
  });
}
