import { Request, Response } from 'express';
import { redisService } from '../services/redis.service';

export class DriverLastPositionController {
  /**
   * Obtiene la última posición de un driver específico
   */
  public getDriverLastPosition = async (req: Request, res: Response): Promise<void> => {
    try {
      const { driverId } = req.params;

      if (!driverId) {
        res.status(400).json({
          success: false,
          message: 'Driver ID is required'
        });
        return;
      }

      const lastPosition = await redisService.getDriverLastPosition(driverId);

      if (!lastPosition) {
        res.status(404).json({
          success: false,
          message: 'No last position found for this driver'
        });
        return;
      }

      res.json({
        success: true,
        data: lastPosition
      });
    } catch (error) {
      console.error('Error getting driver last position:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting driver last position',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Obtiene las últimas posiciones de múltiples drivers
   */
  public getMultipleDriverLastPositions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { driverIds } = req.body;

      if (!driverIds || !Array.isArray(driverIds) || driverIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'driverIds array is required'
        });
        return;
      }

      const lastPositions = await redisService.getMultipleDriverLastPositions(driverIds);

      res.json({
        success: true,
        data: lastPositions
      });
    } catch (error) {
      console.error('Error getting multiple driver last positions:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting multiple driver last positions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Obtiene las últimas posiciones de todos los drivers de una organización
   */
  public getOrganizationDriverLastPositions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { organizationId } = req.params;

      if (!organizationId) {
        res.status(400).json({
          success: false,
          message: 'Organization ID is required'
        });
        return;
      }

      const lastPositions = await redisService.getOrganizationDriverLastPositions(organizationId);

      res.json({
        success: true,
        data: lastPositions
      });
    } catch (error) {
      console.error('Error getting organization driver last positions:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting organization driver last positions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Obtiene las últimas posiciones de drivers de múltiples rutas
   */
  public getMultipleRoutesDriverLastPositions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { routeIds } = req.body;

      if (!routeIds || !Array.isArray(routeIds) || routeIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'routeIds array is required'
        });
        return;
      }

      const lastPositions = await redisService.getMultipleRoutesDriverLastPositions(routeIds);

      res.json({
        success: true,
        data: lastPositions
      });
    } catch (error) {
      console.error('Error getting multiple routes driver last positions:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting multiple routes driver last positions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };


  /**
   * Verifica el estado de Redis
   */
  public getRedisStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const isConnected = redisService.isConnected();

      res.json({
        success: true,
        data: {
          connected: isConnected,
          status: isConnected ? 'ready' : 'disconnected'
        }
      });
    } catch (error) {
      console.error('Error getting Redis status:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting Redis status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

export const driverLastPositionController = new DriverLastPositionController();
