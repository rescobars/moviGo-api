import { Knex } from 'knex';

// Extend Express Request to include knex
declare global {
  namespace Express {
    interface Request {
      knex?: Knex;
    }
  }
}

// Basic API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Database table types
export interface DatabaseTables {
  // Add more tables as needed
}

// Migration status type
export interface MigrationStatus {
  [key: string]: number;
}

// Export all schemas
export * from './schemas/user';
export * from './schemas/auth-token';
