import { motion } from 'framer-motion';
import { Link2, MousePointerClick, PlusCircle, ShieldCheck, ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GettingStartedChecklist } from '@/components/dashboard/GettingStartedChecklist';
import { StatCard } from '@/components/dashboard/StatCard';
import { buttonClasses } from '@/utils/buttonVariants';
import { Card } from '@/components/ui/Card';
import { ListRowSkeleton, StatCardSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useLinks, useLinkStats } from '@/hooks/useLinks';
import { formatDate, formatNumber } from '@/utils/format';
import { getShortUrlDisplay } from '@/utils/shortLink';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function DashboardHomePage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useLinkStats();
  const { data: recent, isLoading: recentLoading } = useLinks({ page: 1, limit: 5 });

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.08 }}
    >
      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
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
      </motion.div>

      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={Link2}
              label="Total links"
              value={formatNumber(stats?.totalLinks ?? 0)}
            />
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
          </>
        )}
      </motion.div>

      {!statsLoading && !recentLoading && (
        <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
          <GettingStartedChecklist stats={stats} recentLinks={recent?.links} />
        </motion.div>
      )}

      <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
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
            <div className="mt-4 divide-y divide-gray-900/5 dark:divide-white/5">
              <ListRowSkeleton />
              <ListRowSkeleton />
              <ListRowSkeleton />
            </div>
          ) : recent && recent.links.length > 0 ? (
            <div className="mt-4 divide-y divide-gray-900/5 dark:divide-white/5">
              {recent.links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between gap-4 rounded-lg py-3 transition-colors hover:bg-gray-900/[0.02] dark:hover:bg-white/[0.03]"
                >
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
      </motion.div>
    </motion.div>
  );
}
