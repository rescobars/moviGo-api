import { Request, Response } from 'express';
import { OrderRepository } from '../../../database/src/repositories/order.repository';
import { CreateOrderSchema, UpdateOrderSchema, OrderDataForInsert } from '../../../types/src/schemas/order';

export class OrdersController {
  static async getAll(req: Request, res: Response) {
    try {
      const { organization_uuid } = req.params;
      
      if (!organization_uuid) {
        return res.status(400).json({ 
          success: false, 
          error: 'organization_uuid is required' 
        });
      }

      const orders = await OrderRepository.findAll(organization_uuid);
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  static async getPending(req: Request, res: Response) {
    try {
      const { organization_uuid } = req.params;
      
      if (!organization_uuid) {
        return res.status(400).json({ 
          success: false, 
          error: 'organization_uuid is required' 
        });
      }

      const orders = await OrderRepository.findPending(organization_uuid);
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  static async getByUuid(req: Request, res: Response) {
    try {
      const { uuid } = req.params;
      
      if (!uuid) {
        return res.status(400).json({ 
          success: false, 
          error: 'Order UUID is required' 
        });
      }

      const order = await OrderRepository.findByUuid(uuid);
      
      if (!order) {
        return res.status(404).json({ 
          success: false, 
          error: 'Order not found' 
        });
      }

      res.json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const validatedData = CreateOrderSchema.parse(req.body);
      
      // Create intermediate data for database insertion
      const orderData: Partial<OrderDataForInsert> = {
        description: validatedData.description,
        total_amount: validatedData.total_amount,
        pickup_address: validatedData.pickup_address,
        delivery_address: validatedData.delivery_address,
        pickup_lat: validatedData.pickup_lat,
        pickup_lng: validatedData.pickup_lng,
        delivery_lat: validatedData.delivery_lat,
        delivery_lng: validatedData.delivery_lng,
        order_number: validatedData.order_number
      };

      // Convert organization_uuid to organization_id
      if (validatedData.organization_uuid) {
        const organizationId = await OrderRepository.getOrganizationIdFromUuid(validatedData.organization_uuid);
        if (!organizationId) {
          return res.status(400).json({
            success: false,
            error: 'Invalid organization UUID'
          });
        }
        orderData.organization_id = organizationId;
      }

      // Convert user_uuid to user_id if provided
      if (validatedData.user_uuid) {
        const userId = await OrderRepository.getUserIdFromUuid(validatedData.user_uuid);
        if (!userId) {
          return res.status(400).json({
            success: false,
            error: 'Invalid user UUID'
          });
        }
        orderData.user_id = userId;
      }

      // Generate order number automatically if not provided
      if (!orderData.order_number) {
        orderData.order_number = await OrderRepository.generateOrderNumber(orderData.organization_id!);
      }

      const order = await OrderRepository.create(orderData as OrderDataForInsert);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      if (error instanceof Error && error.message.includes('validation')) {
        res.status(400).json({ 
          success: false, 
          error: error.message 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { uuid } = req.params;
      
      if (!uuid) {
        return res.status(400).json({ 
          success: false, 
          error: 'Order UUID is required' 
        });
      }

      const validatedData = UpdateOrderSchema.parse(req.body);
      const order = await OrderRepository.updateByUuid(uuid, validatedData);
      
      if (!order) {
        return res.status(404).json({ 
          success: false, 
          error: 'Order not found' 
        });
      }

      res.json({ success: true, data: order });
    } catch (error) {
      if (error instanceof Error && error.message.includes('validation')) {
        res.status(400).json({ 
          success: false, 
          error: error.message 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { uuid } = req.params;
      
      if (!uuid) {
        return res.status(400).json({ 
          success: false, 
          error: 'Order UUID is required' 
        });
      }

      const deleted = await OrderRepository.deleteByUuid(uuid);
      
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          error: 'Order not found' 
        });
      }

      res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  static async bulkCreate(req: Request, res: Response) {
    try {
      const { orders } = req.body;
      
      if (!Array.isArray(orders) || orders.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'orders array is required and must not be empty' 
        });
      }

      // Validate and convert UUIDs to IDs for each order
      const validatedOrders: OrderDataForInsert[] = [];
      for (const order of orders) {
        const validatedOrder = CreateOrderSchema.parse(order);
        
        // Create intermediate data for database insertion
        const orderData: Partial<OrderDataForInsert> = {
          description: validatedOrder.description,
          total_amount: validatedOrder.total_amount,
          pickup_address: validatedOrder.pickup_address,
          delivery_address: validatedOrder.delivery_address,
          pickup_lat: validatedOrder.pickup_lat,
          pickup_lng: validatedOrder.pickup_lng,
          delivery_lat: validatedOrder.delivery_lat,
          delivery_lng: validatedOrder.delivery_lng,
          order_number: validatedOrder.order_number
        };

        // Convert organization_uuid to organization_id
        if (validatedOrder.organization_uuid) {
          const organizationId = await OrderRepository.getOrganizationIdFromUuid(validatedOrder.organization_uuid);
          if (!organizationId) {
            return res.status(400).json({
              success: false,
              error: 'Invalid organization UUID'
            });
          }
          orderData.organization_id = organizationId;
        }

        // Convert user_uuid to user_id if provided
        if (validatedOrder.user_uuid) {
          const userId = await OrderRepository.getUserIdFromUuid(validatedOrder.user_uuid);
          if (!userId) {
            return res.status(400).json({
              success: false,
              error: 'Invalid user UUID'
            });
          }
          orderData.user_id = userId;
        }

        // Generate order number automatically if not provided
        if (!orderData.order_number) {
          orderData.order_number = await OrderRepository.generateOrderNumber(orderData.organization_id!);
        }
        
        validatedOrders.push(orderData as OrderDataForInsert);
      }

      const createdOrders = await OrderRepository.bulkCreate(validatedOrders);
      res.status(201).json({ success: true, data: createdOrders });
    } catch (error) {
      if (error instanceof Error && error.message.includes('validation')) {
        res.status(400).json({ 
          success: false, 
          error: error.message 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
  }
}
