import { Request, Response } from 'express';
import { OrderRepository } from '../../../database/src/repositories/order.repository';
import { CreateOrderSchema, UpdateOrderSchema } from '../../../types/src/schemas/order';

export class OrdersController {
  static async getAll(req: Request, res: Response) {
    try {
      const { organization_id } = req.params;
      
      if (!organization_id) {
        return res.status(400).json({ 
          success: false, 
          error: 'organization_id is required' 
        });
      }

      const orders = await OrderRepository.findAll(organization_id);
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
      const { organization_id } = req.params;
      
      if (!organization_id) {
        return res.status(400).json({ 
          success: false, 
          error: 'organization_id is required' 
        });
      }

      const orders = await OrderRepository.findPending(organization_id);
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'Order ID is required' 
        });
      }

      const order = await OrderRepository.findById(id);
      
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
      
      // Generar número de pedido automáticamente si no se proporciona
      if (!validatedData.order_number) {
        validatedData.order_number = await OrderRepository.generateOrderNumber(validatedData.organization_id);
      }

      const order = await OrderRepository.create(validatedData);
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
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'Order ID is required' 
        });
      }

      const validatedData = UpdateOrderSchema.parse(req.body);
      const order = await OrderRepository.update(id, validatedData);
      
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
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'Order ID is required' 
        });
      }

      const deleted = await OrderRepository.delete(id);
      
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

      // Validar cada pedido
      const validatedOrders = [];
      for (const order of orders) {
        const validatedOrder = CreateOrderSchema.parse(order);
        
        // Generar número de pedido automáticamente si no se proporciona
        if (!validatedOrder.order_number) {
          validatedOrder.order_number = await OrderRepository.generateOrderNumber(validatedOrder.organization_id);
        }
        
        validatedOrders.push(validatedOrder);
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
