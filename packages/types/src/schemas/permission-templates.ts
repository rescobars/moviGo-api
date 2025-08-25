import { Permissions } from './member-role';

// Permission templates for different roles
export const PermissionTemplates = {
  // Administrador de plataforma - acceso a todo
  PLATFORM_ADMIN: {
    // Organization permissions
    orders: { create: true, read: true, update: true, delete: true, assign: true, cancel: true, refund: true },
    drivers: { create: true, read: true, update: true, delete: true, assign: true, schedule: true, track: true },
    customers: { create: true, read: true, update: true, delete: true, block: true, verify: true },
    reports: { read: true, export: true, create: true, schedule: true },
    settings: { read: true, update: true, delete: true },
    billing: { read: true, update: true, create: true, refund: true },
    analytics: { read: true, export: true, create: true },
    
    // Platform permissions
    organizations: { create: true, read: true, update: true, delete: true, suspend: true, activate: true, migrate: true },
    members: { create: true, read: true, update: true, delete: true, invite: true, remove: true, assign_roles: true },
    users: { create: true, read: true, update: true, delete: true, suspend: true, activate: true, reset_password: true },
    system: { read: true, update: true, maintenance: true, backup: true, restore: true },
    security: { read: true, update: true, audit: true, block_ip: true, whitelist: true },
    logs: { read: true, export: true, delete: true, analyze: true },
    notifications: { create: true, read: true, update: true, delete: true, send: true, schedule: true }
  } as Permissions,

  // Propietario de organización - acceso completo en su organización
  OWNER: {
    orders: { create: true, read: true, update: true, delete: true, assign: true, cancel: true, refund: true },
    drivers: { create: true, read: true, update: true, delete: true, assign: true, schedule: true, track: true },
    customers: { create: true, read: true, update: true, delete: true, block: true, verify: true },
    reports: { read: true, export: true, create: true, schedule: true },
    settings: { read: true, update: true, delete: true },
    billing: { read: true, update: true, create: true, refund: true },
    analytics: { read: true, export: true, create: true }
  } as Permissions,

  // Conductor - acceso limitado a pedidos asignados
  DRIVER: {
    orders: { create: false, read: true, update: true, delete: false, assign: false, cancel: false, refund: false },
    drivers: { create: false, read: false, update: false, delete: false, assign: false, schedule: false, track: false },
    customers: { create: false, read: true, update: false, delete: false, block: false, verify: false },
    reports: { read: false, export: false, create: false, schedule: false },
    settings: { read: false, update: false, delete: false },
    billing: { read: false, update: false, create: false, refund: false },
    analytics: { read: false, export: false, create: false }
  } as Permissions,

  // Visualizador - solo lectura
  VIEWER: {
    orders: { create: false, read: true, update: false, delete: false, assign: false, cancel: false, refund: false },
    drivers: { create: false, read: true, update: false, delete: false, assign: false, schedule: false, track: false },
    customers: { create: false, read: true, update: false, delete: false, block: false, verify: false },
    reports: { read: true, export: false, create: false, schedule: false },
    settings: { read: false, update: false, delete: false },
    billing: { read: false, update: false, create: false, refund: false },
    analytics: { read: true, export: false, create: false }
  } as Permissions
};

// Helper function to get permissions for a role
export function getPermissionsForRole(roleName: string): Permissions {
  return PermissionTemplates[roleName as keyof typeof PermissionTemplates] || {};
}

// Helper function to check if user has specific permission
export function hasPermission(
  userPermissions: Permissions,
  resource: string,
  action: string
): boolean {
  const resourcePermissions = userPermissions[resource as keyof Permissions];
  if (!resourcePermissions || typeof resourcePermissions !== 'object') {
    return false;
  }
  
  return resourcePermissions[action as keyof typeof resourcePermissions] === true;
}
