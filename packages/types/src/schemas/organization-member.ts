import { z } from 'zod';

// Organization member status enum
export const OrganizationMemberStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'PENDING']);

// Base organization member schema
export const OrganizationMemberSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  organization_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  title: z.string().optional(),
  notes: z.string().optional(),
  status: OrganizationMemberStatusEnum,
  is_active: z.boolean(),
  joined_at: z.date(),
  created_at: z.date(),
  updated_at: z.date()
});

// Schema for creating a new organization member
export const CreateOrganizationMemberSchema = z.object({
  organization_id: z.number().int().positive('Invalid organization ID'),
  user_id: z.number().int().positive('Invalid user ID'),
  title: z.string().optional(),
  notes: z.string().optional(),
  status: OrganizationMemberStatusEnum.optional().default('ACTIVE')
});

// Schema for updating an organization member
export const UpdateOrganizationMemberSchema = z.object({
  title: z.string().optional(),
  notes: z.string().optional(),
  status: OrganizationMemberStatusEnum.optional(),
  is_active: z.boolean().optional()
});

// Schema for inviting a member to an organization
export const InviteMemberSchema = z.object({
  organization_id: z.number().int().positive('Invalid organization ID'),
  email: z.string().email('Invalid email format'),
  title: z.string().optional()
});

// Type exports
export type OrganizationMember = z.infer<typeof OrganizationMemberSchema>;
export type CreateOrganizationMember = z.infer<typeof CreateOrganizationMemberSchema>;
export type UpdateOrganizationMember = z.infer<typeof UpdateOrganizationMemberSchema>;
export type InviteMember = z.infer<typeof InviteMemberSchema>;
export type OrganizationMemberStatus = z.infer<typeof OrganizationMemberStatusEnum>;
