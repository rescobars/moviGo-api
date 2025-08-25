import { Router } from 'express';
import { OrganizationMembersController } from '../controllers/organization-members.controller';

const router: Router = Router();

// Create a member (user must already exist)
router.post('/create', OrganizationMembersController.createMember);

// Create a new user and add them as a member
router.post('/create-user-and-member', OrganizationMembersController.createUserAndMember);

export default router;
