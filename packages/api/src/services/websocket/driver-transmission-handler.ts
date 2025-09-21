import { DriverTransmission } from '../../types';
import { WEBSOCKET_EVENTS, MESSAGE_TYPES } from './constants';
import { DriverTransmissionRepository } from '../../../../database/src/repositories/driver-transmission.repository';
import { RabbitMQDriverTransmissionSchema } from '../../../../types/src/schemas/driver-transmission';

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

    try {
      // Guardar en la base de datos
      await this.saveTransmissionToDatabase(transmission);
      console.log(`💾 Transmission saved to database for driver ${transmission.driverId}`);
    } catch (error) {
      console.error(`❌ Error saving transmission to database:`, error);
      // Continuar con el broadcast aunque falle el guardado
    }

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

  /**
   * Guarda la transmisión en la base de datos
   */
  private async saveTransmissionToDatabase(transmission: DriverTransmission): Promise<void> {
    try {
      // Validar la transmisión con el esquema de RabbitMQ
      const validatedTransmission = RabbitMQDriverTransmissionSchema.parse(transmission);

      // Convertir a formato de base de datos
      const createData = {
        driver_uuid: validatedTransmission.driverId,
        route_uuid: validatedTransmission.routeId,
        organization_uuid: validatedTransmission.organizationId,
        vehicle_id: validatedTransmission.vehicleId,
        location: validatedTransmission.location,
        status: validatedTransmission.status,
        battery_level: validatedTransmission.batteryLevel,
        signal_strength: validatedTransmission.signalStrength,
        network_type: validatedTransmission.metadata?.networkType,
        metadata: validatedTransmission.metadata
      };

      // Guardar en la base de datos
      await DriverTransmissionRepository.createFromWebSocket(createData);
    } catch (error) {
      console.error('Error validating or saving transmission:', error);
      throw error;
    }
  }
}
