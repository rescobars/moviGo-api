import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('organization_members').del();

  // Inserts seed entries
  await knex('organization_members').insert([
    // El Buen Sabor - Members
    {
      id: 1,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 1,
      user_id: 2, // María García
      title: 'Propietaria',
      notes: 'Fundadora del restaurante',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 2,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 1,
      user_id: 3, // Carlos López
      title: 'Gerente General',
      notes: 'Administrador principal',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 3,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 1,
      user_id: 4, // Ana Martínez
      title: 'Supervisora de Pedidos',
      notes: 'Gestora de operaciones',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 10,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 1,
      user_id: 11, // Driver 1
      title: 'Conductor',
      notes: 'Delivery especializado',
      status: 'ACTIVE',
      is_active: true,
    },

    // Pizza Express - Members
    {
      id: 4,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 2,
      user_id: 5, // Juan Rodríguez
      title: 'Propietario',
      notes: 'Fundador de Pizza Express',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 5,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 2,
      user_id: 6, // Lucía Hernández
      title: 'Supervisora',
      notes: 'Gerente de operaciones',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 11,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 2,
      user_id: 12, // Driver 2
      title: 'Conductor',
      notes: 'Delivery rápido',
      status: 'ACTIVE',
      is_active: true,
    },

    // Café Central - Members
    {
      id: 6,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 3,
      user_id: 7, // Pedro Gómez
      title: 'Propietario',
      notes: 'Barista principal',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 7,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 3,
      user_id: 8, // Carmen Vargas
      title: 'Barista',
      notes: 'Especialista en café',
      status: 'ACTIVE',
      is_active: true,
    },

    // Sushi Master - Members
    {
      id: 8,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 4,
      user_id: 9, // Roberto Silva
      title: 'Chef Ejecutivo',
      notes: 'Chef principal y propietario',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 9,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 4,
      user_id: 10, // Sofía Torres
      title: 'Gerente de Servicio',
      notes: 'Administradora del restaurante',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 12,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 4,
      user_id: 13, // Driver 3
      title: 'Conductor',
      notes: 'Delivery premium',
      status: 'ACTIVE',
      is_active: true,
    },

    // moviGo Platform - Members (Admins)
    {
      id: 13,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 5,
      user_id: 1, // Admin Principal
      title: 'Administrador Principal',
      notes: 'Admin del sistema',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 14,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 5,
      user_id: 14, // Super Admin
      title: 'Super Administrador',
      notes: 'Super admin con acceso completo',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 15,
      uuid: knex.raw('gen_random_uuid()'),
      organization_id: 5,
      user_id: 15, // Manager
      title: 'Gerente General',
      notes: 'Gerente de la plataforma',
      status: 'ACTIVE',
      is_active: true,
    },
  ]);
}
