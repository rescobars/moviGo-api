import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Hash passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create movi go inc organization
  const [organization] = await knex('organizations').insert({
    name: 'movi go inc',
    slug: 'movigo-inc',
    description: 'Empresa principal de moviGo - Plataforma de delivery y movilidad',
    domain: 'movigo.com',
    contact_email: 'info@movigo.com',
    contact_phone: '+502 5555-0000',
    address: 'Zona 10, Ciudad de Guatemala',
    status: 'ACTIVE',
    plan_type: 'ENTERPRISE',
    subscription_expires_at: new Date('2030-12-31'),
  }).returning('*');

  // Get existing admin users
  const adminUsers = await knex('users')
    .whereIn('email', ['admin@movigo.com', 'superadmin@movigo.com', 'manager@movigo.com'])
    .select('*');

  // Create organization members for admin users
  const members = await knex('organization_members').insert([
    {
      organization_id: organization.id,
      user_id: adminUsers.find(u => u.email === 'admin@movigo.com')?.id,
      title: 'CEO & Fundador',
      status: 'ACTIVE',
    },
    {
      organization_id: organization.id,
      user_id: adminUsers.find(u => u.email === 'superadmin@movigo.com')?.id,
      title: 'CTO & Super Administrador',
      status: 'ACTIVE',
    },
    {
      organization_id: organization.id,
      user_id: adminUsers.find(u => u.email === 'manager@movigo.com')?.id,
      title: 'Gerente de Operaciones',
      status: 'ACTIVE',
    },
  ]).returning('*');

  // Create member roles for admin users
  await knex('member_roles').insert([
    {
      organization_member_id: members[0].id, // admin@movigo.com
      role_name: 'OWNER',
      description: 'Propietario y CEO de movi go inc',
    },
    {
      organization_member_id: members[1].id, // superadmin@movigo.com
      role_name: 'OWNER',
      description: 'CTO y Super Administrador de movi go inc',
    },
    {
      organization_member_id: members[2].id, // manager@movigo.com
      role_name: 'ADMIN',
      description: 'Gerente de Operaciones de movi go inc',
    },
  ]);
}
