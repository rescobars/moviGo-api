import { DriverTransmission } from '../../types';
import { WEBSOCKET_EVENTS, MESSAGE_TYPES } from './constants';

export class DriverTransmissionHandler {
  private messageBroadcaster: any; // Will be injected

  constructor() {}

  /**
   * Inyecta dependencias
   */
  setDependencies(messageBroadcaster: any): void {
    this.messageBroadcaster = messageBroadcaster;
  }

  /**
   * Procesa y distribuye una transmisión de driver
   */
  async handleDriverTransmission(transmission: DriverTransmission): Promise<void> {
    console.log(`📡 Broadcasting transmission for driver ${transmission.driverId}`);

    // Broadcast a todos los clientes conectados
    this.messageBroadcaster.broadcastToAll(WEBSOCKET_EVENTS.DRIVER_TRANSMISSION, {
      type: MESSAGE_TYPES.DRIVER_TRANSMISSION,
      data: transmission,
    });

    // Broadcast específico a la ruta del driver
    this.messageBroadcaster.broadcastToRoute(transmission.routeId, WEBSOCKET_EVENTS.ROUTE_DRIVER_UPDATE, {
      type: MESSAGE_TYPES.DRIVER_LOCATION_UPDATE,
      data: transmission,
    });

    // Broadcast específico a la organización del driver
    this.messageBroadcaster.broadcastToOrganization(transmission.organizationId, WEBSOCKET_EVENTS.ORGANIZATION_DRIVER_UPDATE, {
      type: MESSAGE_TYPES.ORGANIZATION_DRIVER_UPDATE,
      data: transmission,
    });

    // Broadcast específico al driver (si está conectado)
    this.messageBroadcaster.sendToUser(transmission.driverId, WEBSOCKET_EVENTS.DRIVER_STATUS_UPDATE, {
      type: MESSAGE_TYPES.STATUS_CONFIRMED,
      data: transmission,
    });
  }
}
