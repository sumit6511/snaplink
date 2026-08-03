import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: 'primary' | 'accent' | 'green' | 'gray';
}

const ACCENT_CLASSES: Record<NonNullable<StatCardProps['accent']>, string> = {
  primary: 'bg-primary-500/10 text-primary-600 ring-1 ring-primary-500/20 dark:text-primary-400',
  accent: 'bg-accent-500/10 text-accent-600 ring-1 ring-accent-500/20 dark:text-accent-400',
  green: 'bg-green-500/10 text-green-600 ring-1 ring-green-500/20 dark:text-green-400',
  gray: 'bg-gray-900/5 text-gray-600 ring-1 ring-gray-900/10 dark:bg-white/5 dark:text-gray-300 dark:ring-white/10',
};

export function StatCard({ icon: Icon, label, value, accent = 'primary' }: StatCardProps) {
  return (
    <Card interactive className="p-5">
      <div
        className={`flex size-10 items-center justify-center rounded-xl ${ACCENT_CLASSES[accent]}`}
      >
        <Icon className="size-5" />
      </div>
      <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </Card>
  );
}
