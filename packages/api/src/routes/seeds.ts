import { Router } from 'express';
import { db } from '../../../database/src/db-config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router: Router = Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    // Read seed files dynamically from the seeds directory
    const seedsDir = path.join(__dirname, '../../../database/src/seeds');
    const seedFiles = fs.readdirSync(seedsDir)
      .filter(file => file.endsWith('.ts') && file.includes('_seed.ts'))
      .sort(); // Sort to maintain order
    
    res.json({
      success: true,
      data: seedFiles,
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
