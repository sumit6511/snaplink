import type { Link } from '@/types/link';

export interface Bucket {
  name: string;
  count: number;
}

export interface DailyPoint {
  date: string;
  clicks: number;
}

export interface MonthlyPoint {
  month: string;
  clicks: number;
}

export interface ClickHistoryEntry {
  browser: string;
  os: string;
  device: string;
  country: string;
  referrer: string;
  timestamp: string;
}

export interface LinkAnalytics {
  link: Link;
  summary: {
    totalClicks: number;
    createdAt: string;
    expiresAt: string | null;
    lastClickedAt: string | null;
  };
  breakdown: {
    browser: Bucket[];
    os: Bucket[];
    device: Bucket[];
    country: Bucket[];
    referrer: Bucket[];
  };
  timeseries: {
    daily: DailyPoint[];
    monthly: MonthlyPoint[];
  };
  clickHistory: ClickHistoryEntry[];
}
