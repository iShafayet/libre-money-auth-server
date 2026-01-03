import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  couchdb: {
    url: string;
    masterAdminUsername: string;
    masterAdminPassword: string;
    mappingDatabaseName: string;
  };
  server: {
    port: number;
    nodeEnv: string;
  };
  cors: {
    origin: string;
  };
}

function validateEnv(): EnvConfig {
  const requiredEnvVars = [
    'COUCHDB_URL',
    'COUCHDB_MASTER_ADMIN_USERNAME',
    'COUCHDB_MASTER_ADMIN_PASSWORD',
    'COUCHDB_MAPPING_DATABASE_NAME',
    'PORT',
  ];

  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  return {
    couchdb: {
      url: process.env.COUCHDB_URL!,
      masterAdminUsername: process.env.COUCHDB_MASTER_ADMIN_USERNAME!,
      masterAdminPassword: process.env.COUCHDB_MASTER_ADMIN_PASSWORD!,
      mappingDatabaseName: process.env.COUCHDB_MAPPING_DATABASE_NAME!,
    },
    server: {
      port: parseInt(process.env.PORT!, 10),
      nodeEnv: process.env.NODE_ENV || 'development',
    },
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
    },
  };
}

export const env = validateEnv();
