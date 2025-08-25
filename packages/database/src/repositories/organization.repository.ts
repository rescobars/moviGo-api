import { Organization, CreateOrganization, UpdateOrganization } from '../../../types/src/schemas/organization';
import { db } from '../db-config';

export class OrganizationRepository {

  static async findAll(filters: any = {}): Promise<Organization[]> {
    let query = db('organizations')
      .select('*')
      .where('is_active', true);

    // Apply filters
    if (filters.status) {
      query = query.where('status', filters.status);
    }
    if (filters.plan_type) {
      query = query.where('plan_type', filters.plan_type);
    }

    return query.orderBy('created_at', 'desc');
  }

  static async findByUuid(uuid: string): Promise<Organization | null> {
    const organization = await db('organizations')
      .select('*')
      .where({ uuid, is_active: true })
      .first();
    
    return organization || null;
  }

  static async findBySlug(slug: string): Promise<Organization | null> {
    const organization = await db('organizations')
      .select('*')
      .where({ slug, is_active: true })
      .first();
    
    return organization || null;
  }

  static async create(organizationData: CreateOrganization): Promise<Organization> {
    const [organization] = await db('organizations')
      .insert(organizationData)
      .returning('*');
    
    return organization;
  }

  static async update(uuid: string, updateData: UpdateOrganization): Promise<Organization> {
    const [organization] = await db('organizations')
      .where({ uuid, is_active: true })
      .update({
        ...updateData,
        updated_at: db.fn.now()
      })
      .returning('*');
    
    return organization;
  }

  static async updateStatus(uuid: string, status: string): Promise<Organization> {
    const [organization] = await db('organizations')
      .where({ uuid, is_active: true })
      .update({
        status,
        updated_at: db.fn.now()
      })
      .returning('*');
    
    return organization;
  }

  static async delete(uuid: string): Promise<void> {
    await db('organizations')
      .where({ uuid })
      .update({
        is_active: false,
        updated_at: db.fn.now()
      });
  }

  static async getMemberCount(uuid: string): Promise<number> {
    const result = await db('organization_members')
      .join('organizations', 'organization_members.organization_id', 'organizations.id')
      .where('organizations.uuid', uuid)
      .where('organization_members.is_active', true)
      .count('* as count')
      .first();
    
    return parseInt(result?.count as string) || 0;
  }

  static async getById(id: number): Promise<Organization | null> {
    const organization = await db('organizations')
      .select('*')
      .where({ id, is_active: true })
      .first();
    
    return organization || null;
  }

  static async getActiveOrganizations(): Promise<Organization[]> {
    return db('organizations')
      .select('*')
      .where({ status: 'ACTIVE', is_active: true })
      .orderBy('created_at', 'desc');
  }

  static async getOrganizationsByPlanType(planType: string): Promise<Organization[]> {
    return db('organizations')
      .select('*')
      .where({ plan_type: planType, is_active: true })
      .orderBy('created_at', 'desc');
  }
}
