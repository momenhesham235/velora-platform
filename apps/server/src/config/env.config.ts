import { z } from 'zod';
import dotenv from 'dotenv';

/**
 * Environment Configuration with Validation
 * 
 * Uses Zod for runtime validation of environment variables
 * Ensures all required variables are present and correctly typed
 * Fails fast on startup if configuration is invalid
 */

// Load environment variables from .env file
dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).pipe(z.number().positive()).default('5000'),
  MONGODB_URI: z.string().url('Invalid MongoDB URI'),
  CLIENT_URL: z.string().url('Invalid client URL'),
  COOKIE_SECRET: z.string().min(1, 'Cookie secret is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT access secret must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT refresh secret must be at least 32 characters'),
});

// Validate and parse environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;
