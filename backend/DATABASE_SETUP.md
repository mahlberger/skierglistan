# Database Setup Guide

## Security Notes

**Important:** This setup enforces security best practices:
- `.env` is ignored by git (never commit credentials)
- All configuration uses environment variables (loaded from `.env` file)
- In production, all database credentials **must** be provided via environment variables
- Docker Compose uses environment variables with safe defaults for local development only

## Local Development

### Option 1: Docker Compose (Recommended)

1. Create a `.env` file in the backend directory (copy from `.env.example`):
```bash
cp .env.example .env
```

The `.env.example` file contains all the default values needed for local development. Update any values if needed (especially passwords).

2. Start PostgreSQL using Docker Compose:
```bash
docker compose up -d
```

3. Apply database migrations:
```bash
npm run migrate:up
```

The Docker setup reads from your `.env` file or uses these defaults:
- Database: `skierglistan`
- User: `postgres`
- Password: `postgres`
- Port: `5432`

3. Start your application - it will automatically use values from `.env`:
```bash
npm run dev
```

4. To stop the database:
```bash
docker-compose down
```

5. To remove all data and start fresh:
```bash
docker-compose down -v
```

### Option 2: Manual Docker Setup

```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
psql -U postgres -c "CREATE DATABASE skierglistan;"
```

## AWS RDS Setup (Cheap & Easy)

### Option 1: RDS PostgreSQL (Recommended - Free Tier Available)

1. **Create RDS Instance:**
   - Go to AWS RDS Console
   - Click "Create database"
   - Choose "PostgreSQL"
   - Select "Free tier" template (or db.t3.micro for ~$15/month)
   - Set database identifier and master credentials
   - Choose VPC and security group
   - Click "Create database"

2. **Configure Security Group:**
   - Allow inbound traffic on port 5432 from your application's IP or VPC

3. **Set environment variables** (use your deployment platform's secret management):
   ```
   NODE_ENV=production
   DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
   DB_PORT=5432
   DB_NAME=skierglistan
   DB_USER=your_master_username
   DB_PASSWORD=your_master_password
   DB_SSL=true
   ```

   **Important:** In production, the application will throw an error if database credentials are not provided via environment variables. Never commit credentials to git.

4. **Run migrations:**
   ```bash
   npm run migrate:up
   ```

### Option 2: RDS Serverless v2 (Pay-per-use)

- Similar setup but with automatic scaling
- Better for variable workloads
- Slightly more expensive but very flexible

### Cost Estimation

- **Free Tier:** Free for 12 months (20 GB storage, 750 hours/month)
- **db.t3.micro:** ~$15/month (1 GB RAM, 2 vCPU)
- **db.t3.small:** ~$30/month (2 GB RAM, 2 vCPU)

### Usage

The database client is already configured and ready to use:

```typescript
import { query } from './database.js'

const result = await query('SELECT * FROM users WHERE id = $1', [userId])
```

For transactions, use `getClient()`:

```typescript
import { getClient } from './database.js'

const client = await getClient()
try {
  await client.query('BEGIN')
  await client.query('INSERT INTO users...')
  await client.query('COMMIT')
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally {
  client.release()
}
```

