import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Hash passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create organization
  const [organization] = await knex('organizations').insert({
    name: 'Sushi Master',
    slug: 'sushi-master',
    description: 'Restaurante de sushi y comida japonesa',
    domain: 'sushimaster.gt',
    contact_email: 'info@sushimaster.gt',
    contact_phone: '+502 4444-0000',
    address: 'Zona 15, Ciudad de Guatemala',
    status: 'ACTIVE',
    plan_type: 'ENTERPRISE',
    subscription_expires_at: new Date('2027-12-31'),
  }).returning('*');

  // Create users for Sushi Master
  const users = await knex('users').insert([
    {
      email: 'roberto.silva@sushimaster.gt',
      name: 'Roberto Silva',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      email: 'sofia.torres@sushimaster.gt',
      name: 'Sofía Torres',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      email: 'driver3@sushimaster.gt',
      name: 'Fernando Ramírez',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
  ]).returning('*');

  // Create organization members
  const members = await knex('organization_members').insert([
    {
      organization_id: organization.id,
      user_id: users[0].id, // Roberto Silva
      title: 'Chef Principal',
      status: 'ACTIVE',
    },
    {
      organization_id: organization.id,
      user_id: users[1].id, // Sofía Torres
      title: 'Gerente',
      status: 'ACTIVE',
    },
    {
      organization_id: organization.id,
      user_id: users[2].id, // Fernando Ramírez
      title: 'Conductor',
      status: 'ACTIVE',
    },
  ]).returning('*');

  // Create member roles
  await knex('member_roles').insert([
    {
      organization_member_id: members[0].id, // Roberto Silva
      role_name: 'OWNER',
      description: 'Propietario y Chef Principal de Sushi Master',
    },
    {
      organization_member_id: members[1].id, // Sofía Torres
      role_name: 'DRIVER',
      description: 'Gerente de Sushi Master',
    },
    {
      organization_member_id: members[2].id, // Fernando Ramírez
      role_name: 'DRIVER',
      description: 'Conductor de Sushi Master',
    },
  ]);
}
