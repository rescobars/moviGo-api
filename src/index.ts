import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { db } from './db-config';
import userRoutes from './routes/users';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8081'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Add knex to request object
app.use((req, res, next) => {
  (req as any).knex = db;
  next();
});

// Health check (public)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Secret endpoints for migrations and seeds
const SECRET_PASSWORD = process.env.SECRET_PASSWORD || 'movigo-secret-2024';

// Middleware to verify secret password
const verifySecretPassword = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const password = req.body.password || req.query.password;

  if (!password) {
    return res.status(401).json({
      success: false,
      error: 'Password required'
    });
  }

  if (password !== SECRET_PASSWORD) {
    return res.status(403).json({
      success: false,
      error: 'Invalid password'
    });
  }

  next();
};

// POST /secret/run-migrations - Run all pending migrations
app.post('/secret/run-migrations', verifySecretPassword, async (req, res) => {
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

// GET /secret/migration-status - Check migration status
app.get('/secret/migration-status', verifySecretPassword, async (req, res) => {
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

// POST /secret/run-seeds - Run all seeds
app.post('/secret/run-seeds', verifySecretPassword, async (req, res) => {
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

// API routes
app.use('/api/users', userRoutes);

// Basic API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'moviGo API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 moviGo API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Migration endpoints available with secret password`);
});
