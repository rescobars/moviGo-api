import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Hash passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create organization
  const [organization] = await knex('organizations').insert({
    name: 'El Buen Sabor',
    slug: 'el-buen-sabor',
    description: 'Restaurante de comida tradicional guatemalteca',
    domain: 'elbuensabor.com',
    contact_email: 'info@elbuensabor.com',
    contact_phone: '+502 2222-0000',
    address: 'Zona 1, Ciudad de Guatemala',
    status: 'ACTIVE',
    plan_type: 'PRO',
    subscription_expires_at: new Date('2026-12-31'),
  }).returning('*');

  // Create users for El Buen Sabor
  const users = await knex('users').insert([
    {
      email: 'maria.garcia@elbuensabor.com',
      name: 'María García',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      email: 'carlos.lopez@elbuensabor.com',
      name: 'Carlos López',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      email: 'ana.martinez@elbuensabor.com',
      name: 'Ana Martínez',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      email: 'driver1@elbuensabor.com',
      name: 'Miguel Ángel Pérez',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
  ]).returning('*');

  // Create organization members
  const members = await knex('organization_members').insert([
    {
      organization_id: organization.id,
      user_id: users[0].id, // María García
      title: 'Gerente General',
      status: 'ACTIVE',
    },
    {
      organization_id: organization.id,
      user_id: users[1].id, // Carlos López
      title: 'Chef Principal',
      status: 'ACTIVE',
    },
    {
      organization_id: organization.id,
      user_id: users[2].id, // Ana Martínez
      title: 'Administradora',
      status: 'ACTIVE',
    },
    {
      organization_id: organization.id,
      user_id: users[3].id, // Miguel Ángel Pérez
      title: 'Conductor',
      status: 'ACTIVE',
    },
  ]).returning('*');

  // Create member roles
  await knex('member_roles').insert([
    {
      organization_member_id: members[0].id, // María García
      role_name: 'OWNER',
      description: 'Propietaria de El Buen Sabor',
    },
    {
      organization_member_id: members[1].id, // Carlos López
      role_name: 'DRIVER',
      description: 'Chef y conductor de El Buen Sabor',
    },
    {
      organization_member_id: members[2].id, // Ana Martínez
      role_name: 'DRIVER',
      description: 'Administradora de El Buen Sabor',
    },
    {
      organization_member_id: members[3].id, // Miguel Ángel Pérez
      role_name: 'DRIVER',
      description: 'Conductor de El Buen Sabor',
    },
  ]);
}
