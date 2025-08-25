import { Knex } from 'knex';
import { PermissionTemplates } from '../../../types/src/schemas/permission-templates';

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
      permissions: JSON.stringify(PermissionTemplates.OWNER),
    },
    {
      id: 2,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 2, // Carlos López
      role_name: 'VIEWER',
      description: 'Visualizador con acceso de solo lectura',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify(PermissionTemplates.VIEWER),
    },
    {
      id: 3,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 3, // Ana Martínez
      role_name: 'VIEWER',
      description: 'Visualizadora con acceso de solo lectura',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify(PermissionTemplates.VIEWER),
    },
    {
      id: 10,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 10, // Driver 1
      role_name: 'DRIVER',
      description: 'Conductor con acceso a pedidos asignados',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify(PermissionTemplates.DRIVER),
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
      permissions: JSON.stringify(PermissionTemplates.OWNER),
    },
    {
      id: 5,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 5, // Lucía Hernández
      role_name: 'VIEWER',
      description: 'Supervisora con acceso de solo lectura',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify(PermissionTemplates.VIEWER),
    },
    {
      id: 11,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 11, // Driver 2
      role_name: 'DRIVER',
      description: 'Conductor con acceso a pedidos asignados',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify(PermissionTemplates.DRIVER),
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
      permissions: JSON.stringify(PermissionTemplates.OWNER),
    },
    {
      id: 7,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 7, // Carmen Vargas
      role_name: 'VIEWER',
      description: 'Barista con acceso de solo lectura',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify(PermissionTemplates.VIEWER),
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
      permissions: JSON.stringify(PermissionTemplates.OWNER),
    },
    {
      id: 9,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 9, // Sofía Torres
      role_name: 'VIEWER',
      description: 'Gerente con acceso de solo lectura',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify(PermissionTemplates.VIEWER),
    },
    {
      id: 12,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 12, // Driver 3
      role_name: 'DRIVER',
      description: 'Conductor con acceso a pedidos asignados',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify(PermissionTemplates.DRIVER),
    },

    // moviGo Platform - Admin Role
    {
      id: 13,
      uuid: knex.raw('gen_random_uuid()'),
      organization_member_id: 13, // Admin Principal
      role_name: 'PLATFORM_ADMIN',
      description: 'Administrador principal de la plataforma con acceso completo',
      status: 'ACTIVE',
      is_active: true,
      permissions: JSON.stringify(PermissionTemplates.PLATFORM_ADMIN),
    }
  ]);
}
