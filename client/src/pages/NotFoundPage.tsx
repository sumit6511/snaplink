import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonClasses } from '@/utils/buttonVariants';
import { Container } from '@/components/ui/Container';

export function NotFoundPage() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-gray-600 dark:text-gray-400">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className={buttonClasses('primary', 'md', 'mt-8')}>
        <ArrowLeft className="size-4" />
        Back to home
      </Link>
    </Container>
  );
}
