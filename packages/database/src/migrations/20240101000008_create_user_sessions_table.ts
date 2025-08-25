import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_sessions', (table) => {
    table.bigIncrements('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Foreign keys
    table.bigInteger('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    
    // Session details
    table.string('refresh_token_hash').notNullable().unique(); // Hashed refresh token
    table.jsonb('session_data').defaultTo('{}'); // User session data (organizations, preferences, etc.)
    
    // Device information
    table.string('device_id').nullable(); // Unique device identifier
    table.string('device_name').nullable(); // Device name (e.g., "iPhone 15", "Chrome on Windows")
    table.string('ip_address').nullable(); // IP address
    table.string('user_agent').nullable(); // Browser/device info
    
    // Session status
    table.enum('status', ['ACTIVE', 'EXPIRED', 'REVOKED']).defaultTo('ACTIVE');
    table.boolean('is_active').defaultTo(true);
    
    // Timestamps
    table.timestamp('last_activity').defaultTo(knex.fn.now());
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['user_id']);
    table.index(['refresh_token_hash']);
    table.index(['device_id']);
    table.index(['status']);
    table.index(['is_active']);
    table.index(['expires_at']);
    table.index(['last_activity']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user_sessions');
}
