import { Router } from 'express';
import { authMiddleware } from '../../../auth/src/auth';
import { AuthController } from '../controllers/auth.controller';

const router: Router = Router();

// Public routes (no authentication required)
router.post('/passwordless/login', AuthController.requestPasswordlessLogin);
router.post('/passwordless/verify', AuthController.verifyPasswordlessToken);
router.post('/refresh', AuthController.refreshToken);

// Protected routes (authentication required)
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/profile', authMiddleware, AuthController.getProfile);

export default router;
