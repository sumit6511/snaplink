import { ClickEvent } from '../models/ClickEvent.model';
import { getOwnedLink } from './link.service';

interface Bucket {
  name: string;
  count: number;
}

interface FacetResult {
  browser: { _id: string; count: number }[];
  os: { _id: string; count: number }[];
  device: { _id: string; count: number }[];
  country: { _id: string; count: number }[];
  referrer: { _id: string; count: number }[];
  daily: { _id: string; clicks: number }[];
  monthly: { _id: string; clicks: number }[];
  lastClicked: { timestamp: Date }[];
  history: {
    browser: string;
    os: string;
    device: string;
    country: string;
    referrer: string;
    timestamp: Date;
  }[];
}

function toBuckets(rows: { _id: string; count: number }[]): Bucket[] {
  return rows.map((row) => ({ name: row._id, count: row.count }));
}

function fillDailySeries(rows: { _id: string; clicks: number }[], days: number) {
  const byDate = new Map(rows.map((row) => [row._id, row.clicks]));
  const series: { date: string; clicks: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, clicks: byDate.get(key) ?? 0 });
  }

  return series;
}

function fillMonthlySeries(rows: { _id: string; clicks: number }[], months: number) {
  const byMonth = new Map(rows.map((row) => [row._id, row.clicks]));
  const series: { month: string; clicks: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(1);
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCMonth(d.getUTCMonth() - i);
    const key = d.toISOString().slice(0, 7);
    series.push({ month: key, clicks: byMonth.get(key) ?? 0 });
  }

  return series;
}

export async function getLinkAnalytics(ownerId: string, linkId: string) {
  const link = await getOwnedLink(ownerId, linkId);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 29);
  thirtyDaysAgo.setUTCHours(0, 0, 0, 0);

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setUTCMonth(twelveMonthsAgo.getUTCMonth() - 11);
  twelveMonthsAgo.setUTCDate(1);
  twelveMonthsAgo.setUTCHours(0, 0, 0, 0);

  const [facets] = await ClickEvent.aggregate<FacetResult>([
    { $match: { link: link._id } },
    {
      $facet: {
        browser: [{ $group: { _id: '$browser', count: { $sum: 1 } } }, { $sort: { count: -1 } }],
        os: [{ $group: { _id: '$os', count: { $sum: 1 } } }, { $sort: { count: -1 } }],
        device: [{ $group: { _id: '$device', count: { $sum: 1 } } }, { $sort: { count: -1 } }],
        country: [{ $group: { _id: '$country', count: { $sum: 1 } } }, { $sort: { count: -1 } }],
        referrer: [{ $group: { _id: '$referrer', count: { $sum: 1 } } }, { $sort: { count: -1 } }],
        daily: [
          { $match: { timestamp: { $gte: thirtyDaysAgo } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
              clicks: { $sum: 1 },
            },
          },
        ],
        monthly: [
          { $match: { timestamp: { $gte: twelveMonthsAgo } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$timestamp' } },
              clicks: { $sum: 1 },
            },
          },
        ],
        lastClicked: [
          { $sort: { timestamp: -1 } },
          { $limit: 1 },
          { $project: { _id: 0, timestamp: 1 } },
        ],
        history: [
          { $sort: { timestamp: -1 } },
          { $limit: 50 },
          {
            $project: {
              _id: 0,
              browser: 1,
              os: 1,
              device: 1,
              country: 1,
              referrer: 1,
              timestamp: 1,
            },
          },
        ],
      },
    },
  ]);

  return {
    link,
    summary: {
      totalClicks: link.clicks,
      createdAt: link.createdAt,
      expiresAt: link.expiresAt ?? null,
      lastClickedAt: facets.lastClicked[0]?.timestamp ?? null,
    },
    breakdown: {
      browser: toBuckets(facets.browser),
      os: toBuckets(facets.os),
      device: toBuckets(facets.device),
      country: toBuckets(facets.country),
      referrer: toBuckets(facets.referrer),
    },
    timeseries: {
      daily: fillDailySeries(facets.daily, 30),
      monthly: fillMonthlySeries(facets.monthly, 12),
    },
    clickHistory: facets.history,
  };
}
