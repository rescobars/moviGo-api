import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Hash passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create organization
  const [organization] = await knex('organizations').insert({
    name: 'Café Central',
    slug: 'cafe-central',
    description: 'Cafetería con el mejor café de Guatemala',
    domain: 'cafecentral.gt',
    contact_email: 'info@cafecentral.gt',
    contact_phone: '+502 5555-0000',
    address: 'Zona 4, Ciudad de Guatemala',
    status: 'ACTIVE',
    plan_type: 'FREE',
    subscription_expires_at: new Date('2025-12-31'),
  }).returning('*');

  // Create users for Café Central
  const users = await knex('users').insert([
    {
      email: 'pedro.gomez@cafecentral.gt',
      name: 'Pedro Gómez',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      email: 'carmen.vargas@cafecentral.gt',
      name: 'Carmen Vargas',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
  ]).returning('*');

  // Create organization members
  const members = await knex('organization_members').insert([
    {
      organization_id: organization.id,
      user_id: users[0].id, // Pedro Gómez
      title: 'Barista Principal',
      status: 'ACTIVE',
    },
    {
      organization_id: organization.id,
      user_id: users[1].id, // Carmen Vargas
      title: 'Gerente',
      status: 'ACTIVE',
    },
  ]).returning('*');

  // Create member roles
  await knex('member_roles').insert([
    {
      organization_member_id: members[0].id, // Pedro Gómez
      role_name: 'OWNER',
      description: 'Propietario y Barista Principal de Café Central',
    },
    {
      organization_member_id: members[1].id, // Carmen Vargas
      role_name: 'DRIVER',
      description: 'Gerente de Café Central',
    },
  ]);
}
