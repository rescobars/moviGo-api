import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('driver_transmissions', (table) => {
    // Identificadores según reglas
    table.bigIncrements('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Referencias a otras tablas
    table.bigInteger('driver_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.bigInteger('route_id').notNullable().references('id').inTable('routes').onDelete('CASCADE');
    table.bigInteger('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    
    // Información del vehículo (opcional)
    table.string('vehicle_id');
    
    // Ubicación GPS
    table.decimal('latitude', 10, 8).notNullable();
    table.decimal('longitude', 11, 8).notNullable();
    table.decimal('accuracy', 8, 2); // Precisión en metros
    table.decimal('altitude', 8, 2); // Altitud en metros
    table.decimal('speed', 8, 2); // Velocidad en km/h
    table.decimal('heading', 6, 2); // Dirección en grados (0-360)
    
    // Estado del driver
    table.enum('status', ['DRIVING', 'STOPPED', 'OFFLINE', 'BREAK', 'MAINTENANCE']).notNullable().defaultTo('DRIVING');
    
    // Información del dispositivo
    table.decimal('battery_level', 5, 2); // Porcentaje de batería (0-100)
    table.decimal('signal_strength', 5, 2); // Fuerza de señal (0-100)
    table.string('network_type'); // 2G, 3G, 4G, 5G, WiFi, etc.
    
    // Metadatos del dispositivo
    table.string('app_version');
    table.string('device_info');
    table.json('device_metadata'); // Para información adicional del dispositivo
    
    // Campos de auditoría según reglas
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Índices para optimización
    table.index(['driver_id']);
    table.index(['route_id']);
    table.index(['organization_id']);
    table.index(['status']);
    table.index(['created_at']);
    table.index(['latitude', 'longitude']); // Índice espacial para consultas de ubicación
    table.index(['driver_id', 'created_at']); // Para consultas por driver y tiempo
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('driver_transmissions');
}
