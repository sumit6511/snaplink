import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';

interface AuthLayoutProps {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center blur-3xl"
      >
        <div className="aspect-[1.2/1] w-[50rem] bg-gradient-to-tr from-primary-300 via-accent-200 to-primary-100 opacity-40 dark:opacity-20" />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <Card className="p-8">
          <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </Card>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
          <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-400">
            &larr; Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
