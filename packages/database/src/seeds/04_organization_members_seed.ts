import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('organization_members').del();

  // Inserts seed entries
  await knex('organization_members').insert([
    // El Buen Sabor - Members
    {
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440201',
      organization_id: 1, // El Buen Sabor
      user_id: 3, // María García
      title: 'Propietaria',
      notes: 'Fundadora del restaurante',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 2,
      uuid: '550e8400-e29b-41d4-a716-446655440211',
      organization_id: 1, // El Buen Sabor
      user_id: 4, // Carlos López
      title: 'Gerente de Operaciones',
      notes: 'Encargado de la gestión diaria',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 3,
      uuid: '550e8400-e29b-41d4-a716-446655440221',
      organization_id: 1, // El Buen Sabor
      user_id: 5, // Ana Martínez
      title: 'Gestora de Pedidos',
      notes: 'Maneja los pedidos y la atención al cliente',
      status: 'ACTIVE',
      is_active: true,
    },

    // Pizza Express - Members
    {
      id: 4,
      uuid: '550e8400-e29b-41d4-a716-446655440231',
      organization_id: 2, // Pizza Express
      user_id: 6, // Juan Rodríguez
      title: 'Propietario',
      notes: 'Fundador de Pizza Express',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 5,
      uuid: '550e8400-e29b-41d4-a716-446655440241',
      organization_id: 2, // Pizza Express
      user_id: 7, // Lucía Hernández
      title: 'Supervisora',
      notes: 'Supervisa las operaciones diarias',
      status: 'ACTIVE',
      is_active: true,
    },

    // Café Central - Members
    {
      id: 6,
      uuid: '550e8400-e29b-41d4-a716-446655440251',
      organization_id: 3, // Café Central
      user_id: 8, // Pedro Gómez
      title: 'Propietario',
      notes: 'Fundador del Café Central',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 7,
      uuid: '550e8400-e29b-41d4-a716-446655440261',
      organization_id: 3, // Café Central
      user_id: 9, // Carmen Vargas
      title: 'Barista Principal',
      notes: 'Experta en preparación de café',
      status: 'ACTIVE',
      is_active: true,
    },

    // Sushi Master - Members
    {
      id: 8,
      uuid: '550e8400-e29b-41d4-a716-446655440271',
      organization_id: 4, // Sushi Master
      user_id: 10, // Roberto Silva
      title: 'Chef Ejecutivo',
      notes: 'Chef principal y propietario',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 9,
      uuid: '550e8400-e29b-41d4-a716-446655440281',
      organization_id: 4, // Sushi Master
      user_id: 11, // Sofía Torres
      title: 'Gerente de Servicio',
      notes: 'Maneja el servicio al cliente y reservas',
      status: 'ACTIVE',
      is_active: true,
    },

    // Drivers (shared across organizations)
    {
      id: 10,
      uuid: '550e8400-e29b-41d4-a716-446655440291',
      organization_id: 1, // El Buen Sabor
      user_id: 12, // Driver 1
      title: 'Conductor',
      notes: 'Conductor asignado a El Buen Sabor',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 11,
      uuid: '550e8400-e29b-41d4-a716-446655440301',
      organization_id: 2, // Pizza Express
      user_id: 13, // Driver 2
      title: 'Conductor',
      notes: 'Conductor asignado a Pizza Express',
      status: 'ACTIVE',
      is_active: true,
    },
    {
      id: 12,
      uuid: '550e8400-e29b-41d4-a716-446655440311',
      organization_id: 4, // Sushi Master
      user_id: 14, // Driver 3
      title: 'Conductor',
      notes: 'Conductor asignado a Sushi Master',
      status: 'ACTIVE',
      is_active: true,
    },
  ]);
}
