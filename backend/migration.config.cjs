require('dotenv').config();

const ensureDatabaseUrl = () => {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0) {
    return process.env.DATABASE_URL;
  }
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME || 'skierglistan';
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || 'postgres';
  const url = `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
  process.env.DATABASE_URL = url;
  return url;
};

module.exports = {
  url: ensureDatabaseUrl(),
  migrationsTable: process.env.DB_MIGRATIONS_TABLE || 'migrations',
  dir: 'migrations',
  direction: 'up',
  schema: process.env.DB_SCHEMA || 'public',
};

