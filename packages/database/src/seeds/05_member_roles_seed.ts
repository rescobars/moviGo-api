import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('member_roles').del();

  // Inserts seed entries
  await knex('member_roles').insert([
    // El Buen Sabor - Roles
    {
      id: 1,
      uuid: knex.raw('gen_random_uuid()'),
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
        settings: { read: true, update: true },
        billing: { read: true, update: true },
        analytics: { read: true, export: true }
      }),
    },
    {
      id: 2,
      uuid: knex.raw('gen_random_uuid()'),
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
        settings: { read: true, update: false },
        billing: { read: true, update: false },
        analytics: { read: true, export: true }
      }),
    },
    {
      id: 3,
      uuid: knex.raw('gen_random_uuid()'),
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
        settings: { read: false, update: false },
        billing: { read: false, update: false },
        analytics: { read: true, export: false }
      }),
    },
    {
      id: 10,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 10, // Driver 1
      role_name: 'DRIVER',
      description: 'Conductor con acceso a pedidos asignados',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: false, read: true, update: true, delete: false, assign: false },
        drivers: { create: false, read: false, update: false, delete: false, assign: false },
        customers: { create: false, read: true, update: false, delete: false },
        reports: { read: false, export: false },
        settings: { read: false, update: false },
        billing: { read: false, update: false },
        analytics: { read: false, export: false }
      }),
    },

    // Pizza Express - Roles
    {
      id: 4,
      uuid: knex.raw('gen_random_uuid()'),
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
        settings: { read: true, update: true },
        billing: { read: true, update: true },
        analytics: { read: true, export: true }
      }),
    },
    {
      id: 5,
      uuid: knex.raw('gen_random_uuid()'),
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
        settings: { read: true, update: false },
        billing: { read: true, update: false },
        analytics: { read: true, export: true }
      }),
    },
    {
      id: 11,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 11, // Driver 2
      role_name: 'DRIVER',
      description: 'Conductor con acceso a pedidos asignados',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: false, read: true, update: true, delete: false, assign: false },
        drivers: { create: false, read: false, update: false, delete: false, assign: false },
        customers: { create: false, read: true, update: false, delete: false },
        reports: { read: false, export: false },
        settings: { read: false, update: false },
        billing: { read: false, update: false },
        analytics: { read: false, export: false }
      }),
    },

    // Café Central - Roles
    {
      id: 6,
      uuid: knex.raw('gen_random_uuid()'),
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
        settings: { read: true, update: true },
        billing: { read: true, update: true },
        analytics: { read: true, export: true }
      }),
    },
    {
      id: 7,
      uuid: knex.raw('gen_random_uuid()'),
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
        settings: { read: false, update: false },
        billing: { read: false, update: false },
        analytics: { read: false, export: false }
      }),
    },

    // Sushi Master - Roles
    {
      id: 8,
      uuid: knex.raw('gen_random_uuid()'),
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
        settings: { read: true, update: true },
        billing: { read: true, update: true },
        analytics: { read: true, export: true }
      }),
    },
    {
      id: 9,
      uuid: knex.raw('gen_random_uuid()'),
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
        settings: { read: true, update: false },
        billing: { read: true, update: false },
        analytics: { read: true, export: true }
      }),
    },
    {
      id: 12,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 12, // Driver 3
      role_name: 'DRIVER',
      description: 'Conductor con acceso a pedidos asignados',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: false, read: true, update: true, delete: false, assign: false },
        drivers: { create: false, read: false, update: false, delete: false, assign: false },
        customers: { create: false, read: true, update: false, delete: false },
        reports: { read: false, export: false },
        settings: { read: false, update: false },
        billing: { read: false, update: false },
        analytics: { read: false, export: false }
      }),
    },

    // moviGo Platform - Admin Roles
    {
      id: 13,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 13, // Admin Principal
      role_name: 'PLATFORM_ADMIN',
      description: 'Administrador principal de la plataforma',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: true, read: true, update: true, delete: true, assign: true },
        drivers: { create: true, read: true, update: true, delete: true, assign: true },
        customers: { create: true, read: true, update: true, delete: true },
        reports: { read: true, export: true },
        settings: { read: true, update: true },
        billing: { read: true, update: true },
        analytics: { read: true, export: true },
        organizations: { create: true, read: true, update: true, delete: true },
        users: { create: true, read: true, update: true, delete: true },
        system: { read: true, update: true }
      }),
    },
    {
      id: 14,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 14, // Super Admin
      role_name: 'SUPER_ADMIN',
      description: 'Super administrador con acceso completo al sistema',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: true, read: true, update: true, delete: true, assign: true },
        drivers: { create: true, read: true, update: true, delete: true, assign: true },
        customers: { create: true, read: true, update: true, delete: true },
        reports: { read: true, export: true },
        settings: { read: true, update: true },
        billing: { read: true, update: true },
        analytics: { read: true, export: true },
        organizations: { create: true, read: true, update: true, delete: true },
        users: { create: true, read: true, update: true, delete: true },
        system: { read: true, update: true },
        security: { read: true, update: true },
        logs: { read: true, export: true }
      }),
    },
    {
      id: 15,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 15, // Manager
      role_name: 'PLATFORM_MANAGER',
      description: 'Gerente de la plataforma con acceso administrativo',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify({
        orders: { create: true, read: true, update: true, delete: false, assign: true },
        drivers: { create: true, read: true, update: true, delete: false, assign: true },
        customers: { create: true, read: true, update: true, delete: false },
        reports: { read: true, export: true },
        settings: { read: true, update: false },
        billing: { read: true, update: false },
        analytics: { read: true, export: true },
        organizations: { create: false, read: true, update: false, delete: false },
        users: { create: false, read: true, update: false, delete: false },
        system: { read: false, update: false }
      }),
    },

    // Multiple roles for some members (example: María García also has MANAGER role)
    {
      id: 16,
      uuid: knex.raw('gen_random_uuid()'),
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
        settings: { read: true, update: false },
        billing: { read: true, update: false },
        analytics: { read: true, export: true }
      }),
    },
  ]);
}
