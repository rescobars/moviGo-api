import { Request, Response } from 'express';
import { OrganizationRepository } from '../../../database/src/repositories/organization.repository';
import { CreateOrganizationSchema, UpdateOrganizationSchema } from '../../../types/src/schemas/organization';

export class OrganizationsController {

  static async getAll(req: Request, res: Response) {
    try {
      const { status, plan_type } = req.query;
      
      // Build filter object
      const filters: any = {};
      if (status) filters.status = status;
      if (plan_type) filters.plan_type = plan_type;

      const organizations = await OrganizationRepository.findAll(filters);

      res.json({
        success: true,
        data: organizations
      });
    } catch (error: any) {
      console.error('❌ Error getting organizations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get organizations'
      });
    }
  }

  static async getByUuid(req: Request, res: Response) {
    try {
      const { uuid } = req.params;

      const organization = await OrganizationRepository.findByUuid(uuid);

      if (!organization) {
        return res.status(404).json({
          success: false,
          error: 'Organization not found'
        });
      }

      res.json({
        success: true,
        data: organization
      });
    } catch (error: any) {
      console.error('❌ Error getting organization:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get organization'
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const validatedData = CreateOrganizationSchema.parse(req.body);

      // Check if slug already exists
      const existingOrg = await OrganizationRepository.findBySlug(validatedData.slug);
      if (existingOrg) {
        return res.status(400).json({
          success: false,
          error: 'Organization with this slug already exists'
        });
      }

      const organization = await OrganizationRepository.create(validatedData);

      res.status(201).json({
        success: true,
        data: organization,
        message: 'Organization created successfully'
      });
    } catch (error: any) {
      console.error('❌ Error creating organization:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
      }
      res.status(500).json({
        success: false,
        error: 'Failed to create organization'
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { uuid } = req.params;
      const validatedData = UpdateOrganizationSchema.parse(req.body);

      // Check if organization exists
      const existingOrg = await OrganizationRepository.findByUuid(uuid);
      if (!existingOrg) {
        return res.status(404).json({
          success: false,
          error: 'Organization not found'
        });
      }

      // If slug is being updated, check if it's already taken
      if (validatedData.slug && validatedData.slug !== existingOrg.slug) {
        const slugExists = await OrganizationRepository.findBySlug(validatedData.slug);
        if (slugExists) {
          return res.status(400).json({
            success: false,
            error: 'Organization with this slug already exists'
          });
        }
      }

      const organization = await OrganizationRepository.update(uuid, validatedData);

      res.json({
        success: true,
        data: organization,
        message: 'Organization updated successfully'
      });
    } catch (error: any) {
      console.error('❌ Error updating organization:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
      }
      res.status(500).json({
        success: false,
        error: 'Failed to update organization'
      });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { uuid } = req.params;
      const { status } = req.body;

      if (!status || !['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status. Must be ACTIVE, INACTIVE, or SUSPENDED'
        });
      }

      // Check if organization exists
      const existingOrg = await OrganizationRepository.findByUuid(uuid);
      if (!existingOrg) {
        return res.status(404).json({
          success: false,
          error: 'Organization not found'
        });
      }

      const organization = await OrganizationRepository.updateStatus(uuid, status);

      res.json({
        success: true,
        data: organization,
        message: `Organization status updated to ${status}`
      });
    } catch (error: any) {
      console.error('❌ Error updating organization status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update organization status'
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { uuid } = req.params;

      // Check if organization exists
      const existingOrg = await OrganizationRepository.findByUuid(uuid);
      if (!existingOrg) {
        return res.status(404).json({
          success: false,
          error: 'Organization not found'
        });
      }

      // Check if organization has members (optional safety check)
      const memberCount = await OrganizationRepository.getMemberCount(uuid);
      if (memberCount > 0) {
        return res.status(400).json({
          success: false,
          error: `Cannot delete organization with ${memberCount} members. Please remove all members first.`
        });
      }

      await OrganizationRepository.delete(uuid);

      res.json({
        success: true,
        message: 'Organization deleted successfully'
      });
    } catch (error: any) {
      console.error('❌ Error deleting organization:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete organization'
      });
    }
  }
}
