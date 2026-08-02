import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  BASE_URL: z.string().url().default('http://localhost:5000'),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),

  SHORT_CODE_LENGTH: z.coerce.number().int().min(4).max(20).default(7),

  // Optional: without it, password-reset/verification emails are logged
  // instead of sent (see email.service.ts) so the rest of the app — and
  // CI, which has no real key — still works.
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('SnapLink <onboarding@resend.dev>'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid or missing environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Environment validation failed. Check your .env file against .env.example.');
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
