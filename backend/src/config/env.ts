import dotenv from 'dotenv';
import type { StringValue } from 'ms';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is required');
  process.exit(1);
}

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || '7d') as StringValue,
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
    : ['http://localhost:4200', 'http://localhost:4000'],
  nodeEnv: process.env.NODE_ENV || 'development',
} as const;
