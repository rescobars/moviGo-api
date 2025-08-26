import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { OrganizationMemberRepository, UserRepository, AuthTokenRepository } from '../../../database/src/repositories/index';
import { CreateOrganizationMemberSchema } from '../../../types/src/schemas/organization-member';
import { CreateMemberRoleSchema } from '../../../types/src/schemas/member-role';
import { CreatePasswordlessUserSchema } from '../../../types/src/schemas/user';
import { EmailService } from '../services/email.service';

export class OrganizationMembersController {
  static async createMember(req: Request, res: Response) {
    try {
      // TODO: Add authentication middleware to check if user is ADMIN
      // For now, we'll assume the user has permission
      
      const validatedData = CreateOrganizationMemberSchema.parse(req.body);
      const { roles = [] } = req.body;

      // Validate roles if provided (without organization_member_id since it doesn't exist yet)
      if (roles.length > 0) {
        for (const role of roles) {
          // Create a temporary schema without organization_member_id for validation
          const tempRoleSchema = CreateMemberRoleSchema.omit({ organization_member_id: true });
          tempRoleSchema.parse(role);
        }
      }

      // Check if user already exists in organization
      const userExists = await OrganizationMemberRepository.checkUserExistsInOrganization(
        validatedData.user_id, 
        validatedData.organization_id
      );

      if (userExists) {
        return res.status(400).json({ 
          success: false, 
          error: 'User is already a member of this organization' 
        });
      }

      // Create member with roles using transaction
      const result = await OrganizationMemberRepository.createMemberWithRoles(validatedData, roles);

      res.status(201).json({ 
        success: true, 
        data: result,
        message: 'Member created successfully' 
      });
    } catch (error: any) {
      console.error('❌ Error creating member:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async createUserAndMember(req: Request, res: Response) {
    try {
      // TODO: Add authentication middleware to check if user is ADMIN
      // For now, we'll assume the user has permission
      
      const { 
        organization_id, 
        email, 
        name, 
        title, 
        roles = [], 
        inviterName = 'Admin'
      } = req.body;

      // Validate required fields
      if (!organization_id || !email || !name) {
        return res.status(400).json({ 
          success: false, 
          error: 'organization_id, email, and name are required' 
        });
      }

      // Validate roles if provided (without organization_member_id since it doesn't exist yet)
      if (roles.length > 0) {
        for (const role of roles) {
          // Create a temporary schema without organization_member_id for validation
          const tempRoleSchema = CreateMemberRoleSchema.omit({ organization_member_id: true });
          tempRoleSchema.parse(role);
        }
      }

      // Check if user already exists
      const existingUser = await UserRepository.findByEmail(email);
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          error: 'User with this email already exists' 
        });
      }

      // Generate a random password for the new user
      const randomPassword = Math.random().toString(36).slice(-8);
      const passwordHash = await bcrypt.hash(randomPassword, 10);

      // Create user
      const userData = {
        email,
        name,
        password_hash: passwordHash,
        status: 'ACTIVE' as const,
        is_active: true
      };

      const newUser = await UserRepository.create(userData);

      // Get organization details for email
      // TODO: Add OrganizationRepository to get organization name
      const organizationName = 'Organization'; // Placeholder

      // Create member with roles using transaction
      const memberData = {
        organization_id,
        user_id: newUser.id,
        title,
        status: 'PENDING' as const
      };

      const result = await OrganizationMemberRepository.createMemberWithRoles(memberData, roles);

      // Send invitation email
      const invitationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/organizations/join?memberId=${result.member.uuid}`;
      const roleNames = roles.map((role: any) => role.role_name);
      
      const emailSent = await EmailService.sendOrganizationInvitation(
        email,
        organizationName,
        inviterName,
        roleNames,
        invitationUrl
      );

      res.status(201).json({ 
        success: true, 
        data: {
          user: newUser,
          member: result.member,
          roles: result.roles,
          emailSent,
          temporaryPassword: randomPassword // Only for development, remove in production
        },
        message: 'User created and invited successfully' 
      });
    } catch (error: any) {
      console.error('❌ Error creating user and member:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async publicCreateWithVerification(req: Request, res: Response) {
    try {
      const { 
        organization_uuid, 
        email, 
        name, 
        title
      } = req.body;

      // Validate required fields
      if (!organization_uuid || !email || !name) {
        return res.status(400).json({ 
          success: false, 
          error: 'organization_uuid, email, and name are required' 
        });
      }

      // Force DRIVER role for public registration
      const roles = [{
        role_name: 'DRIVER',
        description: 'Conductor de la organización'
      }];

      // Check if user already exists
      const existingUser = await UserRepository.findByEmail(email);
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          error: 'User with this email already exists' 
        });
      }

      // Get organization by UUID
      const organization = await OrganizationMemberRepository.getOrganizationByUuid(organization_uuid);
      if (!organization) {
        return res.status(404).json({ 
          success: false, 
          error: 'Organization not found' 
        });
      }

      // Validate user data
      const validatedUserData = CreatePasswordlessUserSchema.parse({
        email,
        name,
        status: 'INACTIVE'
      });

      // Create user and member with roles using transaction
      const result = await OrganizationMemberRepository.createUserAndMemberWithTransaction({
        organization_id: organization.id,
        userData: {
          ...validatedUserData,
          password_hash: null, // Passwordless login
          is_active: true
        },
        memberData: {
          title,
          status: 'INACTIVE' as const
        },
        roles
      });

      // Generate verification code and save to database
      const verificationCode = Math.random().toString().slice(2, 8); // 6-digit code
      
      // Save verification code to auth_tokens table
      await AuthTokenRepository.create({
        user_id: result.user.id,
        type: 'EMAIL_VERIFICATION',
        token: verificationCode, // Use verification code as token
        verification_code: verificationCode,
        expires_at: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      });

      // Send verification email
      const emailSent = await EmailService.sendEmailVerification(
        email,
        name,
        verificationCode
      );

      res.status(201).json({ 
        success: true, 
        data: {
          user: result.user,
          member: result.member,
          roles: result.roles,
          emailSent
        },
        message: 'Member created successfully. Please check your email for verification code.' 
      });
    } catch (error: any) {
      console.error('❌ Error creating member with verification:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
