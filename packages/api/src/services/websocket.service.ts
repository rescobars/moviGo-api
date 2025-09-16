import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { RabbitMQMessage, rabbitMQService } from './rabbitmq.service';

export interface SocketUser {
  id: string;
  userId?: string;
  organizationId?: string;
  socket: Socket;
}

export class WebSocketService {
  private io: SocketIOServer | null = null;
  private connectedUsers: Map<string, SocketUser> = new Map();
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds

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
    console.log('🚀 WebSocket service initialized');
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Handle user authentication/identification
      socket.on('authenticate', (data: { userId?: string; organizationId?: string }) => {
        this.authenticateUser(socket, data);
      });

      // Handle joining organization rooms
      socket.on('join_organization', (organizationId: string) => {
        this.joinOrganization(socket, organizationId);
      });

      // Handle leaving organization rooms
      socket.on('leave_organization', (organizationId: string) => {
        this.leaveOrganization(socket, organizationId);
      });

      // Handle joining route-specific rooms
      socket.on('join_route', (routeId: string) => {
        this.joinRoute(socket, routeId);
      });

      // Handle leaving route-specific rooms
      socket.on('leave_route', (routeId: string) => {
        this.leaveRoute(socket, routeId);
      });

      // Handle custom events
      socket.on('subscribe_event', (eventType: string) => {
        this.subscribeToEvent(socket, eventType);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnection(socket);
      });
    });
  }

  private authenticateUser(socket: Socket, data: { userId?: string; organizationId?: string }): void {
    const user: SocketUser = {
      id: socket.id,
      userId: data.userId,
      organizationId: data.organizationId,
      socket
    };

    this.connectedUsers.set(socket.id, user);

    if (data.userId) {
      if (!this.userSockets.has(data.userId)) {
        this.userSockets.set(data.userId, new Set());
      }
      this.userSockets.get(data.userId)!.add(socket.id);
    }

    socket.emit('authenticated', { success: true, socketId: socket.id });
    console.log(`👤 User authenticated: ${data.userId || 'anonymous'} (${socket.id})`);
  }

  private joinOrganization(socket: Socket, organizationId: string): void {
    socket.join(`org_${organizationId}`);
    socket.emit('joined_organization', { organizationId });
    console.log(`🏢 Socket ${socket.id} joined organization: ${organizationId}`);
  }

  private leaveOrganization(socket: Socket, organizationId: string): void {
    socket.leave(`org_${organizationId}`);
    socket.emit('left_organization', { organizationId });
    console.log(`🏢 Socket ${socket.id} left organization: ${organizationId}`);
  }

  private joinRoute(socket: Socket, routeId: string): void {
    socket.join(`route_${routeId}`);
    socket.emit('joined_route', { routeId });
    console.log(`🛣️ Socket ${socket.id} joined route: ${routeId}`);
  }

  private leaveRoute(socket: Socket, routeId: string): void {
    socket.leave(`route_${routeId}`);
    socket.emit('left_route', { routeId });
    console.log(`🛣️ Socket ${socket.id} left route: ${routeId}`);
  }

  private subscribeToEvent(socket: Socket, eventType: string): void {
    socket.join(`event_${eventType}`);
    socket.emit('subscribed_to_event', { eventType });
    console.log(`📡 Socket ${socket.id} subscribed to event: ${eventType}`);
  }

  private handleDisconnection(socket: Socket): void {
    const user = this.connectedUsers.get(socket.id);
    
    if (user?.userId) {
      const userSocketSet = this.userSockets.get(user.userId);
      if (userSocketSet) {
        userSocketSet.delete(socket.id);
        if (userSocketSet.size === 0) {
          this.userSockets.delete(user.userId);
        }
      }
    }

    this.connectedUsers.delete(socket.id);
    console.log(`🔌 Client disconnected: ${socket.id}`);
  }

  private setupRabbitMQConsumer(): void {
    rabbitMQService.consumeMessages((message: RabbitMQMessage) => {
      this.broadcastMessage(message);
    });
  }

  private broadcastMessage(message: RabbitMQMessage): void {
    if (!this.io) return;

    const { type, data } = message;

    // Broadcast to specific event subscribers
    this.io.to(`event_${type}`).emit('message', {
      type,
      data,
      timestamp: message.timestamp
    });

    // Route-specific broadcasts
    if (data.routeId) {
      this.io.to(`route_${data.routeId}`).emit('route_update', {
        type,
        data,
        timestamp: message.timestamp
      });
    }

    // Organization-specific broadcasts
    if (data.organizationId) {
      this.io.to(`org_${data.organizationId}`).emit('organization_update', {
        type,
        data,
        timestamp: message.timestamp
      });
    }

    // User-specific broadcasts
    if (data.userId) {
      const userSockets = this.userSockets.get(data.userId);
      if (userSockets) {
        userSockets.forEach(socketId => {
          const socket = this.io?.sockets.sockets.get(socketId);
          if (socket) {
            socket.emit('user_update', {
              type,
              data,
              timestamp: message.timestamp
            });
          }
        });
      }
    }

    console.log(`📡 Message broadcasted: ${type}`);
  }

  // Public methods for sending messages
  public sendToUser(userId: string, event: string, data: any): void {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.forEach(socketId => {
        const socket = this.io?.sockets.sockets.get(socketId);
        if (socket) {
          socket.emit(event, data);
        }
      });
    }
  }

  public sendToOrganization(organizationId: string, event: string, data: any): void {
    this.io?.to(`org_${organizationId}`).emit(event, data);
  }

  public sendToRoute(routeId: string, event: string, data: any): void {
    this.io?.to(`route_${routeId}`).emit(event, data);
  }

  public broadcastToAll(event: string, data: any): void {
    this.io?.emit(event, data);
  }

  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  public getConnectedUsers(): SocketUser[] {
    return Array.from(this.connectedUsers.values());
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();
