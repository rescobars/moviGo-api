import { Request, Response } from 'express';
import { RouteService } from '../services/route.service';
import { CreateRouteRequest } from '../../../types/src/schemas/route';

export class RoutesController {
  constructor(private readonly routeService: RouteService) {}

  async createRoute(req: Request, res: Response): Promise<void> {
    try {
      const routeData: CreateRouteRequest = req.body;
      
      // Validate organization_id from JWT token or request
      const organizationId = req.headers['organization-id'] as string;
      if (!organizationId) {
        res.status(400).json({ error: 'Organization ID is required' });
        return;
      }

      // Override organization_id from request with the one from token
      routeData.organization_id = organizationId;

      const route = await this.routeService.createRoute(routeData);
      
      res.status(201).json({
        success: true,
        data: route,
        message: 'Route created successfully'
      });
    } catch (error) {
      console.error('Error creating route:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create route'
      });
    }
  }

  async getAllRoutes(req: Request, res: Response): Promise<void> {
    try {
      // Get organization_id from JWT token or request headers
      const organizationId = req.headers['organization-id'] as string;
      if (!organizationId) {
        res.status(400).json({ 
          success: false,
          error: 'Organization ID is required' 
        });
        return;
      }

      // Convert organization UUID to numeric ID
      const organization = await (req as any).knex('organizations')
        .where('uuid', organizationId)
        .first();
      
      if (!organization) {
        res.status(404).json({
          success: false,
          error: 'Organization not found'
        });
        return;
      }

      const routes = await this.routeService.getAllRoutesByOrganization(organization.id);
      
      res.status(200).json({
        success: true,
        data: routes,
        message: 'Routes retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting routes:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get routes'
      });
    }
  }
}
