import cron from 'node-cron';
import { logger } from '../config/logger';
import { cleanupExpiredLinks } from './cleanupExpiredLinks.job';

// Runs daily at 03:15 — a low-traffic hour, off the top of the hour to avoid
// piling up with other services' cron jobs. Only meaningful for a
// long-running process; on a platform that sleeps the dyno between requests
// (e.g. Render's free tier), trigger `npm run cleanup:links` from an
// external scheduler instead — see README.
export function startScheduledJobs(): void {
  cron.schedule('15 3 * * *', () => {
    cleanupExpiredLinks().catch((err) => {
      logger.error(`Cleanup job failed: ${err}`);
    });
  });
}
