import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-primary-500',
  secondary:
    'glass text-gray-900 hover:bg-white/80 hover:-translate-y-0.5 active:translate-y-0 dark:text-white dark:hover:bg-white/10 focus-visible:outline-primary-500',
  outline:
    'border border-gray-300/80 text-gray-700 hover:border-primary-400 hover:bg-primary-50/50 hover:-translate-y-0.5 active:translate-y-0 dark:border-white/15 dark:text-gray-200 dark:hover:border-primary-400/60 dark:hover:bg-white/5 focus-visible:outline-primary-500',
  ghost:
    'text-gray-600 hover:bg-gray-900/5 dark:text-gray-300 dark:hover:bg-white/10 focus-visible:outline-primary-500',
  danger:
    'bg-red-600 text-white shadow-lg shadow-red-600/25 hover:bg-red-500 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-red-500',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-13 px-7 text-base gap-2',
};

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cn(
    'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-out',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    'disabled:pointer-events-none disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );
}
