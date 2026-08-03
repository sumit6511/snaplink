import { motion } from 'framer-motion';
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="bg-orb animate-float-slow -top-20 -left-20 size-72 bg-primary-400/20 dark:bg-primary-500/25" />
        <div className="bg-orb animate-float top-1/3 -right-24 size-80 bg-accent-400/15 dark:bg-accent-500/25" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
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
      </motion.div>
    </div>
  );
}
