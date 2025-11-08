import dotenv from 'dotenv';

dotenv.config();

type Environment = 'development' | 'production' | 'test'

const env = (process.env.NODE_ENV || 'development') as Environment;

interface DatabaseConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  ssl: boolean | { rejectUnauthorized: boolean }
  max: number
  idleTimeoutMillis: number
  connectionTimeoutMillis: number
}

interface ServerConfig {
  port: number
  environment: Environment
}

interface Config {
  database: DatabaseConfig
  server: ServerConfig
  environment: Environment
}

const getDatabaseConfig = (): DatabaseConfig => {
  const useProductionDefaults = env === 'production';

  if (useProductionDefaults) {
    if (!process.env.DB_HOST) throw new Error('DB_HOST environment variable is required in production');
    if (!process.env.DB_NAME) throw new Error('DB_NAME environment variable is required in production');
    if (!process.env.DB_USER) throw new Error('DB_USER environment variable is required in production');
    if (!process.env.DB_PASSWORD) throw new Error('DB_PASSWORD environment variable is required in production');
  }

  let sslValue: boolean | { rejectUnauthorized: boolean };
  if (process.env.DB_SSL === 'false') {
    sslValue = false;
  } else if (process.env.DB_SSL === 'true') {
    sslValue = { rejectUnauthorized: false };
  } else if (useProductionDefaults) {
    sslValue = { rejectUnauthorized: false };
  } else {
    sslValue = false;
  }

  return {
    host: process.env.DB_HOST || (useProductionDefaults ? '' : 'localhost'),
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || (useProductionDefaults ? '' : 'skierglistan'),
    user: process.env.DB_USER || (useProductionDefaults ? '' : 'postgres'),
    password: process.env.DB_PASSWORD || (useProductionDefaults ? '' : 'postgres'),
    ssl: sslValue,
    max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
  };
};

const getServerConfig = (): ServerConfig => {
  return {
    port: parseInt(process.env.PORT || '3000'),
    environment: env,
  };
};

export const config: Config = {
  database: getDatabaseConfig(),
  server: getServerConfig(),
  environment: env,
};

export default config;

