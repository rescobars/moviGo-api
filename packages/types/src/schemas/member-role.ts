import { z } from 'zod';

// Member role status enum
export const MemberRoleStatusEnum = z.enum(['ACTIVE', 'INACTIVE']);

// Common role names enum
export const RoleNameEnum = z.enum([
  'PLATFORM_ADMIN', // Administrador de plataforma - acceso a todo
  'OWNER',          // Propietario de organización - acceso completo en su organización
  'DRIVER',         // Conductor - acceso limitado a pedidos asignados
  'VIEWER'          // Visualizador - solo lectura
]);

// Permissions schema
export const PermissionsSchema = z.object({
  // Organization-specific permissions
  orders: z.object({
    create: z.boolean().optional(),
    read: z.boolean().optional(),
    update: z.boolean().optional(),
    delete: z.boolean().optional(),
    assign: z.boolean().optional(),
    cancel: z.boolean().optional(),
    refund: z.boolean().optional()
  }).optional(),
  drivers: z.object({
    create: z.boolean().optional(),
    read: z.boolean().optional(),
    update: z.boolean().optional(),
    delete: z.boolean().optional(),
    assign: z.boolean().optional(),
    schedule: z.boolean().optional(),
    track: z.boolean().optional()
  }).optional(),
  customers: z.object({
    create: z.boolean().optional(),
    read: z.boolean().optional(),
    update: z.boolean().optional(),
    delete: z.boolean().optional(),
    block: z.boolean().optional(),
    verify: z.boolean().optional()
  }).optional(),
  reports: z.object({
    read: z.boolean().optional(),
    export: z.boolean().optional(),
    create: z.boolean().optional(),
    schedule: z.boolean().optional()
  }).optional(),
  settings: z.object({
    read: z.boolean().optional(),
    update: z.boolean().optional(),
    delete: z.boolean().optional()
  }).optional(),
  billing: z.object({
    read: z.boolean().optional(),
    update: z.boolean().optional(),
    create: z.boolean().optional(),
    refund: z.boolean().optional()
  }).optional(),
  analytics: z.object({
    read: z.boolean().optional(),
    export: z.boolean().optional(),
    create: z.boolean().optional()
  }).optional(),
  
  // Platform-level permissions (for admins)
  organizations: z.object({
    create: z.boolean().optional(),
    read: z.boolean().optional(),
    update: z.boolean().optional(),
    delete: z.boolean().optional(),
    suspend: z.boolean().optional(),
    activate: z.boolean().optional(),
    migrate: z.boolean().optional()
  }).optional(),
  members: z.object({
    create: z.boolean().optional(),
    read: z.boolean().optional(),
    update: z.boolean().optional(),
    delete: z.boolean().optional(),
    invite: z.boolean().optional(),
    remove: z.boolean().optional(),
    assign_roles: z.boolean().optional()
  }).optional(),
  users: z.object({
    create: z.boolean().optional(),
    read: z.boolean().optional(),
    update: z.boolean().optional(),
    delete: z.boolean().optional(),
    suspend: z.boolean().optional(),
    activate: z.boolean().optional(),
    reset_password: z.boolean().optional()
  }).optional(),
  system: z.object({
    read: z.boolean().optional(),
    update: z.boolean().optional(),
    maintenance: z.boolean().optional(),
    backup: z.boolean().optional(),
    restore: z.boolean().optional()
  }).optional(),
  security: z.object({
    read: z.boolean().optional(),
    update: z.boolean().optional(),
    audit: z.boolean().optional(),
    block_ip: z.boolean().optional(),
    whitelist: z.boolean().optional()
  }).optional(),
  logs: z.object({
    read: z.boolean().optional(),
    export: z.boolean().optional(),
    delete: z.boolean().optional(),
    analyze: z.boolean().optional()
  }).optional(),
  notifications: z.object({
    create: z.boolean().optional(),
    read: z.boolean().optional(),
    update: z.boolean().optional(),
    delete: z.boolean().optional(),
    send: z.boolean().optional(),
    schedule: z.boolean().optional()
  }).optional()
});

// Base member role schema
export const MemberRoleSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  organization_member_id: z.number().int().positive(),
  role_name: z.string(),
  description: z.string().optional(),
  status: MemberRoleStatusEnum,
  is_active: z.boolean(),
  permissions: PermissionsSchema,
  created_at: z.date(),
  updated_at: z.date()
});

// Schema for creating a new member role
export const CreateMemberRoleSchema = z.object({
  organization_member_id: z.number().int().positive('Invalid organization member ID'),
  role_name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
  status: MemberRoleStatusEnum.optional().default('ACTIVE'),
  permissions: PermissionsSchema.optional().default({})
});

// Schema for updating a member role
export const UpdateMemberRoleSchema = z.object({
  role_name: z.string().min(1, 'Role name is required').optional(),
  description: z.string().optional(),
  status: MemberRoleStatusEnum.optional(),
  is_active: z.boolean().optional(),
  permissions: PermissionsSchema.optional()
});

// Schema for assigning multiple roles to a member
export const AssignRolesSchema = z.object({
  organization_member_id: z.number().int().positive('Invalid organization member ID'),
  roles: z.array(z.object({
    role_name: z.string().min(1, 'Role name is required'),
    description: z.string().optional(),
    permissions: PermissionsSchema.optional()
  }))
});

// Type exports
export type MemberRole = z.infer<typeof MemberRoleSchema>;
export type CreateMemberRole = z.infer<typeof CreateMemberRoleSchema>;
export type UpdateMemberRole = z.infer<typeof UpdateMemberRoleSchema>;
export type AssignRoles = z.infer<typeof AssignRolesSchema>;
export type MemberRoleStatus = z.infer<typeof MemberRoleStatusEnum>;
export type RoleName = z.infer<typeof RoleNameEnum>;
export type Permissions = z.infer<typeof PermissionsSchema>;
