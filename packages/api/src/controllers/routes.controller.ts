import { Request, Response } from 'express';
import { RouteRepository } from '../../../database/src/repositories/route.repository';
import { RouteWaypointRepository } from '../../../database/src/repositories/route-waypoint.repository';
import { RouteOrderRepository } from '../../../database/src/repositories/route-order.repository';
import { OrganizationRepository } from '../../../database/src/repositories/organization.repository';
import { OrderRepository } from '../../../database/src/repositories/order.repository';
import { db } from '../../../database/src/db-config';
import { CreateCompleteRouteSchema } from '../../../types/src/schemas/route';
import { z } from 'zod';

export class RoutesController {

  async createRoute(req: Request, res: Response): Promise<void> {
    try {
      // Validar el body de la request
      const validatedData = CreateCompleteRouteSchema.parse(req.body);

      // Buscar la organización por UUID
      const organization = await OrganizationRepository.findByUuid(validatedData.organization_uuid);
      if (!organization) {
        res.status(404).json({ error: 'Organization not found' });
        return;
      }

      // Usar transacción para crear la ruta completa
      const result = await db.transaction(async (trx) => {
        // Crear la ruta principal
        const routeData = {
          organization_id: organization.id,
          name: validatedData.name,
          description: validatedData.description,
          type: validatedData.type,
          planned_start_time: validatedData.planned_start_time ? new Date(validatedData.planned_start_time) : null,
          planned_end_time: validatedData.planned_end_time ? new Date(validatedData.planned_end_time) : null,
          total_distance_km: validatedData.total_distance_km,
          estimated_duration_minutes: validatedData.estimated_duration_minutes,
          total_orders: validatedData.orders.length
        };

        const route = await RouteRepository.create(routeData);

        // Crear los waypoints
        const waypointsData = validatedData.waypoints.map(waypoint => ({
          route_id: route.id,
          sequence_order: waypoint.sequence_order,
          waypoint_type: waypoint.waypoint_type,
          address: waypoint.address,
          latitude: waypoint.latitude,
          longitude: waypoint.longitude,
          instructions: waypoint.instructions,
          contact_name: waypoint.contact_name,
          contact_phone: waypoint.contact_phone,
          estimated_arrival_time: waypoint.estimated_arrival_time ? new Date(waypoint.estimated_arrival_time) : null
        }));

        const waypoints = await RouteWaypointRepository.createMany(waypointsData);

        // Crear los route-orders si hay orders
        let routeOrders: any[] = [];
        if (validatedData.orders.length > 0) {
          // Buscar los IDs de los orders por UUID
          const orderUuids = validatedData.orders.map(ro => ro.order_uuid);
          const orders = await OrderRepository.findByUuids(orderUuids);
          
          if (orders.length !== orderUuids.length) {
            throw new Error('Some orders not found');
          }

          // Crear un mapa de UUID a ID para orders y waypoints
          const orderUuidToId = new Map(orders.map(order => [order.uuid, order.id]));
          const waypointUuidToId = new Map(waypoints.map(waypoint => [waypoint.uuid, waypoint.id]));

          const routeOrdersData = validatedData.orders.map(routeOrder => {
            const orderId = orderUuidToId.get(routeOrder.order_uuid);
            if (!orderId) {
              throw new Error(`Order with UUID ${routeOrder.order_uuid} not found`);
            }

            let pickupWaypointId: number | undefined;
            let deliveryWaypointId: number | undefined;

            if (routeOrder.pickup_waypoint_uuid) {
              pickupWaypointId = waypointUuidToId.get(routeOrder.pickup_waypoint_uuid);
              if (!pickupWaypointId) {
                throw new Error(`Pickup waypoint with UUID ${routeOrder.pickup_waypoint_uuid} not found`);
              }
            }

            if (routeOrder.delivery_waypoint_uuid) {
              deliveryWaypointId = waypointUuidToId.get(routeOrder.delivery_waypoint_uuid);
              if (!deliveryWaypointId) {
                throw new Error(`Delivery waypoint with UUID ${routeOrder.delivery_waypoint_uuid} not found`);
              }
            }

            return {
              route_id: route.id,
              order_id: orderId,
              sequence_order: routeOrder.sequence_order,
              pickup_waypoint_id: pickupWaypointId,
              delivery_waypoint_id: deliveryWaypointId,
              status: routeOrder.status,
              estimated_pickup_time: routeOrder.estimated_pickup_time ? new Date(routeOrder.estimated_pickup_time) : null,
              estimated_delivery_time: routeOrder.estimated_delivery_time ? new Date(routeOrder.estimated_delivery_time) : null
            };
          });

          routeOrders = await RouteOrderRepository.createMany(routeOrdersData);
        }

        return {
          route,
          waypoints,
          routeOrders
        };
      });

      res.status(201).json({
        message: 'Route created successfully',
        data: {
          route: result.route,
          waypoints: result.waypoints,
          routeOrders: result.routeOrders
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
        return;
      }

      console.error('Error creating route:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteRoute(req: Request, res: Response): Promise<void> {
    try {
      const { uuid } = req.params;

      if (!uuid) {
        res.status(400).json({ error: 'Route UUID is required' });
        return;
      }

      // Usar transacción para eliminar la ruta completa
      const deleted = await db.transaction(async (trx) => {
        // Buscar la ruta por UUID
        const route = await RouteRepository.findByUuid(uuid);
        if (!route) {
          return false;
        }

        // Eliminar route-orders primero (por las foreign keys)
        await RouteOrderRepository.deleteByRouteId(route.id);
        
        // Eliminar waypoints
        await RouteWaypointRepository.deleteByRouteId(route.id);
        
        // Finalmente eliminar la ruta
        return await RouteRepository.delete(route.id);
      });

      if (!deleted) {
        res.status(404).json({ error: 'Route not found' });
        return;
      }

      res.status(200).json({ 
        message: 'Route deleted successfully' 
      });
    } catch (error) {
      console.error('Error deleting route:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
