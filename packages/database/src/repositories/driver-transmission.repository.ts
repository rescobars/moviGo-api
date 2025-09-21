import { db } from '../db-config';
import { 
  DriverTransmissionDataForInsert,
  CreateDriverTransmission
} from '../../../types/src/schemas/driver-transmission';

export class DriverTransmissionRepository {

  /**
   * Crea una nueva transmisión
   */
  static async create(transmissionData: DriverTransmissionDataForInsert): Promise<any> {
    const [transmission] = await db('driver_transmissions')
      .insert(transmissionData)
      .returning('*');

    return transmission;
  }

  /**
   * Crea una transmisión desde datos del WebSocket y devuelve información completa
   */
  static async createFromWebSocket(createData: CreateDriverTransmission): Promise<any> {
    // Get IDs and names from UUIDs
    const [driver, organization] = await Promise.all([
      db('users').select('id', 'name').where('uuid', createData.driver_uuid).first(),
      db('organizations').select('id', 'name').where('uuid', createData.organization_uuid).first()
    ]);

    if (!driver) throw new Error(`Driver with UUID ${createData.driver_uuid} not found`);
    if (!organization) throw new Error(`Organization with UUID ${createData.organization_uuid} not found`);

    // Route es opcional - buscar solo si se proporciona
    let routeId = null;
    let routeName = null;
    if (createData.route_uuid) {
      const route = await db('routes').select('id', 'route_name').where('uuid', createData.route_uuid).first();
      if (!route) {
        console.warn(`Route with UUID ${createData.route_uuid} not found, saving transmission without route`);
      } else {
        routeId = route.id;
        routeName = route.route_name;
      }
    }

    const transmissionData: DriverTransmissionDataForInsert = {
      driver_id: driver.id,
      route_id: routeId, // Puede ser null
      organization_id: organization.id,
      vehicle_id: createData.vehicle_id,
      latitude: createData.location.latitude,
      longitude: createData.location.longitude,
      accuracy: createData.location.accuracy,
      altitude: createData.location.altitude,
      speed: createData.location.speed,
      heading: createData.location.heading ?? undefined,
      status: createData.status,
      battery_level: createData.battery_level ?? undefined,
      signal_strength: createData.signal_strength ?? undefined,
      network_type: createData.network_type,
      app_version: createData.metadata?.appVersion,
      device_info: createData.metadata?.deviceInfo,
      device_metadata: createData.metadata
    };

    const transmission = await this.create(transmissionData);

    // Devolver la transmisión con información completa
    return {
      ...transmission,
      driver_name: driver.name,
      organization_name: organization.name,
      route_name: routeName
    };
  }
}
