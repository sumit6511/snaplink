import { Link2, MousePointerClick, PlusCircle, ShieldCheck, ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/dashboard/StatCard';
import { buttonClasses } from '@/utils/buttonVariants';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { useLinks, useLinkStats } from '@/hooks/useLinks';
import { formatDate, formatNumber } from '@/utils/format';
import { getShortUrlDisplay } from '@/utils/shortLink';

export function DashboardHomePage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useLinkStats();
  const { data: recent, isLoading: recentLoading } = useLinks({ page: 1, limit: 5 });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Here's how your links are performing.
          </p>
        </div>
        <Link to="/dashboard/links" className={buttonClasses('primary', 'md')}>
          <PlusCircle className="size-4" />
          New link
        </Link>
      </div>

      {statsLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Link2} label="Total links" value={formatNumber(stats?.totalLinks ?? 0)} />
          <StatCard
            icon={MousePointerClick}
            label="Total clicks"
            value={formatNumber(stats?.totalClicks ?? 0)}
            accent="accent"
          />
          <StatCard
            icon={ShieldCheck}
            label="Active links"
            value={formatNumber(stats?.activeLinks ?? 0)}
            accent="green"
          />
          <StatCard
            icon={ShieldOff}
            label="Expired links"
            value={formatNumber(stats?.expiredLinks ?? 0)}
            accent="gray"
          />
        </div>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent links</h2>
          <Link
            to="/dashboard/links"
            className="text-sm font-medium text-primary-600 dark:text-primary-400"
          >
            View all
          </Link>
        </div>

        {recentLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : recent && recent.links.length > 0 ? (
          <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
            {recent.links.map((link) => (
              <div key={link.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {link.title || link.originalUrl}
                  </p>
                  <p className="truncate font-mono text-xs text-primary-600 dark:text-primary-400">
                    {getShortUrlDisplay(link)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatNumber(link.clicks)} clicks
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(link.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You haven't created any links yet.
            </p>
            <Link
              to="/dashboard/links"
              className={buttonClasses('primary', 'sm', 'mt-4 inline-flex')}
            >
              Create your first link
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
