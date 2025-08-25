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
      id: '550e8400-e29b-41d4-a716-446655440000',
      uuid: '550e8400-e29b-41d4-a716-446655440002',
      email: 'admin@movigo.com',
      name: 'Admin User',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      uuid: '550e8400-e29b-41d4-a716-446655440003',
      email: 'user@movigo.com',
      name: 'Test User',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
  ]);
}
