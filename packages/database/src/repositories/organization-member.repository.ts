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
}
