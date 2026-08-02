import { ArrowLeft, Calendar, Clock, MousePointerClick, Search, Upload } from 'lucide-react';
import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { StatCard } from '@/components/dashboard/StatCard';
import { CategoryBarChart } from '@/components/charts/CategoryBarChart';
import { CategoryDoughnutChart } from '@/components/charts/CategoryDoughnutChart';
import { RankedList } from '@/components/charts/RankedList';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useLinkAnalytics } from '@/hooks/useLinkAnalytics';
import { useLinks } from '@/hooks/useLinks';
import { exportClickHistoryCsvRequest } from '@/services/analytics.service';
import { downloadBlob } from '@/utils/downloadBlob';
import { formatDate, formatDateTime, formatNumber } from '@/utils/format';
import { getShortUrlDisplay } from '@/utils/shortLink';

function AnalyticsLinkPicker() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 350);
  const { data, isLoading } = useLinks({
    page: 1,
    limit: 20,
    search: debouncedSearch || undefined,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Pick a link to see its clicks, devices, and locations in detail.
        </p>
      </div>

      <Card className="p-6">
        <div className="relative max-w-sm">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your links..."
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : !data || data.links.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
            No links to show yet.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
            {data.links.map((link) => (
              <RouterLink
                key={link.id}
                to={`/dashboard/analytics/${link.id}`}
                className="flex items-center justify-between gap-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {link.title || link.originalUrl}
                  </p>
                  <p className="truncate font-mono text-xs text-primary-600 dark:text-primary-400">
                    {getShortUrlDisplay(link)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(link.clicks)} clicks
                </p>
              </RouterLink>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function LinkAnalyticsDetail({ linkId }: { linkId: string }) {
  const { data, isLoading, isError } = useLinkAnalytics(linkId);
  const [isExporting, setIsExporting] = useState(false);

  const exportCsv = async () => {
    setIsExporting(true);
    try {
      const blob = await exportClickHistoryCsvRequest(linkId);
      downloadBlob(blob, `snaplink-analytics-${new Date().toISOString().slice(0, 10)}.csv`);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="py-24 text-center text-sm text-red-600 dark:text-red-400">
        Could not load analytics for this link.
      </p>
    );
  }

  const { link, summary, breakdown, timeseries, clickHistory } = data;

  return (
    <div className="space-y-6">
      <RouterLink
        to="/dashboard/analytics"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="size-4" />
        All links
      </RouterLink>

      <div>
        <h1 className="truncate text-2xl font-bold text-gray-900 dark:text-white">
          {link.title || link.originalUrl}
        </h1>
        <p className="mt-1 font-mono text-sm text-primary-600 dark:text-primary-400">
          {getShortUrlDisplay(link)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={MousePointerClick}
          label="Total clicks"
          value={formatNumber(summary.totalClicks)}
        />
        <StatCard
          icon={Calendar}
          label="Created"
          value={formatDate(summary.createdAt)}
          accent="gray"
        />
        <StatCard
          icon={Clock}
          label="Expires"
          value={summary.expiresAt ? formatDate(summary.expiresAt) : 'Never'}
          accent="gray"
        />
        <StatCard
          icon={MousePointerClick}
          label="Last clicked"
          value={summary.lastClickedAt ? formatDateTime(summary.lastClickedAt) : 'No clicks yet'}
          accent="accent"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white">Daily clicks</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>
          <div className="mt-4">
            <TimeSeriesChart
              type="line"
              labels={timeseries.daily.map((d) => d.date)}
              values={timeseries.daily.map((d) => d.clicks)}
              formatLabel={(label) => formatDate(label)}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white">Monthly clicks</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last 12 months</p>
          <div className="mt-4">
            <TimeSeriesChart
              type="bar"
              labels={timeseries.monthly.map((m) => m.month)}
              values={timeseries.monthly.map((m) => m.clicks)}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white">Country distribution</h2>
          <div className="mt-4">
            <CategoryBarChart data={breakdown.country} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white">Browser usage</h2>
          <div className="mt-4">
            <CategoryDoughnutChart data={breakdown.browser} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white">Device</h2>
          <div className="mt-4">
            <CategoryDoughnutChart data={breakdown.device} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white">Operating system</h2>
          <div className="mt-4">
            <RankedList data={breakdown.os} />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white">Top referrers</h2>
        <div className="mt-4">
          <RankedList data={breakdown.referrer} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-gray-900 dark:text-white">Click history</h2>
          {clickHistory.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => void exportCsv()}
              isLoading={isExporting}
            >
              <Upload className="size-4" />
              Export CSV
            </Button>
          )}
        </div>
        {clickHistory.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No clicks recorded yet.
          </p>
        ) : (
          <div className="mt-4 max-h-96 -mx-6 overflow-y-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs tracking-wide text-gray-500 uppercase dark:border-gray-800 dark:text-gray-400">
                  <th className="px-6 py-2 font-medium">Time</th>
                  <th className="px-6 py-2 font-medium">Browser</th>
                  <th className="px-6 py-2 font-medium">OS</th>
                  <th className="px-6 py-2 font-medium">Device</th>
                  <th className="px-6 py-2 font-medium">Country</th>
                  <th className="px-6 py-2 font-medium">Referrer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {clickHistory.map((entry, i) => (
                  <tr key={`${entry.timestamp}-${i}`}>
                    <td className="px-6 py-2.5 whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {formatDateTime(entry.timestamp)}
                    </td>
                    <td className="px-6 py-2.5 text-gray-900 dark:text-white">{entry.browser}</td>
                    <td className="px-6 py-2.5 text-gray-900 dark:text-white">{entry.os}</td>
                    <td className="px-6 py-2.5 text-gray-900 capitalize dark:text-white">
                      {entry.device}
                    </td>
                    <td className="px-6 py-2.5 text-gray-900 dark:text-white">{entry.country}</td>
                    <td className="max-w-[160px] truncate px-6 py-2.5 text-gray-500 dark:text-gray-400">
                      {entry.referrer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export function DashboardAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  return id ? <LinkAnalyticsDetail linkId={id} /> : <AnalyticsLinkPicker />;
}
