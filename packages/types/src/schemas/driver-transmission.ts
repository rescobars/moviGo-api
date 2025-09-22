import { z } from 'zod';

export const DriverStatusSchema = z.enum(['DRIVING', 'STOPPED', 'OFFLINE', 'BREAK', 'MAINTENANCE']);
export const NetworkTypeSchema = z.enum(['2G', '3G', '4G', '5G', 'WIFI', 'UNKNOWN']);

// Helper functions to reduce code duplication
const coordinateTransform = (val: string | number | undefined) => {
  if (typeof val === 'string') {
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  }
  return val;
};

const percentageTransform = (val: string | number | undefined) => {
  if (typeof val === 'string') {
    const num = parseFloat(val);
    return isNaN(num) ? null : Math.max(0, Math.min(100, num)); // Clamp between 0-100
  }
  return val;
};

const speedTransform = (val: string | number | undefined) => {
  if (typeof val === 'string') {
    const num = parseFloat(val);
    return isNaN(num) ? null : Math.max(0, num); // Speed can't be negative
  }
  return val;
};

const headingTransform = (val: string | number | undefined) => {
  if (typeof val === 'string') {
    const num = parseFloat(val);
    return isNaN(num) ? null : ((num % 360) + 360) % 360; // Normalize to 0-360
  }
  return val;
};

// Schema para la ubicación GPS
export const LocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).optional(),
  altitude: z.number().optional(),
  speed: z.number().min(0).optional(),
  heading: z.number().min(0).max(360).optional()
});

// Schema para metadatos del dispositivo
export const DeviceMetadataSchema = z.object({
  appVersion: z.string().optional(),
  deviceInfo: z.string().optional(),
  networkType: NetworkTypeSchema.optional(),
  osVersion: z.string().optional(),
  deviceModel: z.string().optional(),
  appBuild: z.string().optional()
});

// Schema principal para transmisión de driver
export const DriverTransmissionSchema = z.object({
  id: z.number().int().positive().optional(),
  uuid: z.string().uuid().optional(),
  driver_id: z.number().int().positive(),
  route_id: z.number().int().positive().nullable(), // Now nullable
  organization_id: z.number().int().positive(),
  vehicle_id: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).optional(),
  altitude: z.number().optional(),
  speed: z.number().min(0).optional(),
  heading: z.number().min(0).max(360).optional(),
  status: DriverStatusSchema,
  battery_level: z.number().min(0).max(100).optional(),
  signal_strength: z.number().min(0).max(100).optional(),
  network_type: z.string().optional(),
  app_version: z.string().optional(),
  device_info: z.string().optional(),
  device_metadata: z.record(z.any()).optional(),
  transmission_timestamp: z.date().optional(), // Timestamp from producer
  created_at: z.date().optional(),
  updated_at: z.date().optional()
});

// Schema para crear una transmisión (desde el controlador)
export const CreateDriverTransmissionSchema = z.object({
  driver_uuid: z.string().uuid(),
  route_uuid: z.string().uuid().optional(), // Opcional
  organization_uuid: z.string().uuid(),
  vehicle_id: z.string().optional(),
  location: LocationSchema,
  status: DriverStatusSchema.default('DRIVING'),
  battery_level: z.union([z.number().min(0).max(100), z.string()]).optional().transform(percentageTransform),
  signal_strength: z.union([z.number().min(0).max(100), z.string()]).optional().transform(percentageTransform),
  network_type: z.string().optional(),
  metadata: DeviceMetadataSchema.optional(),
  transmission_timestamp: z.date().optional() // Timestamp from producer
});

// Schema para datos de inserción en la base de datos
export const DriverTransmissionDataForInsertSchema = z.object({
  driver_id: z.number().int().positive(),
  route_id: z.number().int().positive().nullable(), // Puede ser null
  organization_id: z.number().int().positive(),
  vehicle_id: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).optional(),
  altitude: z.number().optional(),
  speed: z.number().min(0).optional(),
  heading: z.number().min(0).max(360).optional(),
  status: DriverStatusSchema,
  battery_level: z.number().min(0).max(100).optional(),
  signal_strength: z.number().min(0).max(100).optional(),
  network_type: z.string().optional(),
  app_version: z.string().optional(),
  device_info: z.string().optional(),
  device_metadata: z.record(z.any()).optional(),
  transmission_timestamp: z.date().optional() // Timestamp from producer
});

// Schema para actualizar una transmisión
export const UpdateDriverTransmissionSchema = z.object({
  status: DriverStatusSchema.optional(),
  battery_level: z.union([z.number().min(0).max(100), z.string()]).optional().transform(percentageTransform),
  signal_strength: z.union([z.number().min(0).max(100), z.string()]).optional().transform(percentageTransform),
  network_type: z.string().optional(),
  device_metadata: z.record(z.any()).optional()
});


// Schema para validar transmisiones desde RabbitMQ
export const RabbitMQDriverTransmissionSchema = z.object({
  driverId: z.string().uuid(),
  routeId: z.string().uuid().optional(), // Opcional
  organizationId: z.string().uuid(),
  vehicleId: z.string().optional(),
  location: LocationSchema,
  status: DriverStatusSchema.default('DRIVING'),
  batteryLevel: z.number().min(0).max(100).optional(),
  signalStrength: z.number().min(0).max(100).optional(),
  timestamp: z.string().datetime().or(z.date()),
  metadata: DeviceMetadataSchema.optional()
});

// Types exportados
export type DriverTransmission = z.infer<typeof DriverTransmissionSchema>;
export type CreateDriverTransmission = z.infer<typeof CreateDriverTransmissionSchema>;
export type DriverTransmissionDataForInsert = z.infer<typeof DriverTransmissionDataForInsertSchema>;
export type UpdateDriverTransmission = z.infer<typeof UpdateDriverTransmissionSchema>;
export type DriverStatus = z.infer<typeof DriverStatusSchema>;
export type NetworkType = z.infer<typeof NetworkTypeSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type DeviceMetadata = z.infer<typeof DeviceMetadataSchema>;
export type RabbitMQDriverTransmission = z.infer<typeof RabbitMQDriverTransmissionSchema>;
