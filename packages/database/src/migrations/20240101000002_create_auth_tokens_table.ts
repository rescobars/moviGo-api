import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('auth_tokens', (table) => {
    table.bigIncrements('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
    table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('token').notNullable().unique();
    table.enum('type', ['EMAIL_VERIFICATION', 'PASSWORDLESS_LOGIN', 'PASSWORD_RESET']).notNullable();
    table.enum('status', ['PENDING', 'USED', 'EXPIRED']).defaultTo('PENDING');
    table.timestamp('expires_at').notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['token']);
    table.index(['user_id']);
    table.index(['type']);
    table.index(['status']);
    table.index(['expires_at']);
    table.index(['is_active']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('auth_tokens');
}
