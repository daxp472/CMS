import 'dotenv/config';

interface Config {
  port: number;
  jwtSecret: string;
  jwtExpiry: string;
  databaseUrl: string;
  nodeEnv: string;
}

const getConfig = (): Config => {
  return {
    port: parseInt(process.env.PORT || '5000', 10),
    jwtSecret: process.env.JWT_SECRET || 'nyayasankalan-super-secret-key-change-in-production',
    jwtExpiry: process.env.JWT_EXPIRY || '24h',
    databaseUrl: process.env.DATABASE_URL || '',
    nodeEnv: process.env.NODE_ENV || 'development',
  };
};

export const config = getConfig();
