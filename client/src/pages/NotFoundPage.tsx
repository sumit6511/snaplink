import { motion } from 'framer-motion';
import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { buttonClasses } from '@/utils/buttonVariants';

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-6rem)] items-center overflow-hidden py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="bg-orb animate-float-slow -top-16 left-1/4 size-72 bg-primary-400/20 dark:bg-primary-500/25" />
        <div className="bg-orb animate-float top-1/3 -right-16 size-80 bg-accent-400/15 dark:bg-accent-500/25" />
      </div>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-md"
        >
          <Card className="p-10 text-center">
            <div className="glow-primary mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
              <SearchX className="size-6" />
            </div>
            <p className="text-gradient mt-6 text-sm font-bold tracking-widest uppercase">
              Error 404
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Page not found
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              The page you're looking for doesn't exist or may have been moved.
            </p>
            <Link to="/" className={buttonClasses('primary', 'md', 'mt-8 w-full')}>
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}
