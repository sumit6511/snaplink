import { Card } from '@/components/ui/Card';

export function DashboardAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Pick a link to see its clicks, devices, and locations in detail.
        </p>
      </div>

      <Card className="p-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Per-link analytics charts (daily/monthly clicks, browser, device, country) are the next
          milestone.
        </p>
      </Card>
    </div>
  );
}
