import { z } from 'zod';

export const OrderStatusSchema = z.enum(['PENDING', 'ASSIGNED', 'COMPLETED', 'CANCELLED']);

export const OrderSchema = z.object({
  id: z.string().uuid(),
  uuid: z.string().uuid(),
  organization_id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  order_number: z.string(),
  description: z.string().nullable(),
  total_amount: z.number().positive(),
  status: OrderStatusSchema,
  pickup_address: z.string(),
  delivery_address: z.string(),
  pickup_lat: z.number().nullable(),
  pickup_lng: z.number().nullable(),
  delivery_lat: z.number().nullable(),
  delivery_lng: z.number().nullable(),
  created_at: z.date(),
  updated_at: z.date()
});

export const CreateOrderSchema = z.object({
  organization_id: z.string().uuid(),
  user_id: z.string().uuid().optional(),
  order_number: z.string().min(1),
  description: z.string().optional(),
  total_amount: z.number().positive().default(0),
  pickup_address: z.string().min(1),
  delivery_address: z.string().min(1),
  pickup_lat: z.number().optional(),
  pickup_lng: z.number().optional(),
  delivery_lat: z.number().optional(),
  delivery_lng: z.number().optional()
});

export const UpdateOrderSchema = z.object({
  description: z.string().optional(),
  total_amount: z.number().positive().optional(),
  status: OrderStatusSchema.optional(),
  pickup_address: z.string().min(1).optional(),
  delivery_address: z.string().min(1).optional(),
  pickup_lat: z.number().optional(),
  pickup_lng: z.number().optional(),
  delivery_lat: z.number().optional(),
  delivery_lng: z.number().optional()
});

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
