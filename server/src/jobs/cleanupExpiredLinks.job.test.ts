import { Types } from 'mongoose';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { LINK_EXPIRY_GRACE_PERIOD_MS } from '../config/constants';
import { ClickEvent } from '../models/ClickEvent.model';
import { Link } from '../models/Link.model';
import { User } from '../models/User.model';
import { startTestDb, stopTestDb } from '../test/dbMemoryServer';
import { cleanupExpiredLinks } from './cleanupExpiredLinks.job';

const DAY_MS = 24 * 60 * 60 * 1000;

beforeAll(async () => {
  await startTestDb();
});

afterAll(async () => {
  await stopTestDb();
});

afterEach(async () => {
  await Link.deleteMany({});
  await ClickEvent.deleteMany({});
  await User.deleteMany({});
});

async function createLink(expiresAt?: Date) {
  const owner = await User.create({
    name: 'Ada Lovelace',
    email: `ada-${new Types.ObjectId().toHexString()}@example.com`,
    password: 'password123',
  });
  return Link.create({
    originalUrl: 'https://example.com',
    // Slice from the tail, not the head: an ObjectId's first 8 hex chars are
    // a per-second timestamp, so two links created within the same second
    // would otherwise collide on shortCode's unique index.
    shortCode: new Types.ObjectId().toHexString().slice(-7),
    owner: owner._id,
    expiresAt,
  });
}

describe('cleanupExpiredLinks', () => {
  it('leaves links with no expiration date alone', async () => {
    await createLink(undefined);
    const result = await cleanupExpiredLinks();
    expect(result).toEqual({ deletedLinks: 0, deletedClicks: 0 });
    expect(await Link.countDocuments()).toBe(1);
  });

  it('leaves links that expired within the grace period alone', async () => {
    const recentlyExpired = new Date(Date.now() - DAY_MS);
    await createLink(recentlyExpired);
    const result = await cleanupExpiredLinks();
    expect(result).toEqual({ deletedLinks: 0, deletedClicks: 0 });
    expect(await Link.countDocuments()).toBe(1);
  });

  it('leaves links that have not expired yet alone', async () => {
    const future = new Date(Date.now() + DAY_MS);
    await createLink(future);
    const result = await cleanupExpiredLinks();
    expect(result).toEqual({ deletedLinks: 0, deletedClicks: 0 });
    expect(await Link.countDocuments()).toBe(1);
  });

  it('purges links past the grace period along with their click history', async () => {
    const longExpired = new Date(Date.now() - LINK_EXPIRY_GRACE_PERIOD_MS - DAY_MS);
    const link = await createLink(longExpired);
    await ClickEvent.create({
      link: link._id,
      ip: '127.0.0.1',
    });

    const result = await cleanupExpiredLinks();

    expect(result).toEqual({ deletedLinks: 1, deletedClicks: 1 });
    expect(await Link.countDocuments()).toBe(0);
    expect(await ClickEvent.countDocuments()).toBe(0);
  });

  it('only purges the links actually past the grace period, not every link', async () => {
    const longExpired = new Date(Date.now() - LINK_EXPIRY_GRACE_PERIOD_MS - DAY_MS);
    const recentlyExpired = new Date(Date.now() - DAY_MS);
    await createLink(longExpired);
    await createLink(recentlyExpired);
    await createLink(undefined);

    const result = await cleanupExpiredLinks();

    expect(result).toEqual({ deletedLinks: 1, deletedClicks: 0 });
    expect(await Link.countDocuments()).toBe(2);
  });
});
