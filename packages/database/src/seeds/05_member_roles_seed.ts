import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('member_roles').del();

  // Inserts seed entries
  await knex('member_roles').insert([
    // El Buen Sabor - Roles
    {
      id: 1,
      uuid: '550e8400-e29b-41d4-a716-446655440401',
      organization_member_id: 1, // María García
      role_name: 'OWNER',
      description: 'Propietaria del restaurante con acceso completo',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: true, read: true, update: true, delete: true, assign: true },
        drivers: { create: true, read: true, update: true, delete: true, assign: true },
        customers: { create: true, read: true, update: true, delete: true },
        reports: { read: true, export: true },
        settings: { read: true, update: true }
      }),
    },
    {
      id: 2,
      uuid: '550e8400-e29b-41d4-a716-446655440411',
      organization_member_id: 2, // Carlos López
      role_name: 'ADMIN',
      description: 'Administrador con acceso completo excepto configuración',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: true, read: true, update: true, delete: true, assign: true },
        drivers: { create: true, read: true, update: true, delete: true, assign: true },
        customers: { create: true, read: true, update: true, delete: true },
        reports: { read: true, export: true },
        settings: { read: true, update: false }
      }),
    },
    {
      id: 3,
      uuid: '550e8400-e29b-41d4-a716-446655440421',
      organization_member_id: 3, // Ana Martínez
      role_name: 'ORDER_MANAGER',
      description: 'Gestora de pedidos con acceso a pedidos y clientes',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: true, read: true, update: true, delete: false, assign: true },
        drivers: { create: false, read: true, update: false, delete: false, assign: true },
        customers: { create: true, read: true, update: true, delete: false },
        reports: { read: true, export: false },
        settings: { read: false, update: false }
      }),
    },

    // Pizza Express - Roles
    {
      id: 4,
      uuid: '550e8400-e29b-41d4-a716-446655440431',
      organization_member_id: 4, // Juan Rodríguez
      role_name: 'OWNER',
      description: 'Propietario de Pizza Express',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: true, read: true, update: true, delete: true, assign: true },
        drivers: { create: true, read: true, update: true, delete: true, assign: true },
        customers: { create: true, read: true, update: true, delete: true },
        reports: { read: true, export: true },
        settings: { read: true, update: true }
      }),
    },
    {
      id: 5,
      uuid: '550e8400-e29b-41d4-a716-446655440441',
      organization_member_id: 5, // Lucía Hernández
      role_name: 'MANAGER',
      description: 'Supervisora de operaciones',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: true, read: true, update: true, delete: false, assign: true },
        drivers: { create: false, read: true, update: true, delete: false, assign: true },
        customers: { create: true, read: true, update: true, delete: false },
        reports: { read: true, export: true },
        settings: { read: true, update: false }
      }),
    },

    // Café Central - Roles
    {
      id: 6,
      uuid: '550e8400-e29b-41d4-a716-446655440451',
      organization_member_id: 6, // Pedro Gómez
      role_name: 'OWNER',
      description: 'Propietario del Café Central',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: true, read: true, update: true, delete: true, assign: true },
        drivers: { create: true, read: true, update: true, delete: true, assign: true },
        customers: { create: true, read: true, update: true, delete: true },
        reports: { read: true, export: true },
        settings: { read: true, update: true }
      }),
    },
    {
      id: 7,
      uuid: '550e8400-e29b-41d4-a716-446655440461',
      organization_member_id: 7, // Carmen Vargas
      role_name: 'CUSTOMER_SERVICE',
      description: 'Barista con acceso a pedidos y clientes',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: true, read: true, update: true, delete: false, assign: false },
        drivers: { create: false, read: true, update: false, delete: false, assign: false },
        customers: { create: true, read: true, update: true, delete: false },
        reports: { read: false, export: false },
        settings: { read: false, update: false }
      }),
    },

    // Sushi Master - Roles
    {
      id: 8,
      uuid: '550e8400-e29b-41d4-a716-446655440471',
      organization_member_id: 8, // Roberto Silva
      role_name: 'OWNER',
      description: 'Chef ejecutivo y propietario',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: true, read: true, update: true, delete: true, assign: true },
        drivers: { create: true, read: true, update: true, delete: true, assign: true },
        customers: { create: true, read: true, update: true, delete: true },
        reports: { read: true, export: true },
        settings: { read: true, update: true }
      }),
    },
    {
      id: 9,
      uuid: '550e8400-e29b-41d4-a716-446655440481',
      organization_member_id: 9, // Sofía Torres
      role_name: 'ADMIN',
      description: 'Gerente de servicio con acceso administrativo',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: true, read: true, update: true, delete: true, assign: true },
        drivers: { create: true, read: true, update: true, delete: true, assign: true },
        customers: { create: true, read: true, update: true, delete: true },
        reports: { read: true, export: true },
        settings: { read: true, update: false }
      }),
    },

    // Driver Roles
    {
      id: 10,
      uuid: '550e8400-e29b-41d4-a716-446655440491',
      organization_member_id: 10, // Driver 1 - El Buen Sabor
      role_name: 'DRIVER',
      description: 'Conductor con acceso a pedidos asignados',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: false, read: true, update: true, delete: false, assign: false },
        drivers: { create: false, read: false, update: false, delete: false, assign: false },
        customers: { create: false, read: true, update: false, delete: false },
        reports: { read: false, export: false },
        settings: { read: false, update: false }
      }),
    },
    {
      id: 11,
      uuid: '550e8400-e29b-41d4-a716-446655440501',
      organization_member_id: 11, // Driver 2 - Pizza Express
      role_name: 'DRIVER',
      description: 'Conductor con acceso a pedidos asignados',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: false, read: true, update: true, delete: false, assign: false },
        drivers: { create: false, read: false, update: false, delete: false, assign: false },
        customers: { create: false, read: true, update: false, delete: false },
        reports: { read: false, export: false },
        settings: { read: false, update: false }
      }),
    },
    {
      id: 12,
      uuid: '550e8400-e29b-41d4-a716-446655440511',
      organization_member_id: 12, // Driver 3 - Sushi Master
      role_name: 'DRIVER',
      description: 'Conductor con acceso a pedidos asignados',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: false, read: true, update: true, delete: false, assign: false },
        drivers: { create: false, read: false, update: false, delete: false, assign: false },
        customers: { create: false, read: true, update: false, delete: false },
        reports: { read: false, export: false },
        settings: { read: false, update: false }
      }),
    },

    // Multiple roles for some members (example: María García also has MANAGER role)
    {
      id: 13,
      uuid: '550e8400-e29b-41d4-a716-446655440521',
      organization_member_id: 1, // María García
      role_name: 'MANAGER',
      description: 'Rol adicional de gerente',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: true, read: true, update: true, delete: false, assign: true },
        drivers: { create: false, read: true, update: true, delete: false, assign: true },
        customers: { create: true, read: true, update: true, delete: false },
        reports: { read: true, export: true },
        settings: { read: true, update: false }
      }),
    },
  ]);
}
