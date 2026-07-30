import geoip from 'fast-geoip';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import { logger } from '../config/logger';
import { ClickEvent, DeviceType } from '../models/ClickEvent.model';
import { Link, LinkDocument } from '../models/Link.model';
import { AppError } from '../utils/AppError';

const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegrambot|discordbot|slackbot|twitterbot/i;

function detectDevice(userAgent: string, uaParserDeviceType?: string): DeviceType {
  if (BOT_PATTERN.test(userAgent)) return 'bot';
  if (uaParserDeviceType === 'mobile') return 'mobile';
  if (uaParserDeviceType === 'tablet') return 'tablet';
  if (!uaParserDeviceType) return 'desktop';
  return 'unknown';
}

export async function resolveLink(code: string): Promise<LinkDocument> {
  const link = await Link.findOne({ $or: [{ customAlias: code }, { shortCode: code }] });

  if (!link) {
    throw AppError.notFound('This short link does not exist');
  }
  if (link.isExpired) {
    throw AppError.notFound('This short link has expired');
  }

  return link;
}

export async function recordClick(link: LinkDocument, req: Request): Promise<void> {
  try {
    const userAgent = req.headers['user-agent'] ?? '';
    const { browser, os, device } = new UAParser(userAgent).getResult();
    const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';

    const geo = await geoip.lookup(ip).catch(() => null);

    await ClickEvent.create({
      link: link._id,
      browser: browser.name ?? 'Unknown',
      os: os.name ?? 'Unknown',
      device: detectDevice(userAgent, device.type),
      country: geo?.country ?? 'Unknown',
      ip,
      referrer: req.headers.referer ?? 'Direct',
      timestamp: new Date(),
    });

    await Link.updateOne({ _id: link._id }, { $inc: { clicks: 1 } });
  } catch (err) {
    logger.error(`Failed to record click for link ${link.id}: ${err}`);
  }
}
