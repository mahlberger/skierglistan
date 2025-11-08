# Environment Variables (.env) Guide

## Purpose of `.env` File

The `.env` file contains **all configuration** for the application, including sensitive credentials and environment-specific settings. It should never be committed to git.

## Configuration Approach

This application uses **environment variables only** (no config.json file). All settings come from:
1. `.env` file (loaded automatically)
2. System environment variables (highest priority)
3. Hardcoded defaults (fallback only)

## Environment Variables

### Application Variables (for your Express app)

```bash
# Environment
NODE_ENV=development

# Database Connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skierglistan
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_SSL=false

# Server
PORT=3000
```

### Docker Compose Variables (for PostgreSQL container)

```bash
# PostgreSQL Container Configuration
POSTGRES_DB=skierglistan
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
```

**Note:** If you set `POSTGRES_PASSWORD` in `.env`, Docker Compose will use it. Otherwise, it defaults to `postgres` for local development.

## Priority Order

1. **System environment variables** - **Highest priority** (set on your deployment platform)
2. **`.env` file** - Local development values (loaded by dotenv)
3. **Hardcoded defaults** - Last resort (for local development only)

## Using `.env`

### Local Development
- **Required:** Create a `.env` file from `.env.example`
- Customize values for your local setup (passwords, ports, etc.)
- All values have sensible defaults if not set

### Production
- **Do not** use `.env` files in production
- **Always** use your deployment platform's secret management (AWS Secrets Manager, environment variables, etc.)
- The application will throw an error if required variables are missing in production

### Example Setup

1. Copy the example file:
```bash
cp .env.example .env
```

2. Customize your `.env`:
```bash
# .env
DB_PASSWORD=my_secure_local_password
POSTGRES_PASSWORD=my_secure_local_password

# Optional overrides
PORT=4000
DB_PORT=5433
```

3. Start your application - it automatically loads `.env`:
```bash
npm run dev
```

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` with your values
3. The `dotenv` package automatically loads `.env` when your app starts

## Security Notes

- ⚠️ `.env` is in `.gitignore` - never commit it
- ✅ In production, use your platform's secret management (AWS Secrets Manager, etc.)
- ✅ Production requires environment variables - all required variables must be provided

