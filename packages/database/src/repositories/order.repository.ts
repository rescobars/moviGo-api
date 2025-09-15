import { db } from '../db-config';
import { Order, CreateOrder, UpdateOrder, OrderDataForInsert } from '../../../types/src/schemas/order';

export class OrderRepository {
  static async findAll(organizationUuid: string): Promise<Order[]> {
    return db('orders')
      .join('organizations', 'orders.organization_id', 'organizations.id')
      .select('orders.*')
      .where('organizations.uuid', organizationUuid)
      .orderBy('orders.created_at', 'desc');
  }

  static async findAllWithPagination(organizationUuid: string, filters?: any): Promise<{ orders: Order[], pagination: any }> {
    console.log('🔍 OrderRepository - Applying filters:', filters);
    
    // Get organization ID first
    const organization = await db('organizations')
      .select('id')
      .where('uuid', organizationUuid)
      .first();
    
    if (!organization) {
      throw new Error(`Organization with UUID ${organizationUuid} not found`);
    }

    // Build base query for counting
    let countQuery = db('orders').where('organization_id', organization.id);
    let dataQuery = db('orders').where('organization_id', organization.id);

    // Apply filters to both queries
    if (filters) {
      // Status filter
      if (filters.status) {
        const statusArray = Array.isArray(filters.status) ? filters.status : [filters.status];
        countQuery = countQuery.whereIn('status', statusArray);
        dataQuery = dataQuery.whereIn('status', statusArray);
      }

      // Search filter (search in order_number, description, pickup_address, delivery_address)
      if (filters.search) {
        const searchCondition = function() {
          this.where('order_number', 'ilike', `%${filters.search}%`)
            .orWhere('description', 'ilike', `%${filters.search}%`)
            .orWhere('pickup_address', 'ilike', `%${filters.search}%`)
            .orWhere('delivery_address', 'ilike', `%${filters.search}%`);
        };
        countQuery = countQuery.where(searchCondition);
        dataQuery = dataQuery.where(searchCondition);
      }

      // Date filters
      if (filters.created_after) {
        countQuery = countQuery.where('created_at', '>=', filters.created_after);
        dataQuery = dataQuery.where('created_at', '>=', filters.created_after);
      }
      if (filters.created_before) {
        countQuery = countQuery.where('created_at', '<=', filters.created_before);
        dataQuery = dataQuery.where('created_at', '<=', filters.created_before);
      }
      if (filters.updated_after) {
        countQuery = countQuery.where('updated_at', '>=', filters.updated_after);
        dataQuery = dataQuery.where('updated_at', '>=', filters.updated_after);
      }
      if (filters.updated_before) {
        countQuery = countQuery.where('updated_at', '<=', filters.updated_before);
        dataQuery = dataQuery.where('updated_at', '<=', filters.updated_before);
      }

      // Amount filters
      if (filters.min_amount) {
        countQuery = countQuery.where('total_amount', '>=', filters.min_amount);
        dataQuery = dataQuery.where('total_amount', '>=', filters.min_amount);
      }
      if (filters.max_amount) {
        countQuery = countQuery.where('total_amount', '<=', filters.max_amount);
        dataQuery = dataQuery.where('total_amount', '<=', filters.max_amount);
      }

      // Location filters (pickup location)
      if (filters.pickup_lat && filters.pickup_lon && filters.radius) {
        const lat = parseFloat(filters.pickup_lat);
        const lon = parseFloat(filters.pickup_lon);
        const radius = parseFloat(filters.radius);
        
        const locationCondition = function() {
          this.whereRaw(`
            (6371 * acos(cos(radians(?)) * cos(radians(pickup_lat)) * 
            cos(radians(pickup_lon) - radians(?)) + sin(radians(?)) * 
            sin(radians(pickup_lat)))) <= ?
          `, [lat, lon, lat, radius]);
        };
        countQuery = countQuery.where(locationCondition);
        dataQuery = dataQuery.where(locationCondition);
      }

      // Sorting
      const sortBy = filters.sort_by || 'created_at';
      const sortOrder = filters.sort_order || 'desc';
      dataQuery = dataQuery.orderBy(sortBy, sortOrder);

      // Pagination
      if (filters.limit) {
        const limit = parseInt(filters.limit);
        dataQuery = dataQuery.limit(limit);
        
        if (filters.page) {
          const page = parseInt(filters.page);
          const offset = (page - 1) * limit;
          dataQuery = dataQuery.offset(offset);
        }
      }
    } else {
      // Default sorting if no filters
      dataQuery = dataQuery.orderBy('created_at', 'desc');
    }

    // Execute both queries in parallel
    const [orders, totalResult] = await Promise.all([
      dataQuery,
      countQuery.count('* as total').first()
    ]);

    const total = parseInt(totalResult.total);
    const page = filters?.page ? parseInt(filters.page) : 1;
    const limit = filters?.limit ? parseInt(filters.limit) : total;
    const totalPages = Math.ceil(total / limit);

    const pagination = {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };

    return {
      orders,
      pagination
    };
  }

  static async findPending(organizationUuid: string): Promise<Order[]> {
    return db('orders')
      .join('organizations', 'orders.organization_id', 'organizations.id')
      .select('orders.*')
      .where('organizations.uuid', organizationUuid)
      .where('orders.status', 'PENDING')
      .orderBy('orders.created_at', 'asc');
  }

  static async findByUuid(uuid: string): Promise<Order | null> {
    const [order] = await db('orders')
      .select('*')
      .where('uuid', uuid);
    return order || null;
  }

  static async findByUuids(uuids: string[], knexInstance?: any): Promise<Order[]> {
    const query = (knexInstance || db)('orders')
      .select('*')
      .whereIn('uuid', uuids);
    return query;
  }

  static async create(orderData: OrderDataForInsert): Promise<Order> {
    const [order] = await db('orders')
      .insert({
        ...orderData,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');
    return order;
  }

  static async updateByUuid(uuid: string, orderData: UpdateOrder): Promise<Order | null> {
    const [order] = await db('orders')
      .where('uuid', uuid)
      .update({
        ...orderData,
        updated_at: new Date()
      })
      .returning('*');
    return order || null;
  }

  static async deleteByUuid(uuid: string): Promise<boolean> {
    const deleted = await db('orders')
      .where('uuid', uuid)
      .delete();
    return deleted > 0;
  }

  static async bulkCreate(orders: OrderDataForInsert[]): Promise<Order[]> {
    // Generate unique order numbers for each order
    const ordersWithTimestamps = [];
    for (const order of orders) {
      const orderNumber = await this.generateOrderNumber(order.organization_id);
      ordersWithTimestamps.push({
        ...order,
        order_number: orderNumber,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    return db('orders')
      .insert(ordersWithTimestamps)
      .returning('*');
  }

  static async generateOrderNumber(organizationId: number): Promise<string> {
    
    const orderCounter =  await db("orders")
      .where("organization_id", organizationId)
      .first("id")
      .orderBy("id", "desc")
    
    if(!orderCounter){
      return "O001"
    }
    const lastOrderNumber = orderCounter.id + 1
    
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${random}-${organizationId}-${lastOrderNumber}`;
  }

  // Helper method to get organization ID from UUID
  static async getOrganizationIdFromUuid(organizationUuid: string): Promise<number | null> {
    const [org] = await db('organizations')
      .select('id')
      .where('uuid', organizationUuid);
    return org?.id || null;
  }

  // Helper method to get user ID from UUID
  static async getUserIdFromUuid(userUuid: string): Promise<number | null> {
    const [user] = await db('users')
      .select('id')
      .where('uuid', userUuid);
    return user?.id || null;
  }
}
