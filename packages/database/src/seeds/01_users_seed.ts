import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Hash passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  // Inserts seed entries
  await knex('users').insert([
    {
      id: 1,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'admin@movigo.com',
      name: 'Admin Principal',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 2,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'maria.garcia@elbuensabor.com',
      name: 'María García',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 3,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'carlos.lopez@elbuensabor.com',
      name: 'Carlos López',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 4,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'ana.martinez@elbuensabor.com',
      name: 'Ana Martínez',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 5,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'juan.rodriguez@pizzaexpress.gt',
      name: 'Juan Rodríguez',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 6,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'lucia.hernandez@pizzaexpress.gt',
      name: 'Lucía Hernández',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 7,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'pedro.gomez@cafecentral.gt',
      name: 'Pedro Gómez',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 8,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'carmen.vargas@cafecentral.gt',
      name: 'Carmen Vargas',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 9,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'roberto.silva@sushimaster.gt',
      name: 'Roberto Silva',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 10,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'sofia.torres@sushimaster.gt',
      name: 'Sofía Torres',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 11,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'driver1@elbuensabor.com',
      name: 'Miguel Ángel Pérez',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 12,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'driver2@pizzaexpress.gt',
      name: 'José Luis Morales',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 13,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'driver3@sushimaster.gt',
      name: 'Fernando Ramírez',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 14,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'superadmin@movigo.com',
      name: 'Super Administrador',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 15,
      uuid: knex.raw('gen_random_uuid()'),
      email: 'manager@movigo.com',
      name: 'Gerente General',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
  ]);
}
