import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Lifts and glows on hover — for cards that are themselves interactive
   * (clickable rows, feature tiles), not for static content containers. */
  interactive?: boolean;
}

export function Card({ className, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'glass rounded-2xl shadow-xl shadow-gray-950/5 dark:shadow-black/40',
        interactive &&
          'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-600/10 dark:hover:shadow-primary-500/10',
        className,
      )}
      {...props}
    />
  );
}
