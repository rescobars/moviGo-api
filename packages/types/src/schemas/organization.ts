import { z } from 'zod';

// Organization status enum
export const OrganizationStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']);

// Plan type enum
export const PlanTypeEnum = z.enum(['FREE', 'BASIC', 'PRO', 'ENTERPRISE']);

// Base organization schema
export const OrganizationSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  domain: z.string().optional(),
  logo_url: z.string().url().optional(),
  website_url: z.string().url().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  status: OrganizationStatusEnum,
  is_active: z.boolean(),
  plan_type: PlanTypeEnum,
  subscription_expires_at: z.date().optional(),
  created_at: z.date(),
  updated_at: z.date()
});

// Schema for creating a new organization
export const CreateOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long'),
  description: z.string().optional(),
  domain: z.string().optional(),
  logo_url: z.string().url().optional(),
  website_url: z.string().url().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  status: OrganizationStatusEnum.optional().default('ACTIVE'),
  plan_type: PlanTypeEnum.optional().default('FREE'),
  subscription_expires_at: z.string().datetime().optional()
});

// Schema for updating an organization
export const UpdateOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long').optional(),
  description: z.string().optional(),
  domain: z.string().optional(),
  logo_url: z.string().url().optional(),
  website_url: z.string().url().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  status: OrganizationStatusEnum.optional(),
  is_active: z.boolean().optional(),
  plan_type: PlanTypeEnum.optional(),
  subscription_expires_at: z.string().datetime().optional()
});

// Type exports
export type Organization = z.infer<typeof OrganizationSchema>;
export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganization = z.infer<typeof UpdateOrganizationSchema>;
export type OrganizationStatus = z.infer<typeof OrganizationStatusEnum>;
export type PlanType = z.infer<typeof PlanTypeEnum>;
