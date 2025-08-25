import { Knex } from 'knex';
import { OrganizationMember, CreateOrganizationMember } from '../../../types/src/schemas/organization-member';
import { MemberRole, CreateMemberRole } from '../../../types/src/schemas/member-role';
import { db } from '../db-config';

export class OrganizationMemberRepository {
  static async createMemberWithRoles(
    memberData: CreateOrganizationMember,
    roles: CreateMemberRole[]
  ): Promise<{ member: OrganizationMember; roles: MemberRole[] }> {
    return db.transaction(async (trx) => {
      // Create organization member
      const [member] = await trx('organization_members')
        .insert(memberData)
        .returning('*');

      // Create member roles
      const memberRoles = [];
      for (const roleData of roles) {
        const [role] = await trx('member_roles')
          .insert({
            ...roleData,
            organization_member_id: member.id
          })
          .returning('*');
        memberRoles.push(role);
      }

      return { member, roles: memberRoles };
    });
  }

  static async checkUserExistsInOrganization(userId: number, organizationId: number): Promise<boolean> {
    const [member] = await db('organization_members')
      .select('id')
      .where('user_id', userId)
      .where('organization_id', organizationId)
      .where('is_active', true);
    return !!member;
  }

  static async getMemberWithRoles(memberId: number): Promise<{ member: OrganizationMember; roles: MemberRole[] } | null> {
    const member = await db('organization_members')
      .where('id', memberId)
      .where('is_active', true)
      .first();

    if (!member) return null;

    const roles = await db('member_roles')
      .where('organization_member_id', memberId)
      .where('is_active', true);

    return { member, roles };
  }

  static async getUserRolesInOrganization(userId: number, organizationId: number): Promise<MemberRole[]> {
    return db('member_roles')
      .join('organization_members', 'member_roles.organization_member_id', 'organization_members.id')
      .where('organization_members.user_id', userId)
      .where('organization_members.organization_id', organizationId)
      .where('organization_members.is_active', true)
      .where('member_roles.is_active', true)
      .select('member_roles.*');
  }

  static async hasRole(userId: number, organizationId: number, roleName: string): Promise<boolean> {
    const [role] = await db('member_roles')
      .join('organization_members', 'member_roles.organization_member_id', 'organization_members.id')
      .where('organization_members.user_id', userId)
      .where('organization_members.organization_id', organizationId)
      .where('organization_members.is_active', true)
      .where('member_roles.role_name', roleName)
      .where('member_roles.is_active', true)
      .select('member_roles.id');
    
    return !!role;
  }

  static async isOwner(userId: number, organizationId: number): Promise<boolean> {
    return this.hasRole(userId, organizationId, 'OWNER');
  }

  static async isAdmin(userId: number, organizationId: number): Promise<boolean> {
    return this.hasRole(userId, organizationId, 'ADMIN');
  }

  static async getUserOrganizationsWithRoles(userId: number): Promise<Array<{
    organization: { id: number; name: string };
    roles: MemberRole[];
  }>> {
    const members = await db('organization_members')
      .join('organizations', 'organization_members.organization_id', 'organizations.id')
      .where('organization_members.user_id', userId)
      .where('organization_members.is_active', true)
      .select(
        'organizations.id as org_id',
        'organizations.name as org_name',
        'organization_members.id as member_id'
      );

    const result = [];
    for (const member of members) {
      const roles = await db('member_roles')
        .where('organization_member_id', member.member_id)
        .where('is_active', true)
        .select('*');

      result.push({
        organization: {
          id: member.org_id,
          name: member.org_name
        },
        roles
      });
    }

    return result;
  }

  static async getUserOrganizationsWithFullDetails(userId: number): Promise<Array<{
    organization: {
      id: number;
      uuid: string;
      name: string;
      slug: string;
      description?: string;
      domain?: string;
      logo_url?: string;
      website_url?: string;
      contact_email?: string;
      contact_phone?: string;
      address?: string;
      status: string;
      plan_type: string;
      subscription_expires_at?: Date;
    };
    roles: MemberRole[];
    member_since: Date;
  }>> {
    const members = await db('organization_members')
      .join('organizations', 'organization_members.organization_id', 'organizations.id')
      .where('organization_members.user_id', userId)
      .where('organization_members.is_active', true)
      .select(
        'organizations.id as org_id',
        'organizations.uuid as org_uuid',
        'organizations.name as org_name',
        'organizations.slug as org_slug',
        'organizations.description as org_description',
        'organizations.domain as org_domain',
        'organizations.logo_url as org_logo_url',
        'organizations.website_url as org_website_url',
        'organizations.contact_email as org_contact_email',
        'organizations.contact_phone as org_contact_phone',
        'organizations.address as org_address',
        'organizations.status as org_status',
        'organizations.plan_type as org_plan_type',
        'organizations.subscription_expires_at as org_subscription_expires_at',
        'organization_members.id as member_id',
        'organization_members.created_at as member_since'
      );

    const result = [];
    for (const member of members) {
      const roles = await db('member_roles')
        .where('organization_member_id', member.member_id)
        .where('is_active', true)
        .select('*');

      result.push({
        organization: {
          id: member.org_id,
          uuid: member.org_uuid,
          name: member.org_name,
          slug: member.org_slug,
          description: member.org_description,
          domain: member.org_domain,
          logo_url: member.org_logo_url,
          website_url: member.org_website_url,
          contact_email: member.org_contact_email,
          contact_phone: member.org_contact_phone,
          address: member.org_address,
          status: member.org_status,
          plan_type: member.org_plan_type,
          subscription_expires_at: member.org_subscription_expires_at
        },
        roles,
        member_since: member.member_since
      });
    }

    return result;
  }
}
