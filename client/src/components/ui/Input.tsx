import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'h-11 rounded-xl border border-gray-300/70 bg-white/60 px-3.5 text-sm text-gray-900 backdrop-blur-sm transition-all duration-200',
            'placeholder:text-gray-400',
            'focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/15',
            'dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder:text-gray-500',
            'dark:focus:border-primary-400 dark:focus:bg-white/10 dark:focus:ring-primary-400/15',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/15',
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : hint ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
