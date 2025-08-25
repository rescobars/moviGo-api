# moviGo API

Express server with TypeScript, Knex, and PostgreSQL for the moviGo application.

## Features

- Express.js server with TypeScript
- PostgreSQL database with Knex.js ORM
- JWT authentication
- Migration and seeding system
- RESTful API endpoints
- CORS enabled
- Helmet security middleware

## Prerequisites

- Node.js 22.x
- PostgreSQL database
- npm or yarn

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd moviGo-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your database credentials and other configuration.

4. **Database setup**
   ```bash
   # Create database (if not exists)
   createdb movigo_dev
   
   # Run migrations
   npm run migrate
   
   # Run seeds (optional)
   npm run seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:status` - Check migration status
- `npm run seed` - Run database seeds
- `npm run clean` - Clean build directory

## API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /api` - API info

### Protected Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Migration Endpoints (require API key)
- `POST /api/migrations/run` - Run all pending migrations
- `GET /api/migrations/status` - Check migration status
- `POST /api/migrations/rollback` - Rollback last migration
- `POST /api/migrations/rollback-all` - Rollback all migrations

### Seed Endpoints (require API key)
- `POST /api/seeds/run` - Run all seeds
- `POST /api/seeds/run-specific` - Run specific seed file
- `GET /api/seeds/list` - List available seed files

## Database Migrations

The project uses Knex.js for database migrations. Migrations are stored in the `migrations/` directory.

### Running Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
npm run migrate:status
```

### Creating New Migrations

```bash
npx knex migrate:make migration_name --knexfile knexfile.ts
```

## Database Seeds

Seed files are stored in the `seeds/` directory and are used to populate the database with initial data.

### Running Seeds

```bash
npm run seed
```

## API Key Authentication

The migration and seed endpoints require an API key for security. You can provide the API key in several ways:

### Headers
```bash
curl -X POST http://localhost:3000/api/migrations/run \
  -H "x-api-key: your-api-key-here"
```

### Query Parameter
```bash
curl -X POST "http://localhost:3000/api/migrations/run?apiKey=your-api-key-here"
```

### Environment Variable
Set `API_KEY_MIGRATIONS` in your `.env` file:
```
API_KEY_MIGRATIONS=your-secure-api-key-here
```

## Environment Variables

See `env.example` for all available environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `API_KEY_MIGRATIONS` - API key for migration and seed endpoints

## Project Structure

```
src/
├── config/          # Configuration files
├── db-config.ts     # Database configuration
├── index.ts         # Main server file
├── middleware/      # Express middleware
├── repositories/    # Data access layer
├── routes/          # API routes
├── services/        # Business logic
└── types/           # TypeScript type definitions

src/db/
├── migrations/     # Database migrations
└── seeds/         # Database seeds
```

## Deployment

This API is designed to be deployed to Heroku or similar platforms. Make sure to:

1. Set all required environment variables
2. Run migrations on deployment
3. Configure the database connection for production

## License

MIT
