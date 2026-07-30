import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonClasses } from '@/utils/buttonVariants';
import { Container } from '@/components/ui/Container';

export function CTASection() {
  return (
    <section className="py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-accent-600 px-8 py-16 text-center sm:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_60%)]"
          />
          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start sharing smarter links today
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/85">
            Join thousands of creators and teams using SnapLink to shorten, track, and share every
            link that matters.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Link
              to="/register"
              className={buttonClasses(
                'secondary',
                'lg',
                'bg-white text-gray-900 hover:bg-gray-100',
              )}
            >
              Create your free account
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
