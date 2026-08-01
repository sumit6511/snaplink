import { connectDB, disconnectDB } from '../config/db';
import { logger } from '../config/logger';
import { cleanupExpiredLinks } from './cleanupExpiredLinks.job';

// Standalone entry point for external schedulers (a Render Cron Job, a
// scheduled GitHub Actions workflow, a system crontab) that invoke this as
// `npm run cleanup:links` rather than relying on the API process's own
// in-process schedule (see jobs/scheduler.ts) staying alive.
async function main(): Promise<void> {
  await connectDB();
  const result = await cleanupExpiredLinks();
  logger.info(`Cleanup run complete: ${JSON.stringify(result)}`);
  await disconnectDB();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    logger.error(`Cleanup run failed: ${err}`);
    process.exit(1);
  });
