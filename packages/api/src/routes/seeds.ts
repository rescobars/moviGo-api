import { Router } from 'express';
import { db } from '../../../database/src/db-config';

const router: Router = Router();

// Middleware to verify API key for seeds
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

// POST /api/seeds/run - Run all seeds
router.post('/run', verifyApiKey, async (req, res) => {
  try {
    console.log('🌱 Starting seeds...');
    
    await db.seed.run();
    
    res.json({
      success: true,
      message: 'Seeds completed successfully'
    });
  } catch (error) {
    console.error('❌ Seed error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during seeding'
    });
  }
});

// POST /api/seeds/run-specific - Run specific seed file
router.post('/run-specific', verifyApiKey, async (req, res) => {
  try {
    const { seedFile } = req.body;
    
    if (!seedFile) {
      return res.status(400).json({
        success: false,
        error: 'seedFile parameter is required'
      });
    }

    console.log(`🌱 Running specific seed: ${seedFile}`);
    
    await db.seed.run({ specific: seedFile });
    
    res.json({
      success: true,
      message: `Seed ${seedFile} completed successfully`
    });
  } catch (error) {
    console.error('❌ Specific seed error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during specific seeding'
    });
  }
});

// GET /api/seeds/list - List available seed files
router.get('/list', verifyApiKey, async (req, res) => {
  try {
    // Knex doesn't have a built-in list method for seeds
    // We'll return a simple response for now
    res.json({
      success: true,
      data: ['01_users_seed.ts'],
      message: 'Available seed files'
    });
  } catch (error) {
    console.error('❌ Seed list error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error listing seeds'
    });
  }
});

export default router;
