import { Request, Response } from 'express';
import { webSocketService } from '../services/websocket.service';
import { rabbitMQService } from '../services/rabbitmq.service';
import { DriverTransmission, DriverStatus, NetworkType, validateDriverTransmission } from '../types';

export class WebSocketController {
  // Get WebSocket connection status
  public getStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const status = {
        websocket: {
          connected: webSocketService.getConnectedUsersCount(),
          users: webSocketService.getConnectedUsers()
        },
        rabbitmq: {
          connected: rabbitMQService.isConnected()
        }
      };

      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      console.error('Error getting WebSocket status:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting WebSocket status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Send test driver transmission
  public sendTestDriverTransmission = async (req: Request, res: Response): Promise<void> => {
    try {
      const { driverId, routeId, organizationId, latitude, longitude, status, networkType } = req.body;

      if (!driverId || !organizationId || !latitude || !longitude) {
        res.status(400).json({
          success: false,
          message: 'driverId, organizationId, latitude, and longitude are required'
        });
        return;
      }

      // Validar y convertir los datos usando Zod
      const transmissionData = {
        driverId,
        routeId: routeId || undefined, // Opcional
        organizationId,
        vehicleId: req.body.vehicleId,
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          accuracy: req.body.accuracy || 10,
          altitude: req.body.altitude,
          speed: req.body.speed,
          heading: req.body.heading
        },
        status: status ? status.toUpperCase() : DriverStatus.DRIVING,
        batteryLevel: req.body.batteryLevel,
        signalStrength: req.body.signalStrength,
        timestamp: new Date(),
        metadata: {
          appVersion: req.body.appVersion || '1.0.0',
          deviceInfo: req.body.deviceInfo,
          networkType: networkType ? networkType.toUpperCase() : NetworkType.UNKNOWN
        }
      };

      // Validar con Zod
      const transmission = validateDriverTransmission(transmissionData);

      const message = {
        type: 'transmission.received',
        data: transmission,
        timestamp: new Date()
      };

      const published = await rabbitMQService.publishMessage('movigo.transmission.received', message);

      if (published) {
        res.json({
          success: true,
          message: 'Test driver transmission sent successfully',
          data: { transmission }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to publish driver transmission to RabbitMQ'
        });
      }
    } catch (error) {
      console.error('Error sending test driver transmission:', error);
      
      // Manejar errores de validación de Zod
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error sending test driver transmission',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Send message to specific user
  public sendToUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, event, data } = req.body;
      if (!userId || !event || !data) {
        res.status(400).json({ 
          success: false, 
          message: 'userId, event, and data are required' 
        });
        return;
      }
      
      webSocketService.sendToUser(userId, event, data);
      res.json({ 
        success: true, 
        message: `Message sent to user ${userId}`, 
        data: { event, data } 
      });
    } catch (error) {
      console.error('Error sending message to user:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending message to user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Send message to specific route
  public sendToRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const { routeId, event, data } = req.body;
      if (!routeId || !event || !data) {
        res.status(400).json({ 
          success: false, 
          message: 'routeId, event, and data are required' 
        });
        return;
      }
      
      webSocketService.sendToRoute(routeId, event, data);
      res.json({ 
        success: true, 
        message: `Message sent to route ${routeId}`, 
        data: { event, data } 
      });
    } catch (error) {
      console.error('Error sending message to route:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending message to route',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Send message to specific organization
  public sendToOrganization = async (req: Request, res: Response): Promise<void> => {
    try {
      const { organizationId, event, data } = req.body;
      if (!organizationId || !event || !data) {
        res.status(400).json({ 
          success: false, 
          message: 'organizationId, event, and data are required' 
        });
        return;
      }
      
      webSocketService.sendToOrganization(organizationId, event, data);
      res.json({ 
        success: true, 
        message: `Message sent to organization ${organizationId}`, 
        data: { event, data } 
      });
    } catch (error) {
      console.error('Error sending message to organization:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending message to organization',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

export const webSocketController = new WebSocketController();