import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('organizations', (table) => {
    table.bigIncrements('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Organization details
    table.string('name').notNullable();
    table.text('description');
    table.string('domain').unique();
    table.string('logo_url');
    table.string('website_url');
    
    // Contact information
    table.string('contact_email');
    table.string('contact_phone');
    table.text('address');
    
    // Organization status
    table.enum('status', ['ACTIVE', 'INACTIVE', 'SUSPENDED']).defaultTo('ACTIVE');
    table.boolean('is_active').defaultTo(true);
    
    // Subscription/plan information
    table.string('plan_type').defaultTo('FREE');
    table.timestamp('subscription_expires_at');
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['name']);
    table.index(['domain']);
    table.index(['status']);
    table.index(['is_active']);
    table.index(['plan_type']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('organizations');
}
