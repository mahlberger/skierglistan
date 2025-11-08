const path = require('path');
const { runner } = require('node-pg-migrate');
const dotenv = require('dotenv');

dotenv.config();

const buildDatabaseUrl = () => {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0) return process.env.DATABASE_URL;
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const database = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
};

const normalizeDirection = (value) => {
  if (!value) return 'up';
  if (value === 'up' || value === 'down' || value === 'redo') return value;
  throw new Error(`Unsupported migration direction: ${value}`);
};

const getOptions = () => {
  const [, , directionArg, limitArg] = process.argv;
  const direction = normalizeDirection(directionArg);
  const count = limitArg && /^\d+$/.test(limitArg) ? Number(limitArg) : undefined;
  const file = limitArg && !/^\d+$/.test(limitArg) ? limitArg : undefined;
  return {
    direction,
    count,
    file
  };
};

const run = async () => {
  const options = getOptions();
  const result = await runner({
    databaseUrl: buildDatabaseUrl(),
    dir: path.join(__dirname, '..', 'migrations'),
    direction: options.direction,
    count: options.count,
    file: options.file,
    migrationsTable: process.env.DB_MIGRATIONS_TABLE || 'migrations',
    schema: process.env.DB_SCHEMA || 'public',
    createSchema: true,
    createMigrationsSchema: true,
    verbose: true
  });
  return result;
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});


