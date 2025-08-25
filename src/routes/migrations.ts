import { Router } from 'express';
import { db } from '../db-config';

const router: Router = Router();

// Middleware to verify API key for migrations
const verifyApiKey = (req: any, res: any, next: any) => {
  const apiKey = req.headers['x-api-key'] || req.headers['api-key'] || req.query.apiKey;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required'
    });
  }

  const expectedApiKey = process.env.API_KEY_MIGRATIONS;
  
  if (!expectedApiKey) {
    return res.status(500).json({
      success: false,
      error: 'API key not configured on server'
    });
  }

  if (apiKey !== expectedApiKey) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API key'
    });
  }

  next();
};

// POST /api/migrations/run - Run all pending migrations
router.post('/run', verifyApiKey, async (req, res) => {
  try {
    console.log('🔄 Starting migrations...');
    
    await db.migrate.latest();
    const status = await db.migrate.status();
    
    res.json({
      success: true,
      message: 'Migrations completed successfully',
      status
    });
  } catch (error) {
    console.error('❌ Migration error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during migration'
    });
  }
});

// GET /api/migrations/status - Check migration status
router.get('/status', verifyApiKey, async (req, res) => {
  try {
    const status = await db.migrate.status();
    
    res.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('❌ Migration status error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error checking migration status'
    });
  }
});

// POST /api/migrations/rollback - Rollback last migration
router.post('/rollback', verifyApiKey, async (req, res) => {
  try {
    console.log('🔄 Rolling back last migration...');
    
    await db.migrate.rollback();
    const status = await db.migrate.status();
    
    res.json({
      success: true,
      message: 'Migration rollback completed successfully',
      status
    });
  } catch (error) {
    console.error('❌ Migration rollback error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during migration rollback'
    });
  }
});

// POST /api/migrations/rollback-all - Rollback all migrations
router.post('/rollback-all', verifyApiKey, async (req, res) => {
  try {
    console.log('🔄 Rolling back all migrations...');
    
    await db.migrate.rollback(undefined, true); // true = rollback all
    const status = await db.migrate.status();
    
    res.json({
      success: true,
      message: 'All migrations rolled back successfully',
      status
    });
  } catch (error) {
    console.error('❌ Migration rollback all error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during migration rollback'
    });
  }
});

export default router;
