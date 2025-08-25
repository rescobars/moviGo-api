import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('organization_members', (table) => {
    table.bigIncrements('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Foreign keys
    table.bigInteger('organization_id').unsigned().notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.bigInteger('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    
    // Member details
    table.string('title'); // Job title or role title
    table.text('notes');
    
    // Member status
    table.enum('status', ['ACTIVE', 'INACTIVE', 'PENDING']).defaultTo('ACTIVE');
    table.boolean('is_active').defaultTo(true);
    
    // Timestamps
    table.timestamp('joined_at').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['organization_id']);
    table.index(['user_id']);
    table.index(['status']);
    table.index(['is_active']);
    table.index(['joined_at']);
    
    // Unique constraint: user can only be member once per organization
    table.unique(['organization_id', 'user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('organization_members');
}
