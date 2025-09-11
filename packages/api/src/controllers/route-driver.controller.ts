import { Request, Response } from 'express';
import { RouteDriverService } from '../services/route-driver.service';
import { CreateRouteDriverRequest } from '../../../types/src/schemas/route-driver';

export class RouteDriverController {
  constructor(private readonly routeDriverService: RouteDriverService) {}

  async assignDriverToRoute(req: Request, res: Response): Promise<void> {
    try {
      const { routeUuid, driverUuid } = req.params;
      const routeDriverData: CreateRouteDriverRequest = req.body;
      
      // Validate organization_id from JWT token or request
      const organizationId = req.headers['organization-id'] as string;
      if (!organizationId) {
        res.status(400).json({ 
          success: false,
          error: 'Organization ID is required' 
        });
        return;
      }

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
}