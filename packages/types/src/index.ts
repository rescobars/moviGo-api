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

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

// Database table types
export interface DatabaseTables {
  users: User;
  // Add more tables as needed
}

// Migration status type
export interface MigrationStatus {
  [key: string]: number;
}
