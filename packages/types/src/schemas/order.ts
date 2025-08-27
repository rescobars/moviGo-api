import { z } from 'zod';

export const OrderStatusSchema = z.enum(['PENDING', 'ASSIGNED', 'COMPLETED', 'CANCELLED']);

// Helper functions to reduce code duplication
const coordinateTransform = (val: string | number | undefined) => {
  if (typeof val === 'string') {
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  }
  return val;
};

const amountTransform = (val: string | number | undefined) => {
  if (typeof val === 'string') {
    const num = parseFloat(val);
    return isNaN(num) ? undefined : num;
  }
  return val;
};

const amountTransformWithDefault = (val: string | number | undefined, defaultValue: number = 0) => {
  if (typeof val === 'string') {
    const num = parseFloat(val);
    return isNaN(num) ? defaultValue : num;
  }
  return val;
};

export const OrderSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  organization_id: z.number().int().positive(),
  user_id: z.number().int().positive().nullable(),
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
  organization_uuid: z.string().uuid(),
  user_uuid: z.string().uuid().optional(),
  order_number: z.string().min(1).optional(),
  description: z.string().optional(),
  total_amount: z.union([z.number().positive(), z.string()]).default(0).transform((val) => amountTransformWithDefault(val, 0)),
  pickup_address: z.string().min(1),
  delivery_address: z.string().min(1),
  pickup_lat: z.union([z.number(), z.string()]).optional().transform(coordinateTransform),
  pickup_lng: z.union([z.number(), z.string()]).optional().transform(coordinateTransform),
  delivery_lat: z.union([z.number(), z.string()]).optional().transform(coordinateTransform),
  delivery_lng: z.union([z.number(), z.string()]).optional().transform(coordinateTransform)
});

export const UpdateOrderSchema = z.object({
  description: z.string().optional(),
  total_amount: z.union([z.number().positive(), z.string()]).optional().transform(amountTransform),
  status: OrderStatusSchema.optional(),
  pickup_address: z.string().min(1).optional(),
  delivery_address: z.string().min(1).optional(),
  pickup_lat: z.union([z.number(), z.string()]).optional().transform(coordinateTransform),
  pickup_lng: z.union([z.number(), z.string()]).optional().transform(coordinateTransform),
  delivery_lat: z.union([z.number(), z.string()]).optional().transform(coordinateTransform),
  delivery_lng: z.union([z.number(), z.string()]).optional().transform(coordinateTransform)
});

// Type for intermediate data structure used in controller
export const OrderDataForInsertSchema = z.object({
  organization_id: z.number().int().positive(),
  user_id: z.number().int().positive().optional(),
  order_number: z.string().optional(),
  description: z.string().optional(),
  total_amount: z.number().positive(),
  pickup_address: z.string(),
  delivery_address: z.string(),
  pickup_lat: z.number().optional(),
  pickup_lng: z.number().optional(),
  delivery_lat: z.number().optional(),
  delivery_lng: z.number().optional()
});

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;
export type OrderDataForInsert = z.infer<typeof OrderDataForInsertSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
