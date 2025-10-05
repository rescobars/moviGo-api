import { z } from 'zod';

export const OrderStatusSchema = z.enum(['PENDING', 'ASSIGNED', 'IN_ROUTE', 'COMPLETED', 'CANCELLED']);

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
  total_amount: z.number().positive().nullable(),
  status: OrderStatusSchema,
  pickup_address: z.string().nullable(),
  delivery_address: z.string(),
  pickup_lat: z.number().nullable(),
  pickup_lng: z.number().nullable(),
  delivery_lat: z.number().nullable(),
  delivery_lng: z.number().nullable(),
  details: z.any().nullable(),
  created_at: z.date(),
  updated_at: z.date()
});

export const CreateOrderSchema = z.object({
  organization_uuid: z.string().uuid(),
  user_uuid: z.string().uuid().optional(),
  order_number: z.string().min(1).optional(),
  description: z.string().optional(),
  total_amount: z.union([z.number().positive(), z.string()]).optional().transform((val) => amountTransform(val)),
  pickup_address: z.string().optional(),
  delivery_address: z.string().min(1),
  pickup_lat: z.union([z.number(), z.string()]).optional().transform(coordinateTransform),
  pickup_lng: z.union([z.number(), z.string()]).optional().transform(coordinateTransform),
  delivery_lat: z.union([z.number(), z.string()]).optional().transform(coordinateTransform),
  delivery_lng: z.union([z.number(), z.string()]).optional().transform(coordinateTransform),
  details: z.any().optional()
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
  delivery_lng: z.union([z.number(), z.string()]).optional().transform(coordinateTransform),
  details: z.any().optional()
});

// Type for intermediate data structure used in controller
export const OrderDataForInsertSchema = z.object({
  organization_id: z.number().int().positive(),
  user_id: z.number().int().positive().optional(),
  order_number: z.string().optional(),
  description: z.string().optional(),
  total_amount: z.number().positive().optional(),
  pickup_address: z.string().optional(),
  delivery_address: z.string(),
  pickup_lat: z.number().optional(),
  pickup_lng: z.number().optional(),
  delivery_lat: z.number().optional(),
  delivery_lng: z.number().optional(),
  details: z.any().optional()
});

// Schema para validar filtros de pedidos
export const OrderFiltersSchema = z.object({
  status: z.union([
    z.enum(['PENDING', 'ASSIGNED', 'IN_ROUTE', 'COMPLETED', 'CANCELLED']),
    z.array(z.enum(['PENDING', 'ASSIGNED', 'IN_ROUTE', 'COMPLETED', 'CANCELLED'])),
    z.literal('all') // Permitir 'all' pero lo convertiremos a undefined
  ]).optional().transform((val) => {
    if (val === 'all') return undefined;
    return val;
  }),
  search: z.string().optional(),
  created_after: z.string().datetime().optional(),
  created_before: z.string().datetime().optional(),
  updated_after: z.string().datetime().optional(),
  updated_before: z.string().datetime().optional(),
  min_amount: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }),
  max_amount: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }),
  pickup_lat: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }),
  pickup_lon: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }),
  delivery_lat: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }),
  delivery_lon: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }),
  radius: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }),
  page: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val);
      return isNaN(num) ? 1 : Math.max(1, num);
    }
    return val || 1;
  }),
  limit: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val);
      return isNaN(num) ? 10 : Math.max(1, Math.min(100, num)); // Máximo 100 elementos
    }
    return val || 10;
  }),
  sort_by: z.enum(['created_at', 'updated_at', 'total_amount', 'order_number', 'status']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional()
});

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;
export type OrderDataForInsert = z.infer<typeof OrderDataForInsertSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type OrderFilters = z.infer<typeof OrderFiltersSchema>;
