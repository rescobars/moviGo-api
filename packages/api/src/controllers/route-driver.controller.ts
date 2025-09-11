import { Request, Response } from 'express';
import { RouteDriverService } from '../services/route-driver.service';
import { CreateRouteDriverRequest, UpdateRouteDriverRequest } from '../../../types/src/schemas/route-driver';

export class RouteDriverController {
  constructor(private readonly routeDriverService: RouteDriverService) {}

  async assignDriverToRoute(req: Request, res: Response): Promise<void> {
    try {
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

      const routeDriver = await this.routeDriverService.assignDriverToRoute(routeDriverData);
      
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

  async getRouteDriverById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const routeDriver = await this.routeDriverService.getRouteDriverById(parseInt(id));
      
      if (!routeDriver) {
        res.status(404).json({
          success: false,
          error: 'Route driver assignment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: routeDriver,
        message: 'Route driver retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting route driver:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get route driver'
      });
    }
  }

  async getDriversByRoute(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;
      const withDetails = req.query.withDetails === 'true';
      
      let drivers;
      if (withDetails) {
        drivers = await this.routeDriverService.getDriversByRouteWithDetails(parseInt(routeId));
      } else {
        drivers = await this.routeDriverService.getDriversByRoute(parseInt(routeId));
      }
      
      res.status(200).json({
        success: true,
        data: drivers,
        message: 'Route drivers retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting route drivers:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get route drivers'
      });
    }
  }

  async getRoutesByDriver(req: Request, res: Response): Promise<void> {
    try {
      const { driverId } = req.params;
      const withDetails = req.query.withDetails === 'true';
      
      let routes;
      if (withDetails) {
        routes = await this.routeDriverService.getRoutesByDriverWithDetails(parseInt(driverId));
      } else {
        routes = await this.routeDriverService.getRoutesByDriver(parseInt(driverId));
      }
      
      res.status(200).json({
        success: true,
        data: routes,
        message: 'Driver routes retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting driver routes:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get driver routes'
      });
    }
  }

  async updateRouteDriver(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateRouteDriverRequest = req.body;
      
      const routeDriver = await this.routeDriverService.updateRouteDriver(parseInt(id), updateData);
      
      if (!routeDriver) {
        res.status(404).json({
          success: false,
          error: 'Route driver assignment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: routeDriver,
        message: 'Route driver updated successfully'
      });
    } catch (error) {
      console.error('Error updating route driver:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update route driver'
      });
    }
  }

  async startRoute(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const routeDriver = await this.routeDriverService.startRoute(parseInt(id));
      
      if (!routeDriver) {
        res.status(404).json({
          success: false,
          error: 'Route driver assignment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: routeDriver,
        message: 'Route started successfully'
      });
    } catch (error) {
      console.error('Error starting route:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start route'
      });
    }
  }

  async completeRoute(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { actualDurationMinutes } = req.body;
      
      const routeDriver = await this.routeDriverService.completeRoute(parseInt(id), actualDurationMinutes);
      
      if (!routeDriver) {
        res.status(404).json({
          success: false,
          error: 'Route driver assignment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: routeDriver,
        message: 'Route completed successfully'
      });
    } catch (error) {
      console.error('Error completing route:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to complete route'
      });
    }
  }

  async updateRouteProgress(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      
      const routeDriver = await this.routeDriverService.updateRouteProgress(parseInt(id), progress);
      
      if (!routeDriver) {
        res.status(404).json({
          success: false,
          error: 'Route driver assignment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: routeDriver,
        message: 'Route progress updated successfully'
      });
    } catch (error) {
      console.error('Error updating route progress:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update route progress'
      });
    }
  }

  async removeDriverFromRoute(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const success = await this.routeDriverService.removeDriverFromRoute(parseInt(id));
      
      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Route driver assignment not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Driver removed from route successfully'
      });
    } catch (error) {
      console.error('Error removing driver from route:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove driver from route'
      });
    }
  }
}
