export const WEBSOCKET_EVENTS = {
  // Client to Server
  AUTHENTICATE: 'authenticate',
  JOIN_ROUTE: 'join_route',
  LEAVE_ROUTE: 'leave_route',
  DISCONNECT: 'disconnect',
  
  // Server to Client
  AUTHENTICATED: 'authenticated',
  AUTH_ERROR: 'auth_error',
  JOINED_ROUTE: 'joined_route',
  LEFT_ROUTE: 'left_route',
  ERROR: 'error',
  
  // Driver transmission events
  DRIVER_TRANSMISSION: 'driver_transmission',
  ROUTE_DRIVER_UPDATE: 'route_driver_update',
  ORGANIZATION_DRIVER_UPDATE: 'organization_driver_update',
  DRIVER_STATUS_UPDATE: 'driver_status_update',
} as const;

export const ROOM_PREFIXES = {
  ROUTE: 'route_',
  ORGANIZATION: 'org_',
} as const;

export const MESSAGE_TYPES = {
  DRIVER_TRANSMISSION: 'driver_transmission',
  DRIVER_LOCATION_UPDATE: 'driver_location_update',
  ORGANIZATION_DRIVER_UPDATE: 'organization_driver_update',
  STATUS_CONFIRMED: 'status_confirmed',
} as const;

export const RABBITMQ_MESSAGE_TYPES = {
  TRANSMISSION_RECEIVED: 'transmission.received',
} as const;
