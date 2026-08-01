import { LINK_EXPIRY_GRACE_PERIOD_MS } from '../config/constants';
import { logger } from '../config/logger';
import { ClickEvent } from '../models/ClickEvent.model';
import { Link } from '../models/Link.model';

export interface CleanupResult {
  deletedLinks: number;
  deletedClicks: number;
}

/**
 * Purges links that expired more than LINK_EXPIRY_GRACE_PERIOD_MS ago, along
 * with their click history. Expired links already 404 on redirect the moment
 * they expire (see redirect.service's isExpired check) — this only reclaims
 * storage for links whose owner hasn't looked at them in a while since.
 */
export async function cleanupExpiredLinks(): Promise<CleanupResult> {
  const cutoff = new Date(Date.now() - LINK_EXPIRY_GRACE_PERIOD_MS);
  // $ne: null is required alongside $lt here: BSON's comparison order ranks
  // null below any Date, so a bare { $lt: cutoff } would also match links
  // that have no expiration set at all (expiresAt: null) and delete them.
  const expiredLinks = await Link.find({ expiresAt: { $ne: null, $lt: cutoff } })
    .select('_id')
    .lean();

  if (expiredLinks.length === 0) {
    return { deletedLinks: 0, deletedClicks: 0 };
  }

  const linkIds = expiredLinks.map((link) => link._id);
  const { deletedCount: deletedClicks } = await ClickEvent.deleteMany({ link: { $in: linkIds } });
  const { deletedCount: deletedLinks } = await Link.deleteMany({ _id: { $in: linkIds } });

  logger.info(
    `Cleanup job: purged ${deletedLinks} expired link(s) and ${deletedClicks} click event(s)`,
  );

  return { deletedLinks, deletedClicks };
}
