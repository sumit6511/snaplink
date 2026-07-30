import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'primary' | 'accent' | 'gray' | 'green' | 'red';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary: 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300',
  accent: 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  green: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300',
  red: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
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
