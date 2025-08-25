import { Router } from 'express';
import { authMiddleware } from '../../../auth/src/auth';
import { UserController } from '../controllers/users.controller';

const router: Router = Router();

// Public routes (no authentication required)
router.post('/login', UserController.login);
router.post('/register', UserController.create);

// Protected routes (authentication required)
router.get('/', authMiddleware, UserController.getAll);
router.get('/:id', authMiddleware, UserController.getById);
router.get('/uuid/:uuid', authMiddleware, UserController.getByUuid);
router.put('/:id', authMiddleware, UserController.update);
router.delete('/:id', authMiddleware, UserController.delete);
router.patch('/:id/status', authMiddleware, UserController.updateStatus);

export default router;
