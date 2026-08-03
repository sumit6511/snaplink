import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'primary' | 'accent' | 'gray' | 'green' | 'red';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary:
    'bg-primary-500/10 text-primary-700 ring-1 ring-primary-500/20 dark:text-primary-300 dark:ring-primary-400/25',
  accent:
    'bg-accent-500/10 text-accent-700 ring-1 ring-accent-500/20 dark:text-accent-300 dark:ring-accent-400/25',
  gray: 'bg-gray-900/5 text-gray-700 ring-1 ring-gray-900/10 dark:bg-white/5 dark:text-gray-300 dark:ring-white/10',
  green:
    'bg-green-500/10 text-green-700 ring-1 ring-green-500/20 dark:text-green-300 dark:ring-green-400/25',
  red: 'bg-red-500/10 text-red-700 ring-1 ring-red-500/20 dark:text-red-300 dark:ring-red-400/25',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'gray', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
