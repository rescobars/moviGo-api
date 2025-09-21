export interface SocketUser {
  id: string;
  userId?: string;
  organizationId?: string;
}

export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: Date;
}

export interface AuthenticationData {
  userId: string;
  organizationId?: string;
}

export interface RouteJoinData {
  routeId: string;
}

export interface WebSocketMessage {
  event: string;
  data: any;
  timestamp?: Date;
}

export interface WebSocketServiceConfig {
  corsOrigin?: string;
  transports?: string[];
}

export interface RoomManager {
  joinRoute(socketId: string, routeId: string): void;
  leaveRoute(socketId: string, routeId: string): void;
  joinOrganization(socketId: string, organizationId: string): void;
  leaveOrganization(socketId: string, organizationId: string): void;
  getUsersInRoute(routeId: string): string[];
  getUsersInOrganization(organizationId: string): string[];
}

export interface MessageBroadcaster {
  broadcastToAll(event: string, data: any): void;
  broadcastToRoute(routeId: string, event: string, data: any): void;
  broadcastToOrganization(organizationId: string, event: string, data: any): void;
  sendToUser(userId: string, event: string, data: any): void;
}
