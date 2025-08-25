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
}
