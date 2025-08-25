import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Hash passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  // Inserts additional seed entries (keeping existing users)
  await knex('users').insert([
    {
      id: 3,
      uuid: '550e8400-e29b-41d4-a716-446655440051',
      email: 'maria.garcia@elbuensabor.com',
      name: 'María García',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 4,
      uuid: '550e8400-e29b-41d4-a716-446655440061',
      email: 'carlos.lopez@elbuensabor.com',
      name: 'Carlos López',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 5,
      uuid: '550e8400-e29b-41d4-a716-446655440071',
      email: 'ana.martinez@elbuensabor.com',
      name: 'Ana Martínez',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 6,
      uuid: '550e8400-e29b-41d4-a716-446655440081',
      email: 'juan.rodriguez@pizzaexpress.gt',
      name: 'Juan Rodríguez',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 7,
      uuid: '550e8400-e29b-41d4-a716-446655440091',
      email: 'lucia.hernandez@pizzaexpress.gt',
      name: 'Lucía Hernández',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 8,
      uuid: '550e8400-e29b-41d4-a716-446655440101',
      email: 'pedro.gomez@cafecentral.gt',
      name: 'Pedro Gómez',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 9,
      uuid: '550e8400-e29b-41d4-a716-446655440111',
      email: 'carmen.vargas@cafecentral.gt',
      name: 'Carmen Vargas',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 10,
      uuid: '550e8400-e29b-41d4-a716-446655440121',
      email: 'roberto.silva@sushimaster.gt',
      name: 'Roberto Silva',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 11,
      uuid: '550e8400-e29b-41d4-a716-446655440131',
      email: 'sofia.torres@sushimaster.gt',
      name: 'Sofía Torres',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 12,
      uuid: '550e8400-e29b-41d4-a716-446655440141',
      email: 'driver1@movigo.com',
      name: 'Conductor Uno',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 13,
      uuid: '550e8400-e29b-41d4-a716-446655440151',
      email: 'driver2@movigo.com',
      name: 'Conductor Dos',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 14,
      uuid: '550e8400-e29b-41d4-a716-446655440161',
      email: 'driver3@movigo.com',
      name: 'Conductor Tres',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
  ]);
}
