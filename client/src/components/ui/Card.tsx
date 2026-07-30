import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ className, glass, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-900/5 dark:border-gray-800 dark:bg-gray-900',
        glass && 'glass border-white/40 dark:border-gray-800/60',
        className,
      )}
      {...props}
    />
  );
}
