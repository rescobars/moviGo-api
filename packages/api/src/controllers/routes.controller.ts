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
}
