import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Crear el nuevo enum con el valor REQUESTED
  await knex.raw(`
    CREATE TYPE orders_status_new AS ENUM ('REQUESTED', 'PENDING', 'ASSIGNED', 'IN_ROUTE', 'COMPLETED', 'CANCELLED')
  `);
  
  // 2. Agregar la nueva columna order_status con el nuevo enum
  await knex.raw(`
    ALTER TABLE orders 
    ADD COLUMN order_status orders_status_new DEFAULT 'REQUESTED'::orders_status_new
  `);
  
  // 3. Migrar los datos de la columna status a order_status
  await knex.raw(`
    UPDATE orders 
    SET order_status = status::text::orders_status_new
  `);
  
  // 4. Hacer que la nueva columna sea NOT NULL
  await knex.raw(`
    ALTER TABLE orders 
    ALTER COLUMN order_status SET NOT NULL
  `);
  
  // 5. Eliminar la columna status original
  await knex.raw(`
    ALTER TABLE orders 
    DROP COLUMN status
  `);
  
  // 6. Renombrar order_status a status
  await knex.raw(`
    ALTER TABLE orders 
    RENAME COLUMN order_status TO status
  `);
  
  // 7. Eliminar el enum viejo
  await knex.raw(`DROP TYPE IF EXISTS orders_status_enum CASCADE`);
  
  // 8. Renombrar el nuevo enum al nombre original
  await knex.raw(`ALTER TYPE orders_status_new RENAME TO orders_status_enum`);
}

export async function down(knex: Knex): Promise<void> {
  // 1. Crear el enum original sin REQUESTED
  await knex.raw(`
    CREATE TYPE orders_status_old AS ENUM ('PENDING', 'ASSIGNED', 'IN_ROUTE', 'COMPLETED', 'CANCELLED')
  `);
  
  // 2. Agregar columna temporal con el enum original
  await knex.raw(`
    ALTER TABLE orders 
    ADD COLUMN status_old orders_status_old
  `);
  
  // 3. Migrar datos (solo los que existen en el enum original)
  await knex.raw(`
    UPDATE orders 
    SET status_old = status::text::orders_status_old
    WHERE status IN ('PENDING', 'ASSIGNED', 'IN_ROUTE', 'COMPLETED', 'CANCELLED')
  `);
  
  // 4. Para los pedidos con status REQUESTED, convertirlos a PENDING
  await knex.raw(`
    UPDATE orders 
    SET status_old = 'PENDING'::orders_status_old
    WHERE status = 'REQUESTED'
  `);
  
  // 5. Eliminar la columna status con REQUESTED
  await knex.raw(`
    ALTER TABLE orders 
    DROP COLUMN status
  `);
  
  // 6. Renombrar status_old a status
  await knex.raw(`
    ALTER TABLE orders 
    RENAME COLUMN status_old TO status
  `);
  
  // 7. Hacer que la columna sea NOT NULL
  await knex.raw(`
    ALTER TABLE orders 
    ALTER COLUMN status SET NOT NULL
  `);
  
  // 8. Eliminar el enum con REQUESTED
  await knex.raw(`DROP TYPE IF EXISTS orders_status_enum CASCADE`);
  
  // 9. Renombrar el enum original
  await knex.raw(`ALTER TYPE orders_status_old RENAME TO orders_status_enum`);
}
