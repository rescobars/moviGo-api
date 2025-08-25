import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('auth_tokens', (table) => {
    table.string('verification_code', 6).nullable().after('token');
    table.index(['verification_code']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('auth_tokens', (table) => {
    table.dropColumn('verification_code');
  });
}
