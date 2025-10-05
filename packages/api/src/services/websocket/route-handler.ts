import { Socket } from 'socket.io';
import { WEBSOCKET_EVENTS } from './constants';

export class WebSocketRouteHandler {
  private roomManager: any; // Will be injected
  private messageBroadcaster: any; // Will be injected
  private authHandler: any; // Will be injected

  constructor() {}

  /**
   * Inyecta dependencias
   */
  setDependencies(roomManager: any, messageBroadcaster: any, authHandler: any): void {
    this.roomManager = roomManager;
    this.messageBroadcaster = messageBroadcaster;
    this.authHandler = authHandler;
  }

  /**
   * Maneja la unión a una ruta
   */
  handleJoinRoute(socket: Socket, routeId: string): void {
    if (!this.authHandler.isAuthenticated(socket.id)) {
      this.sendError(socket, 'Authentication required to join a route');
      return;
    }

    const user = this.authHandler.getAuthenticatedUser(socket.id);
    if (!user) return;

    this.roomManager.joinRoute(socket.id, routeId);
    this.messageBroadcaster.sendToSocket(socket.id, WEBSOCKET_EVENTS.JOINED_ROUTE, { routeId });
    
  }

  /**
   * Maneja la salida de una ruta
   */
  handleLeaveRoute(socket: Socket, routeId: string): void {
    if (!this.authHandler.isAuthenticated(socket.id)) {
      this.sendError(socket, 'Authentication required to leave a route');
      return;
    }

    const user = this.authHandler.getAuthenticatedUser(socket.id);
    if (!user) return;

    this.roomManager.leaveRoute(socket.id, routeId);
    this.messageBroadcaster.sendToSocket(socket.id, WEBSOCKET_EVENTS.LEFT_ROUTE, { routeId });
    
  }

  /**
   * Envía un error al socket
   */
  private sendError(socket: Socket, message: string): void {
    this.messageBroadcaster.sendToSocket(socket.id, WEBSOCKET_EVENTS.ERROR, { message });
  }
}
