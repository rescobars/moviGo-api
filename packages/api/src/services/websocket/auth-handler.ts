import { Socket } from 'socket.io';
import { AuthenticationData, SocketUser } from './types';
import { WEBSOCKET_EVENTS } from './constants';

export class WebSocketAuthHandler {
  private roomManager: any; // Will be injected
  private messageBroadcaster: any; // Will be injected

  constructor() {}

  /**
   * Inyecta dependencias
   */
  setDependencies(roomManager: any, messageBroadcaster: any): void {
    this.roomManager = roomManager;
    this.messageBroadcaster = messageBroadcaster;
  }

  /**
   * Maneja la autenticación de un usuario
   */
  handleAuthentication(socket: Socket, data: AuthenticationData): void {
    const { userId, organizationId } = data;
    
    if (!userId) {
      this.sendAuthError(socket, 'User ID is required for authentication');
      return;
    }

    const user: SocketUser = { 
      id: socket.id, 
      userId, 
      organizationId 
    };

    this.roomManager.registerUser(socket, user);
    this.sendAuthenticationSuccess(socket, { userId, organizationId });
    
  }

  /**
   * Valida si un usuario está autenticado
   */
  isAuthenticated(socketId: string): boolean {
    const user = this.roomManager.getUser(socketId);
    return !!(user && user.userId);
  }

  /**
   * Obtiene el usuario autenticado
   */
  getAuthenticatedUser(socketId: string): SocketUser | null {
    const user = this.roomManager.getUser(socketId);
    return (user && user.userId) ? user : null;
  }

  /**
   * Envía error de autenticación
   */
  private sendAuthError(socket: Socket, message: string): void {
    this.messageBroadcaster.sendToSocket(socket.id, WEBSOCKET_EVENTS.AUTH_ERROR, { message });
    socket.disconnect(true);
  }

  /**
   * Envía confirmación de autenticación exitosa
   */
  private sendAuthenticationSuccess(socket: Socket, data: { userId: string; organizationId?: string }): void {
    this.messageBroadcaster.sendToSocket(socket.id, WEBSOCKET_EVENTS.AUTHENTICATED, data);
  }
}
