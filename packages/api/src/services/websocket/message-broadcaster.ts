import { Server as SocketIOServer } from 'socket.io';
import { MessageBroadcaster, WebSocketMessage } from './types';
import { ROOM_PREFIXES } from './constants';

export class WebSocketMessageBroadcaster implements MessageBroadcaster {
  private io: SocketIOServer;
  private roomManager: any; // Circular dependency, will be injected

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  /**
   * Inyecta el room manager para evitar dependencias circulares
   */
  setRoomManager(roomManager: any): void {
    this.roomManager = roomManager;
  }

  /**
   * Envía un mensaje a todos los clientes conectados
   */
  broadcastToAll(event: string, data: any): void {
    const message: WebSocketMessage = {
      event,
      data,
      timestamp: new Date()
    };
    this.io.emit(event, message);
  }

  /**
   * Envía un mensaje a todos los usuarios en una ruta específica
   */
  broadcastToRoute(routeId: string, event: string, data: any): void {
    const message: WebSocketMessage = {
      event,
      data,
      timestamp: new Date()
    };
    this.io.to(`${ROOM_PREFIXES.ROUTE}${routeId}`).emit(event, message);
  }

  /**
   * Envía un mensaje a todos los usuarios en una organización específica
   */
  broadcastToOrganization(organizationId: string, event: string, data: any): void {
    const message: WebSocketMessage = {
      event,
      data,
      timestamp: new Date()
    };
    this.io.to(`${ROOM_PREFIXES.ORGANIZATION}${organizationId}`).emit(event, message);
  }

  /**
   * Envía un mensaje a un usuario específico por su ID
   */
  sendToUser(userId: string, event: string, data: any): void {
    if (!this.roomManager) return;
    
    const userSockets = this.roomManager.getUserSockets(userId);
    const message: WebSocketMessage = {
      event,
      data,
      timestamp: new Date()
    };

    userSockets.forEach((socketId: string) => {
      this.io.to(socketId).emit(event, message);
    });
  }

  /**
   * Envía un mensaje a un socket específico
   */
  sendToSocket(socketId: string, event: string, data: any): void {
    const message: WebSocketMessage = {
      event,
      data,
      timestamp: new Date()
    };
    this.io.to(socketId).emit(event, message);
  }
}
