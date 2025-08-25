import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('member_roles', (table) => {
    table.bigIncrements('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Foreign keys
    table.bigInteger('organization_member_id').unsigned().notNullable().references('id').inTable('organization_members').onDelete('CASCADE');
    
    // Role details
    table.string('role_name').notNullable(); // e.g., 'ORDER_MANAGER', 'DRIVER', 'ADMIN', 'VIEWER'
    table.text('description');
    
    // Role status
    table.enum('status', ['ACTIVE', 'INACTIVE']).defaultTo('ACTIVE');
    table.boolean('is_active').defaultTo(true);
    
    // Permissions (JSON field for flexible permissions)
    table.jsonb('permissions').defaultTo('{}');
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['organization_member_id']);
    table.index(['role_name']);
    table.index(['status']);
    table.index(['is_active']);
    table.index(['created_at']);
    
    // Unique constraint: member can only have one instance of each role
    table.unique(['organization_member_id', 'role_name']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('member_roles');
}
