import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Hash passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create organization
  const [organization] = await knex('organizations').insert({
    name: 'Pizza Express',
    slug: 'pizza-express',
    description: 'Pizzería con las mejores pizzas de Guatemala',
    domain: 'pizzaexpress.gt',
    contact_email: 'info@pizzaexpress.gt',
    contact_phone: '+502 3333-0000',
    address: 'Zona 10, Ciudad de Guatemala',
    status: 'ACTIVE',
    plan_type: 'BASIC',
    subscription_expires_at: new Date('2026-06-30'),
  }).returning('*');

  // Create users for Pizza Express
  const users = await knex('users').insert([
    {
      email: 'juan.rodriguez@pizzaexpress.gt',
      name: 'Juan Rodríguez',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      email: 'lucia.hernandez@pizzaexpress.gt',
      name: 'Lucía Hernández',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
    {
      email: 'driver2@pizzaexpress.gt',
      name: 'José Luis Morales',
      password_hash: passwordHash,
      status: 'ACTIVE',
      is_active: true,
    },
  ]).returning('*');

  // Create organization members
  const members = await knex('organization_members').insert([
    {
      organization_id: organization.id,
      user_id: users[0].id, // Juan Rodríguez
      title: 'Gerente',
      status: 'ACTIVE',
    },
    {
      organization_id: organization.id,
      user_id: users[1].id, // Lucía Hernández
      title: 'Chef',
      status: 'ACTIVE',
    },
    {
      organization_id: organization.id,
      user_id: users[2].id, // José Luis Morales
      title: 'Conductor',
      status: 'ACTIVE',
    },
  ]).returning('*');

  // Create member roles
  await knex('member_roles').insert([
    {
      organization_member_id: members[0].id, // Juan Rodríguez
      role_name: 'OWNER',
      description: 'Propietario de Pizza Express',
    },
    {
      organization_member_id: members[1].id, // Lucía Hernández
      role_name: 'DRIVER',
      description: 'Chef de Pizza Express',
    },
    {
      organization_member_id: members[2].id, // José Luis Morales
      role_name: 'DRIVER',
      description: 'Conductor de Pizza Express',
    },
  ]);
}
