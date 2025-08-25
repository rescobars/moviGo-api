import knex from 'knex';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the environment from NODE_ENV or default to development
const environment = process.env.NODE_ENV || 'development';

// Database configuration
const config = {
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/movigo_dev',
    migrations: {
      directory: './packages/database/src/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './packages/database/src/seeds',
      extension: 'ts',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  test: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/movigo_test',
    migrations: {
      directory: './packages/database/src/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './packages/database/src/seeds',
      extension: 'ts',
    },
    pool: {
      min: 1,
      max: 5,
    },
  },
  production: {
    client: 'postgresql',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      directory: './packages/database/src/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './packages/database/src/seeds',
      extension: 'ts',
    },
    pool: {
      min: 2,
      max: 20,
    },
  },
};

// Create and export the Knex instance
export const db = knex(config[environment as keyof typeof config]);

// Export the Knex type for use in other packages
export type { Knex } from 'knex';

// Default export
export default db;
