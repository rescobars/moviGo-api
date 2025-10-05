import Redis from 'ioredis';

export interface DriverLastPosition {
  driverId: string;
  driverName?: string;
  driverUuid?: string;
  routeId?: string;
  routeName?: string;
  organizationId: string;
  organizationName?: string;
  vehicleId?: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    speed?: number;
    heading?: number;
  };
  status: string;
  batteryLevel?: number;
  signalStrength?: number;
  networkType?: string;
  timestamp: string; // Timestamp from producer
  transmissionTimestamp?: string; // Alias for timestamp (for backward compatibility)
  metadata?: {
    appVersion?: string;
    deviceInfo?: string;
    networkType?: string;
  };
}

export class RedisService {
  private redis: Redis;
  private readonly DRIVER_POSITION_PREFIX = 'driver:last_position:';
  private readonly DRIVER_INFO_PREFIX = 'driver:info:';

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redisPassword = process.env.REDIS_PASSWORD;
    
    this.redis = new Redis(redisUrl, {
      password: redisPassword,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });

    this.redis.on('connect', () => {
      console.log('🔴 Connected to Redis');
    });

    this.redis.on('error', (err: Error) => {
      console.error('❌ Redis connection error:', err);
    });
  }

  /**
   * Guarda la última posición de un driver en Redis
   */
  async saveDriverLastPosition(driverId: string, position: DriverLastPosition): Promise<void> {
    try {
      const key = `${this.DRIVER_POSITION_PREFIX}${driverId}`;
      await this.redis.setex(key, 86400, JSON.stringify(position)); // Expira en 24 horas
      console.log(`📍 Saved last position for driver ${driverId} in Redis`);
    } catch (error) {
      console.error('Error saving driver position to Redis:', error);
      throw error;
    }
  }

  /**
   * Obtiene la última posición de un driver desde Redis
   */
  async getDriverLastPosition(driverId: string): Promise<DriverLastPosition | null> {
    try {
      const key = `${this.DRIVER_POSITION_PREFIX}${driverId}`;
      const data = await this.redis.get(key);
      
      if (!data) {
        return null;
      }

      return JSON.parse(data) as DriverLastPosition;
    } catch (error) {
      console.error('Error getting driver position from Redis:', error);
      return null;
    }
  }

  /**
   * Obtiene las últimas posiciones de múltiples drivers
   */
  async getMultipleDriverLastPositions(driverIds: string[]): Promise<DriverLastPosition[]> {
    try {
      const keys = driverIds.map(id => `${this.DRIVER_POSITION_PREFIX}${id}`);
      const data = await this.redis.mget(...keys);
      
      return data
        .filter((item: string | null) => item !== null)
        .map((item: string) => JSON.parse(item) as DriverLastPosition);
    } catch (error) {
      console.error('Error getting multiple driver positions from Redis:', error);
      return [];
    }
  }

  /**
   * Obtiene todas las últimas posiciones de drivers de una organización
   */
  async getOrganizationDriverLastPositions(organizationId: string): Promise<DriverLastPosition[]> {
    try {
      const pattern = `${this.DRIVER_POSITION_PREFIX}*`;
      const keys = await this.redis.keys(pattern);
      
      if (keys.length === 0) {
        return [];
      }

      const data = await this.redis.mget(...keys);
      
      return data
        .filter((item: string | null) => item !== null)
        .map((item: string) => JSON.parse(item) as DriverLastPosition)
        .filter(position => position.organizationId === organizationId);
    } catch (error) {
      console.error('Error getting organization driver positions from Redis:', error);
      return [];
    }
  }

  /**
   * Obtiene las últimas posiciones de drivers de múltiples rutas
   */
  async getMultipleRoutesDriverLastPositions(routeIds: string[]): Promise<DriverLastPosition[]> {
    try {
      const pattern = `${this.DRIVER_POSITION_PREFIX}*`;
      const keys = await this.redis.keys(pattern);
      
      if (keys.length === 0) {
        return [];
      }

      const data = await this.redis.mget(...keys);
      
      return data
        .filter((item: string | null) => item !== null)
        .map((item: string) => JSON.parse(item) as DriverLastPosition)
        .filter(position => routeIds.includes(position.routeId || ''));
    } catch (error) {
      console.error('Error getting multiple routes driver positions from Redis:', error);
      return [];
    }
  }


  /**
   * Obtiene información de un driver
   */
  async getDriverInfo(driverId: string): Promise<any | null> {
    try {
      const key = `${this.DRIVER_INFO_PREFIX}${driverId}`;
      const data = await this.redis.get(key);
      
      if (!data) {
        return null;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting driver info from Redis:', error);
      return null;
    }
  }

  /**
   * Guarda información de un driver
   */
  async saveDriverInfo(driverId: string, driverInfo: any): Promise<void> {
    try {
      const key = `${this.DRIVER_INFO_PREFIX}${driverId}`;
      await this.redis.setex(key, 86400, JSON.stringify(driverInfo)); // Expira en 24 horas
    } catch (error) {
      console.error('Error saving driver info to Redis:', error);
      throw error;
    }
  }

  /**
   * Verifica si Redis está conectado
   */
  isConnected(): boolean {
    return this.redis.status === 'ready';
  }

  /**
   * Cierra la conexión Redis
   */
  async close(): Promise<void> {
    await this.redis.quit();
  }
}

// Singleton instance
export const redisService = new RedisService();
