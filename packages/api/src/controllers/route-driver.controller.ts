import { Request, Response } from 'express';
import { RouteDriverService } from '../services/route-driver.service';
import { CreateRouteDriverRequest } from '../../../types/src/schemas/route-driver';

export class RouteDriverController {
  constructor(private readonly routeDriverService: RouteDriverService) {}

  async assignDriverToRoute(req: Request, res: Response): Promise<void> {
    try {
      const { routeUuid, driverUuid } = req.params;
      const routeDriverData: CreateRouteDriverRequest = req.body;
      
      // Validate UUIDs before processing
      if (!routeUuid || routeUuid === 'undefined' || routeUuid === 'null') {
        res.status(400).json({ 
          success: false,
          error: 'Valid route UUID is required' 
        });
        return;
      }

      if (!driverUuid || driverUuid === 'undefined' || driverUuid === 'null') {
        res.status(400).json({ 
          success: false,
          error: 'Valid driver UUID is required' 
        });
        return;
      }

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(routeUuid)) {
        res.status(400).json({ 
          success: false,
          error: 'Invalid route UUID format' 
        });
        return;
      }

      if (!uuidRegex.test(driverUuid)) {
        res.status(400).json({ 
          success: false,
          error: 'Invalid driver UUID format' 
        });
        return;
      }
      
      // Validate organization_id from JWT token or request
      const organizationId = req.headers['organization-id'] as string;
      if (!organizationId) {
        res.status(400).json({ 
          success: false,
          error: 'Organization ID is required' 
        });
        return;
      }

      console.log('🔍 RouteDriver - Assigning driver:', {
        routeUuid,
        driverUuid,
        organizationId,
        routeDriverData
      });

      const routeDriver = await this.routeDriverService.assignDriverToRoute(routeUuid, driverUuid, routeDriverData);
      
      res.status(201).json({
        success: true,
        data: routeDriver,
        message: 'Driver assigned to route successfully'
      });
    } catch (error) {
      console.error('Error assigning driver to route:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to assign driver to route'
      });
    }
  }

  async getRoutesByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userUuid } = req.params;
      const { status } = req.query;
      
      if (!userUuid) {
        res.status(400).json({ 
          success: false,
          error: 'User UUID is required' 
        });
        return;
      }

      const routes = await this.routeDriverService.getRoutesByUserUuid(userUuid, status as string);
      
      res.status(200).json({
        success: true,
        data: routes,
        message: `Found ${routes.length} routes for user`
      });
    } catch (error) {
      console.error('Error getting routes for user:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get routes for user'
      });
    }
  }
}