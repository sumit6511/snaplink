import type { Bucket } from '@/types/analytics';
import { formatNumber } from '@/utils/format';

export function RankedList({ data, maxRows = 6 }: { data: Bucket[]; maxRows?: number }) {
  const rows = data.slice(0, maxRows);
  const max = Math.max(1, ...rows.map((row) => row.count));

  if (rows.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">No data yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.name} className="flex items-center gap-3">
          <p
            className="w-28 shrink-0 truncate text-sm text-gray-700 dark:text-gray-300"
            title={row.name}
          >
            {row.name}
          </p>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-primary-500"
              style={{ width: `${(row.count / max) * 100}%` }}
            />
          </div>
          <p className="w-12 shrink-0 text-right text-sm font-medium text-gray-900 dark:text-white">
            {formatNumber(row.count)}
          </p>
        </div>
      ))}
    </div>
  );
}
