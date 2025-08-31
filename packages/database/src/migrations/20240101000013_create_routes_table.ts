import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('routes', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.string('route_name').notNullable();
    table.text('description');
    
    // Origin coordinates and name
    table.decimal('origin_lat', 10, 8).notNullable();
    table.decimal('origin_lon', 11, 8).notNullable();
    table.string('origin_name').notNullable();
    
    // Destination coordinates and name
    table.decimal('destination_lat', 10, 8).notNullable();
    table.decimal('destination_lon', 11, 8).notNullable();
    table.string('destination_name').notNullable();
    
    // JSONB columns for complex data
    table.jsonb('waypoints').notNullable(); // Array of waypoint objects
    table.jsonb('route_points').notNullable(); // Array of route point objects (can be thousands)
    table.jsonb('ordered_waypoints').notNullable(); // Array of order objects with sequence
    table.jsonb('traffic_condition').notNullable(); // Traffic condition object
    
    table.integer('traffic_delay').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['organization_id']);
    table.index(['created_at']);
    
    // GIN indexes for JSONB columns for efficient querying
    table.index(['waypoints'], 'idx_routes_waypoints', 'gin');
    table.index(['route_points'], 'idx_routes_route_points', 'gin');
    table.index(['ordered_waypoints'], 'idx_routes_ordered_waypoints', 'gin');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('routes');
}
