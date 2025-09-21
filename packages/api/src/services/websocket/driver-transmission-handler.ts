import { DriverTransmission } from '../../types';
import { WEBSOCKET_EVENTS, MESSAGE_TYPES } from './constants';
import { DriverTransmissionRepository } from '../../../../database/src/repositories/driver-transmission.repository';
import { RabbitMQDriverTransmissionSchema } from '../../../../types/src/schemas/driver-transmission';
import { redisService, DriverLastPosition } from '../redis.service';

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
      // Guardar en la base de datos y obtener información completa
      const savedTransmission = await this.saveTransmissionToDatabase(transmission);
      console.log(`💾 Transmission saved to database for driver ${transmission.driverId}`);

      // Guardar en Redis con la información completa
      await this.saveTransmissionToRedis(transmission, savedTransmission);
      console.log(`🔴 Transmission saved to Redis for driver ${transmission.driverId}`);
    } catch (error) {
      console.error(`❌ Error saving transmission:`, error);
      // Continuar con el broadcast aunque falle el guardado
    }

    // Broadcast a todos los clientes conectados
    this.messageBroadcaster.broadcastToAll(WEBSOCKET_EVENTS.DRIVER_TRANSMISSION, {
      type: MESSAGE_TYPES.DRIVER_TRANSMISSION,
      data: transmission,
    });

    // Broadcast específico a la ruta del driver (solo si tiene ruta)
    if (transmission.routeId) {
      this.messageBroadcaster.broadcastToRoute(transmission.routeId, WEBSOCKET_EVENTS.ROUTE_DRIVER_UPDATE, {
        type: MESSAGE_TYPES.DRIVER_LOCATION_UPDATE,
        data: transmission,
      });
    }

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
   * Guarda la transmisión en la base de datos y devuelve información completa
   */
  private async saveTransmissionToDatabase(transmission: DriverTransmission): Promise<any> {
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

      // Guardar en la base de datos y obtener información completa
      return await DriverTransmissionRepository.createFromWebSocket(createData);
    } catch (error) {
      console.error('Error validating or saving transmission:', error);
      throw error;
    }
  }

  /**
   * Guarda la transmisión en Redis con información completa del driver
   */
  private async saveTransmissionToRedis(transmission: DriverTransmission, savedTransmission: any): Promise<void> {
    try {
      const lastPosition: DriverLastPosition = {
        driverId: transmission.driverId,
        driverName: savedTransmission.driver_name || 'Driver',
        driverUuid: transmission.driverId,
        routeId: transmission.routeId || undefined,
        routeName: savedTransmission.route_name || undefined,
        organizationId: transmission.organizationId,
        organizationName: savedTransmission.organization_name,
        vehicleId: transmission.vehicleId,
        location: transmission.location,
        status: transmission.status,
        batteryLevel: transmission.batteryLevel,
        signalStrength: transmission.signalStrength,
        networkType: transmission.metadata?.networkType,
        timestamp: transmission.timestamp instanceof Date 
          ? transmission.timestamp.toISOString() 
          : new Date(transmission.timestamp).toISOString(),
        metadata: transmission.metadata
      };

      await redisService.saveDriverLastPosition(transmission.driverId, lastPosition);
    } catch (error) {
      console.error('Error saving transmission to Redis:', error);
      throw error;
    }
  }
}
