import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { RabbitMQMessage, rabbitMQService } from './rabbitmq.service';
import { DriverTransmission } from '../types';
import { WebSocketServiceConfig, AuthenticationData } from './websocket/types';
import { WEBSOCKET_EVENTS, RABBITMQ_MESSAGE_TYPES } from './websocket/constants';
import { WebSocketRoomManager } from './websocket/room-manager';
import { WebSocketMessageBroadcaster } from './websocket/message-broadcaster';
import { WebSocketAuthHandler } from './websocket/auth-handler';
import { WebSocketRouteHandler } from './websocket/route-handler';
import { DriverTransmissionHandler } from './websocket/driver-transmission-handler';

export class WebSocketService {
  private io: SocketIOServer | null = null;
  private roomManager: WebSocketRoomManager | null = null;
  private messageBroadcaster: WebSocketMessageBroadcaster | null = null;
  private authHandler: WebSocketAuthHandler;
  private routeHandler: WebSocketRouteHandler;
  private driverTransmissionHandler: DriverTransmissionHandler;

  constructor() {
    this.authHandler = new WebSocketAuthHandler();
    this.routeHandler = new WebSocketRouteHandler();
    this.driverTransmissionHandler = new DriverTransmissionHandler();
    this.setupRabbitMQConsumer();
  }

  /**
   * Inicializa el servicio WebSocket con el servidor HTTP
   * Configura CORS y los manejadores de eventos
   */
  initialize(server: HTTPServer, config?: WebSocketServiceConfig): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: config?.corsOrigin || process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: (config?.transports as any) || ['websocket', 'polling']
    });

    this.initializeComponents();
    this.setupEventHandlers();
    console.log('🚀 WebSocket service initialized');
  }

  /**
   * Inicializa todos los componentes del servicio
   */
  private initializeComponents(): void {
    if (!this.io) return;

    // Crear instancias de los componentes
    this.roomManager = new WebSocketRoomManager(this.io);
    this.messageBroadcaster = new WebSocketMessageBroadcaster(this.io);

    // Configurar dependencias
    this.messageBroadcaster.setRoomManager(this.roomManager);
    this.authHandler.setDependencies(this.roomManager, this.messageBroadcaster);
    this.routeHandler.setDependencies(this.roomManager, this.messageBroadcaster, this.authHandler);
    this.driverTransmissionHandler.setDependencies(this.messageBroadcaster);
  }

  /**
   * Configura los manejadores de eventos para las conexiones WebSocket
   * Maneja autenticación, unión a rutas y desconexiones
   */
  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Handle authentication
      socket.on(WEBSOCKET_EVENTS.AUTHENTICATE, (data: AuthenticationData) => {
        this.authHandler.handleAuthentication(socket, data);
      });

      // Handle joining routes
      socket.on(WEBSOCKET_EVENTS.JOIN_ROUTE, (routeId: string) => {
        this.routeHandler.handleJoinRoute(socket, routeId);
      });

      // Handle leaving routes
      socket.on(WEBSOCKET_EVENTS.LEAVE_ROUTE, (routeId: string) => {
        this.routeHandler.handleLeaveRoute(socket, routeId);
      });

      // Handle disconnection
      socket.on(WEBSOCKET_EVENTS.DISCONNECT, () => {
        this.handleDisconnect(socket);
      });
    });
  }

  /**
   * Maneja la desconexión de un socket
   * Limpia todas las referencias y relaciones del usuario
   */
  private handleDisconnect(socket: Socket): void {
    if (this.roomManager) {
      const user = this.roomManager.getUser(socket.id);
      if (user && user.userId) {
        console.log(`🔌 User ${user.userId} disconnected`);
      }
      this.roomManager.unregisterUser(socket.id);
    }
  }

  /**
   * Configura el consumidor de RabbitMQ para procesar mensajes
   * Solo procesa transmisiones de drivers del tipo 'transmission.received'
   */
  private setupRabbitMQConsumer(): void {
    console.log('🐰 Setting up RabbitMQ consumer...');
    rabbitMQService.consumeMessages(async (message: RabbitMQMessage) => {
      if (message.type === RABBITMQ_MESSAGE_TYPES.TRANSMISSION_RECEIVED && message.data) {
        const transmission: DriverTransmission = message.data;
        await this.driverTransmissionHandler.handleDriverTransmission(transmission);
      }
    });
  }

  // ==================== PUBLIC API ====================

  /**
   * Envía un mensaje a un usuario específico por su ID
   */
  public sendToUser(userId: string, event: string, data: any): void {
    this.messageBroadcaster?.sendToUser(userId, event, data);
  }

  /**
   * Envía un mensaje a todos los usuarios en una ruta específica
   */
  public sendToRoute(routeId: string, event: string, data: any): void {
    this.messageBroadcaster?.broadcastToRoute(routeId, event, data);
  }

  /**
   * Envía un mensaje a todos los usuarios en una organización específica
   */
  public sendToOrganization(organizationId: string, event: string, data: any): void {
    this.messageBroadcaster?.broadcastToOrganization(organizationId, event, data);
  }

  /**
   * Envía un mensaje a todos los clientes conectados
   */
  public broadcastToAll(event: string, data: any): void {
    this.messageBroadcaster?.broadcastToAll(event, data);
  }

  /**
   * Retorna el número de usuarios conectados
   */
  public getConnectedUsersCount(): number {
    return this.roomManager?.getConnectedUsersCount() || 0;
  }

  /**
   * Retorna la lista de usuarios conectados
   */
  public getConnectedUsers() {
    return this.roomManager?.getAllUsers() || [];
  }

  /**
   * Verifica si RabbitMQ está conectado
   */
  public isRabbitMQConnected(): boolean {
    return rabbitMQService.isConnected();
  }

  /**
   * Obtiene información de un usuario por socket ID
   */
  public getUser(socketId: string) {
    return this.roomManager?.getUser(socketId);
  }

  /**
   * Obtiene usuarios en una ruta específica
   */
  public getUsersInRoute(routeId: string): string[] {
    return this.roomManager?.getUsersInRoute(routeId) || [];
  }

  /**
   * Obtiene usuarios en una organización específica
   */
  public getUsersInOrganization(organizationId: string): string[] {
    return this.roomManager?.getUsersInOrganization(organizationId) || [];
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();