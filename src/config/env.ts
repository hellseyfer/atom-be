import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Determine the environment
export const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Load environment variables from the appropriate .env file
const envPath = path.resolve(process.cwd(), isProduction ? '.env.production' : '.env');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  // For production, we might not have a .env file (using environment variables from the platform)
  if (!isProduction) {
    console.warn(`Warning: ${envPath} file not found. Using system environment variables.`);
  }
}

// Define required environment variables
interface RequiredEnvVars {
  [key: string]: string | undefined;
}

const requiredEnvVars: RequiredEnvVars = {
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || '8080',
};

// Validate required environment variables
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value && key !== 'PORT') {
    throw new Error(`Environment variable ${key} is required`);
  }
}

// Export environment variables with type safety
export const env = {
  // Server
  nodeEnv: NODE_ENV,
  isProduction,
  port: requiredEnvVars.PORT || '8080',
  
  // Authentication
  jwtSecret: requiredEnvVars.JWT_SECRET!,
  
  // API
  api: {
    prefix: '/api',
  },
  
  // CORS
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS ? 
      process.env.ALLOWED_ORIGINS.split(',') : 
      (isProduction ? [] : ['http://localhost:3000', 'http://localhost:4200', 'http://localhost:8080']),
  },
} as const;

// Log environment in development
if (!isProduction) {
  console.log('Environment:', {
    NODE_ENV: env.nodeEnv,
    PORT: env.port,
    API_PREFIX: env.api.prefix,
    CORS_ALLOWED_ORIGINS: env.cors.allowedOrigins,
  });
}
