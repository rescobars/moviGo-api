import { Server as SocketIOServer, Socket } from 'socket.io';
import { SocketUser, RoomManager } from './types';
import { ROOM_PREFIXES } from './constants';

export class WebSocketRoomManager implements RoomManager {
  private io: SocketIOServer;
  private connectedUsers = new Map<string, SocketUser>();
  private userSockets = new Map<string, Set<string>>();
  private organizationSockets = new Map<string, Set<string>>();

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  /**
   * Registra un usuario y sus relaciones
   */
  registerUser(socket: Socket, user: SocketUser): void {
    this.connectedUsers.set(socket.id, user);
    
    // Add socket to user's set of sockets
    if (user.userId) {
      if (!this.userSockets.has(user.userId)) {
        this.userSockets.set(user.userId, new Set());
      }
      this.userSockets.get(user.userId)?.add(socket.id);
    }

    // Join organization room if provided
    if (user.organizationId) {
      this.joinOrganization(socket.id, user.organizationId);
    }
  }

  /**
   * Desregistra un usuario y limpia sus relaciones
   */
  unregisterUser(socketId: string): void {
    const user = this.connectedUsers.get(socketId);
    if (user && user.userId) {
      this.userSockets.get(user.userId)?.delete(socketId);
      if (this.userSockets.get(user.userId)?.size === 0) {
        this.userSockets.delete(user.userId);
      }
      
      if (user.organizationId) {
        this.leaveOrganization(socketId, user.organizationId);
      }
    }
    this.connectedUsers.delete(socketId);
  }

  /**
   * Une un socket a una sala de ruta
   */
  joinRoute(socketId: string, routeId: string): void {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.join(`${ROOM_PREFIXES.ROUTE}${routeId}`);
    }
  }

  /**
   * Saca un socket de una sala de ruta
   */
  leaveRoute(socketId: string, routeId: string): void {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.leave(`${ROOM_PREFIXES.ROUTE}${routeId}`);
    }
  }

  /**
   * Une un socket a una sala de organización
   */
  joinOrganization(socketId: string, organizationId: string): void {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.join(`${ROOM_PREFIXES.ORGANIZATION}${organizationId}`);
      
      if (!this.organizationSockets.has(organizationId)) {
        this.organizationSockets.set(organizationId, new Set());
      }
      this.organizationSockets.get(organizationId)?.add(socketId);
    }
  }

  /**
   * Saca un socket de una sala de organización
   */
  leaveOrganization(socketId: string, organizationId: string): void {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.leave(`${ROOM_PREFIXES.ORGANIZATION}${organizationId}`);
      
      this.organizationSockets.get(organizationId)?.delete(socketId);
      if (this.organizationSockets.get(organizationId)?.size === 0) {
        this.organizationSockets.delete(organizationId);
      }
    }
  }

  /**
   * Obtiene usuarios en una ruta específica
   */
  getUsersInRoute(routeId: string): string[] {
    const room = this.io.sockets.adapter.rooms.get(`${ROOM_PREFIXES.ROUTE}${routeId}`);
    return room ? Array.from(room) : [];
  }

  /**
   * Obtiene usuarios en una organización específica
   */
  getUsersInOrganization(organizationId: string): string[] {
    const room = this.io.sockets.adapter.rooms.get(`${ROOM_PREFIXES.ORGANIZATION}${organizationId}`);
    return room ? Array.from(room) : [];
  }

  /**
   * Obtiene información de un usuario por socket ID
   */
  getUser(socketId: string): SocketUser | undefined {
    return this.connectedUsers.get(socketId);
  }

  /**
   * Obtiene sockets de un usuario por ID
   */
  getUserSockets(userId: string): Set<string> {
    return this.userSockets.get(userId) || new Set();
  }

  /**
   * Obtiene todos los usuarios conectados
   */
  getAllUsers(): SocketUser[] {
    return Array.from(this.connectedUsers.values());
  }

  /**
   * Obtiene el número de usuarios conectados
   */
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }
}
