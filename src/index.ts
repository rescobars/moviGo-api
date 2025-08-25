import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { db } from '../packages/database/src/db-config';
import { userRoutes, authRoutes, migrationRoutes, seedRoutes, organizationMemberRoutes, organizationRoutes } from '../packages/api/src/routes';
import { UserRepository } from '../packages/database/src/repositories/user-repository';
import { AuthTokenRepository } from '../packages/database/src/repositories/auth-token.repository';
import { specs } from '../packages/api/src/config/swagger';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8081', "https://manos-web-app-ae845d78f7b1.herokuapp.com"],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Add knex to request object
app.use((req, res, next) => {
  (req as any).knex = db;
  next();
});

// Database connection is handled directly in repositories

// Health check (public)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});



// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/migrations', migrationRoutes);
app.use('/api/seeds', seedRoutes);
app.use('/api/organization-members', organizationMemberRoutes);
app.use('/api/organizations', organizationRoutes);

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
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🔧 Migration endpoints: http://localhost:${PORT}/api/migrations`);
  console.log(`🌱 Seed endpoints: http://localhost:${PORT}/api/seeds`);
});
