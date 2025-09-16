import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { RabbitMQMessage, rabbitMQService } from './rabbitmq.service';
import { DriverTransmission } from '../types';

export interface SocketUser {
  id: string;
  userId?: string;
  organizationId?: string;
}

export class WebSocketService {
  private io: SocketIOServer | null = null;
  private connectedUsers = new Map<string, SocketUser>(); // socket.id -> SocketUser
  private userSockets = new Map<string, Set<string>>(); // userId -> Set<socket.id>
  private organizationSockets = new Map<string, Set<string>>(); // organizationId -> Set<socket.id>

  constructor() {
    this.setupRabbitMQConsumer();
  }

  initialize(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
    console.log('🚀 WebSocket service initialized with room management');
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Handle authentication
      socket.on('authenticate', (data: { userId: string; organizationId?: string }) => {
        this.authenticateUser(socket, data);
      });

      // Handle joining routes
      socket.on('join_route', (routeId: string) => {
        this.joinRoute(socket, routeId);
      });

      // Handle leaving routes
      socket.on('leave_route', (routeId: string) => {
        this.leaveRoute(socket, routeId);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.onDisconnect(socket);
      });
    });
  }

  private authenticateUser(socket: Socket, data: { userId: string; organizationId?: string }): void {
    const { userId, organizationId } = data;
    if (!userId) {
      socket.emit('auth_error', { message: 'User ID is required for authentication' });
      socket.disconnect(true);
      return;
    }

    const user: SocketUser = { id: socket.id, userId, organizationId };
    this.connectedUsers.set(socket.id, user);

    // Add socket to user's set of sockets
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)?.add(socket.id);

    // Join organization room if provided
    if (organizationId) {
      socket.join(`org_${organizationId}`);
      if (!this.organizationSockets.has(organizationId)) {
        this.organizationSockets.set(organizationId, new Set());
      }
      this.organizationSockets.get(organizationId)?.add(socket.id);
    }

    socket.emit('authenticated', { userId, organizationId });
    console.log(`✅ User ${userId} authenticated on socket ${socket.id}`);
  }

  private joinRoute(socket: Socket, routeId: string): void {
    const user = this.connectedUsers.get(socket.id);
    if (!user || !user.userId) {
      socket.emit('error', { message: 'Authentication required to join a route' });
      return;
    }
    socket.join(`route_${routeId}`);
    socket.emit('joined_route', { routeId });
    console.log(`🚪 User ${user.userId} joined route room: route_${routeId}`);
  }

  private leaveRoute(socket: Socket, routeId: string): void {
    const user = this.connectedUsers.get(socket.id);
    if (!user || !user.userId) {
      socket.emit('error', { message: 'Authentication required to leave a route' });
      return;
    }
    socket.leave(`route_${routeId}`);
    socket.emit('left_route', { routeId });
    console.log(`🚶 User ${user.userId} left route room: route_${routeId}`);
  }

  private onDisconnect(socket: Socket): void {
    const user = this.connectedUsers.get(socket.id);
    if (user && user.userId) {
      this.userSockets.get(user.userId)?.delete(socket.id);
      if (this.userSockets.get(user.userId)?.size === 0) {
        this.userSockets.delete(user.userId);
      }
      if (user.organizationId) {
        this.organizationSockets.get(user.organizationId)?.delete(socket.id);
        if (this.organizationSockets.get(user.organizationId)?.size === 0) {
          this.organizationSockets.delete(user.organizationId);
        }
      }
      console.log(`🔌 User ${user.userId} disconnected: ${socket.id}`);
    }

    this.connectedUsers.delete(socket.id);
    console.log(`🔌 Client disconnected: ${socket.id}`);
  }

  private setupRabbitMQConsumer(): void {
    rabbitMQService.consumeMessages(async (message: RabbitMQMessage) => {
      // Solo procesar transmisiones de drivers
      if (message.type === 'transmission.received' && message.data) {
        const transmission: DriverTransmission = message.data;
        await this.broadcastDriverTransmission(transmission);
      }
    });
  }

  private async broadcastDriverTransmission(transmission: DriverTransmission): Promise<void> {
    if (!this.io) return;

    // Broadcast a todos los clientes conectados
    this.io.emit('driver_transmission', {
      type: 'driver_transmission',
      data: transmission,
      timestamp: new Date()
    });

    // Broadcast específico a la ruta del driver
    this.io.to(`route_${transmission.routeId}`).emit('route_driver_update', {
      type: 'driver_location_update',
      data: transmission,
      timestamp: new Date()
    });

    // Broadcast específico a la organización del driver
    this.io.to(`org_${transmission.organizationId}`).emit('organization_driver_update', {
      type: 'organization_driver_update',
      data: transmission,
      timestamp: new Date()
    });

    // Broadcast específico al driver (si está conectado)
    this.sendToUser(transmission.driverId, 'driver_status_update', {
      type: 'status_confirmed',
      data: transmission,
      timestamp: new Date()
    });

    console.log(`🚗 Driver transmission broadcasted: ${transmission.driverId} on route ${transmission.routeId} in org ${transmission.organizationId}`);
  }

  // Public methods for sending messages
  public sendToUser(userId: string, event: string, data: any): void {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.forEach(socketId => {
        this.io?.to(socketId).emit(event, data);
      });
    }
  }

  public sendToRoute(routeId: string, event: string, data: any): void {
    this.io?.to(`route_${routeId}`).emit(event, data);
  }

  public sendToOrganization(organizationId: string, event: string, data: any): void {
    this.io?.to(`org_${organizationId}`).emit(event, data);
  }

  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  public getConnectedUsers(): SocketUser[] {
    return Array.from(this.connectedUsers.values());
  }

  public isRabbitMQConnected(): boolean {
    return rabbitMQService.isConnected();
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();