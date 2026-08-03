import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2 font-semibold', className)}>
      <span className="glow-primary flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-white">
        <svg viewBox="0 0 24 24" fill="none" className="size-4.5" aria-hidden="true">
          <path
            d="M9.5 14.5a3 3 0 0 0 4.24 0l2.12-2.12a3 3 0 1 0-4.24-4.25l-.9.9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 9.5a3 3 0 0 0-4.24 0l-2.12 2.12a3 3 0 1 0 4.24 4.25l.9-.9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-lg tracking-tight text-gray-900 dark:text-white">SnapLink</span>
    </Link>
  );
}
