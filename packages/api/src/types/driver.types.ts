import { z } from 'zod';

// Enums en mayúsculas
export enum DriverStatus {
  DRIVING = 'DRIVING',
  STOPPED = 'STOPPED',
  OFFLINE = 'OFFLINE',
  BREAK = 'BREAK',
  DELIVERY = 'DELIVERY'
}

export enum NetworkType {
  WIFI = 'WIFI',
  FOUR_G = '4G',
  FIVE_G = '5G',
  THREE_G = '3G',
  UNKNOWN = 'UNKNOWN'
}

// Esquemas Zod para validación
export const LocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).optional(),
  altitude: z.number().optional(),
  speed: z.number().min(0).optional(),
  heading: z.number().min(0).max(360).optional()
});

export const DriverMetadataSchema = z.object({
  appVersion: z.string().optional(),
  deviceInfo: z.string().optional(),
  networkType: z.nativeEnum(NetworkType).optional()
});

export const DriverTransmissionSchema = z.object({
  driverId: z.string().min(1),
  routeId: z.string().min(1),
  vehicleId: z.string().optional(),
  location: LocationSchema,
  status: z.nativeEnum(DriverStatus),
  batteryLevel: z.number().min(0).max(100).optional(),
  signalStrength: z.number().min(0).max(100).optional(),
  timestamp: z.date(),
  metadata: DriverMetadataSchema.optional()
});

// Tipos inferidos de los esquemas Zod
export type DriverTransmission = z.infer<typeof DriverTransmissionSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type DriverMetadata = z.infer<typeof DriverMetadataSchema>;

// Eventos WebSocket relacionados con drivers
export interface DriverWebSocketEvents {
  'driver_transmission': {
    type: 'driver_transmission';
    data: DriverTransmission;
    timestamp: Date;
  };
  'route_driver_update': {
    type: 'driver_location_update';
    data: DriverTransmission;
    timestamp: Date;
  };
  'driver_status_update': {
    type: 'status_confirmed';
    data: DriverTransmission;
    timestamp: Date;
  };
}

// Funciones de validación
export const validateDriverTransmission = (data: unknown): DriverTransmission => {
  return DriverTransmissionSchema.parse(data);
};

export const validateLocation = (data: unknown): Location => {
  return LocationSchema.parse(data);
};

export const validateDriverMetadata = (data: unknown): DriverMetadata => {
  return DriverMetadataSchema.parse(data);
};
