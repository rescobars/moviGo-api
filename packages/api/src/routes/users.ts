import { Router } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../../../auth/src/auth';
import { db } from '../../../database/src/db-config';

const router: Router = Router();

// GET /api/users - Get all users (protected)
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const users = await db('users')
      .select('id', 'email', 'name', 'is_active', 'created_at', 'updated_at')
      .where('is_active', true);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// GET /api/users/:id - Get user by ID (protected)
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    
    const user = await db('users')
      .select('id', 'email', 'name', 'is_active', 'created_at', 'updated_at')
      .where({ id, is_active: true })
      .first();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

export default router;
