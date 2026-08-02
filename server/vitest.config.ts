import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 30000,
    // Generous because mongodb-memory-server downloads the MongoDB binary
    // (~780MB) on first use in a fresh environment; cached after that.
    hookTimeout: 20 * 60 * 1000,
    env: {
      NODE_ENV: 'test',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/snaplink-test-placeholder',
      JWT_SECRET: 'test-only-jwt-secret-do-not-use-in-production-1',
      JWT_REFRESH_SECRET: 'test-only-refresh-secret-do-not-use-in-prod-2',
      CLIENT_URL: 'http://localhost:5173',
      BASE_URL: 'http://localhost:5000',
      // Explicitly blank so dotenv (which doesn't override existing
      // process.env values) can't pull a real key in from a developer's
      // local .env — tests must always hit the no-op logging fallback in
      // email.service.ts, never the real Resend API.
      RESEND_API_KEY: '',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'src/**/*.test.ts',
        'src/test/**',
        'src/__tests__/**',
        'src/types/**',
        'src/models/index.ts',
        'src/server.ts',
        'src/config/db.ts',
        'src/jobs/scheduler.ts',
        'src/jobs/runCleanupOnce.ts',
      ],
    },
  },
});
