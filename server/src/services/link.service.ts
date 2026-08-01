import { nanoid } from 'nanoid';
import { FilterQuery, Types } from 'mongoose';
import { env } from '../config/env';
import { ClickEvent } from '../models/ClickEvent.model';
import { ILink, Link, LinkDocument } from '../models/Link.model';
import { AppError } from '../utils/AppError';
import { toCsv } from '../utils/csv';
import { escapeRegExp } from '../utils/escapeRegExp';
import { generateQrCodeDataUrl } from '../utils/qrcode';
import { CreateLinkInput, ListLinksQuery, UpdateLinkInput } from '../validators/link.validator';

interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

async function generateUniqueShortCode(): Promise<string> {
  const MAX_ATTEMPTS = 5;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = nanoid(env.SHORT_CODE_LENGTH);
    const exists = await Link.exists({ shortCode: code });
    if (!exists) return code;
  }
  throw AppError.internal('Could not generate a unique short code. Please try again.');
}

function buildShortUrl(link: Pick<ILink, 'shortCode' | 'customAlias'>): string {
  return `${env.BASE_URL}/${link.customAlias || link.shortCode}`;
}

export async function createLink(ownerId: string, input: CreateLinkInput): Promise<LinkDocument> {
  const shortCode = await generateUniqueShortCode();
  const qrCode = await generateQrCodeDataUrl(
    buildShortUrl({ shortCode, customAlias: input.customAlias }),
  );

  return Link.create({
    ...input,
    shortCode,
    qrCode,
    owner: ownerId,
  });
}

function buildSearchFilter(ownerId: string, search?: string): FilterQuery<ILink> {
  const filter: FilterQuery<ILink> = { owner: ownerId };

  if (search) {
    const regex = new RegExp(escapeRegExp(search), 'i');
    filter.$or = [
      { originalUrl: regex },
      { title: regex },
      { customAlias: regex },
      { shortCode: regex },
    ];
  }

  return filter;
}

export async function listLinks(
  ownerId: string,
  query: ListLinksQuery,
): Promise<Paginated<LinkDocument>> {
  const filter = buildSearchFilter(ownerId, query.search);
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    Link.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
    Link.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
}

export async function getOwnedLink(ownerId: string, linkId: string): Promise<LinkDocument> {
  const link = await Link.findOne({ _id: linkId, owner: ownerId });
  if (!link) {
    throw AppError.notFound('Link not found');
  }
  return link;
}

export async function updateLink(
  ownerId: string,
  linkId: string,
  input: UpdateLinkInput,
): Promise<LinkDocument> {
  const link = await getOwnedLink(ownerId, linkId);

  if (input.originalUrl !== undefined) link.originalUrl = input.originalUrl;
  if (input.title !== undefined) link.title = input.title ?? undefined;
  if (input.expiresAt !== undefined) link.expiresAt = input.expiresAt ?? undefined;

  let aliasChanged = false;
  if (input.customAlias !== undefined) {
    const newAlias = input.customAlias ?? undefined;
    aliasChanged = newAlias !== link.customAlias;
    link.customAlias = newAlias;
  }

  if (aliasChanged) {
    link.qrCode = await generateQrCodeDataUrl(buildShortUrl(link));
  }

  await link.save();
  return link;
}

export async function deleteLink(ownerId: string, linkId: string): Promise<void> {
  const link = await getOwnedLink(ownerId, linkId);
  await ClickEvent.deleteMany({ link: link._id });
  await link.deleteOne();
}

export interface LinkStats {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  expiredLinks: number;
}

export async function getLinkStats(ownerId: string): Promise<LinkStats> {
  const now = new Date();

  const [result] = await Link.aggregate<{
    totalLinks: number;
    totalClicks: number;
    expiredLinks: number;
  }>([
    { $match: { owner: new Types.ObjectId(ownerId) } },
    {
      $group: {
        _id: null,
        totalLinks: { $sum: 1 },
        totalClicks: { $sum: '$clicks' },
        expiredLinks: {
          $sum: {
            $cond: [{ $and: [{ $ne: ['$expiresAt', null] }, { $lt: ['$expiresAt', now] }] }, 1, 0],
          },
        },
      },
    },
  ]);

  const totalLinks = result?.totalLinks ?? 0;
  const totalClicks = result?.totalClicks ?? 0;
  const expiredLinks = result?.expiredLinks ?? 0;

  return { totalLinks, totalClicks, expiredLinks, activeLinks: totalLinks - expiredLinks };
}

export interface BulkImportResult {
  created: LinkDocument[];
  failed: { url: string; reason: string }[];
}

// Sequential rather than Promise.all: generateUniqueShortCode reads then
// writes shortCode uniqueness one link at a time, and running many of those
// concurrently would race (two URLs could check-and-not-find the same free
// code before either has saved it, causing collisions the DB would then
// reject asymmetrically). Simpler to just process one at a time.
export async function bulkImportLinks(ownerId: string, urls: string[]): Promise<BulkImportResult> {
  const created: LinkDocument[] = [];
  const failed: { url: string; reason: string }[] = [];

  for (const url of urls) {
    try {
      created.push(await createLink(ownerId, { originalUrl: url }));
    } catch (err) {
      failed.push({ url, reason: err instanceof Error ? err.message : 'Could not create link' });
    }
  }

  return { created, failed };
}

export async function exportLinksCsv(ownerId: string, search?: string): Promise<string> {
  const filter = buildSearchFilter(ownerId, search);
  const links = await Link.find(filter).sort({ createdAt: -1 });

  return toCsv(links, [
    { header: 'Title', value: (link) => link.title },
    { header: 'Short URL', value: (link) => buildShortUrl(link) },
    { header: 'Original URL', value: (link) => link.originalUrl },
    { header: 'Custom Alias', value: (link) => link.customAlias },
    { header: 'Clicks', value: (link) => link.clicks },
    { header: 'Status', value: (link) => (link.isExpired ? 'Expired' : 'Active') },
    { header: 'Created At', value: (link) => link.createdAt.toISOString() },
    { header: 'Expires At', value: (link) => link.expiresAt?.toISOString() },
  ]);
}
