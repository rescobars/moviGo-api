import { Request, Response } from 'express';
import { webSocketService } from '../services/websocket.service';
import { rabbitMQService } from '../services/rabbitmq.service';

export class WebSocketController {
  // Get WebSocket connection status
  public getStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const status = {
        websocket: {
          connected: webSocketService.getConnectedUsersCount(),
          users: webSocketService.getConnectedUsers().map(user => ({
            socketId: user.id,
            userId: user.userId,
            organizationId: user.organizationId
          }))
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

  // Send test message to RabbitMQ
  public sendTestMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type, data, routingKey } = req.body;

      if (!type || !data) {
        res.status(400).json({
          success: false,
          message: 'Type and data are required'
        });
        return;
      }

      const message = {
        type,
        data,
        timestamp: new Date()
      };

      const routing = routingKey || `movigo.${type}`;
      const published = await rabbitMQService.publishMessage(routing, message);

      if (published) {
        res.json({
          success: true,
          message: 'Test message sent successfully',
          data: { type, routingKey: routing }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to publish message to RabbitMQ'
        });
      }
    } catch (error) {
      console.error('Error sending test message:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending test message',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Send message to specific user
  public sendToUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, event, data } = req.body;

      if (!userId || !event) {
        res.status(400).json({
          success: false,
          message: 'userId and event are required'
        });
        return;
      }

      webSocketService.sendToUser(userId, event, data);

      res.json({
        success: true,
        message: 'Message sent to user successfully',
        data: { userId, event }
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

  // Send message to organization
  public sendToOrganization = async (req: Request, res: Response): Promise<void> => {
    try {
      const { organizationId, event, data } = req.body;

      if (!organizationId || !event) {
        res.status(400).json({
          success: false,
          message: 'organizationId and event are required'
        });
        return;
      }

      webSocketService.sendToOrganization(organizationId, event, data);

      res.json({
        success: true,
        message: 'Message sent to organization successfully',
        data: { organizationId, event }
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

  // Send message to route
  public sendToRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const { routeId, event, data } = req.body;

      if (!routeId || !event) {
        res.status(400).json({
          success: false,
          message: 'routeId and event are required'
        });
        return;
      }

      webSocketService.sendToRoute(routeId, event, data);

      res.json({
        success: true,
        message: 'Message sent to route successfully',
        data: { routeId, event }
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

  // Broadcast message to all connected clients
  public broadcast = async (req: Request, res: Response): Promise<void> => {
    try {
      const { event, data } = req.body;

      if (!event) {
        res.status(400).json({
          success: false,
          message: 'event is required'
        });
        return;
      }

      webSocketService.broadcastToAll(event, data);

      res.json({
        success: true,
        message: 'Message broadcasted successfully',
        data: { event }
      });
    } catch (error) {
      console.error('Error broadcasting message:', error);
      res.status(500).json({
        success: false,
        message: 'Error broadcasting message',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

export const webSocketController = new WebSocketController();
