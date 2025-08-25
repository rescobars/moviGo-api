import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { db } from './db-config';
import userRoutes from './routes/users';
import migrationRoutes from './routes/migrations';
import seedRoutes from './routes/seeds';

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



// API routes
app.use('/api/users', userRoutes);
app.use('/api/migrations', migrationRoutes);
app.use('/api/seeds', seedRoutes);

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
  console.log(`🔧 Migration endpoints: http://localhost:${PORT}/api/migrations`);
  console.log(`🌱 Seed endpoints: http://localhost:${PORT}/api/seeds`);
});
