import { motion } from 'framer-motion';
import { ArrowRight, Copy, Globe2, MousePointerClick, QrCode, Sparkles } from 'lucide-react';
import { useRef, type CSSProperties, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { buttonClasses } from '@/utils/buttonVariants';

export function Hero() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Mutates a CSS custom property directly on the node instead of routing
  // through React state — a cursor-glow needs to update every pointermove,
  // and re-rendering the component tree at that rate is what tanks frame
  // rate, not the gradient itself.
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spotlightRef.current?.style.setProperty('--x', `${e.clientX - rect.left}px`);
    spotlightRef.current?.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
      >
        <div className="bg-orb animate-float-slow -top-24 left-[8%] size-80 bg-primary-400/25 dark:bg-primary-500/25" />
        <div className="bg-orb animate-float top-10 right-[5%] size-96 bg-accent-400/20 dark:bg-accent-500/25" />
        <div className="bg-orb animate-float-slow top-1/2 left-1/3 size-72 bg-sky-400/10 dark:bg-sky-400/15" />
      </div>

      {/* Cursor-follow spotlight — subtle, only meaningfully visible in dark
          mode where it reads as ambient light rather than a wash of color. */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 sm:opacity-100"
        style={
          {
            background:
              'radial-gradient(500px circle at var(--x, 50%) var(--y, 20%), rgb(99 102 241 / 8%), transparent 70%)',
          } as CSSProperties
        }
      />

      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Badge variant="primary" className="glow-primary mb-6">
            <Sparkles className="size-3.5" />
            Real-time click analytics
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
            Shorten links.{' '}
            <span className="text-gradient animate-gradient-shift bg-[length:200%_auto]">
              Track clicks.
            </span>
            <br />
            Share smarter.
          </h1>

          <p className="mt-6 max-w-lg text-lg text-gray-600 dark:text-gray-400">
            SnapLink turns long, messy URLs into branded short links — then shows you exactly who
            clicked, where they came from, and what device they used.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/register" className={buttonClasses('primary', 'lg')}>
              Get started free
              <ArrowRight className="size-4" />
            </Link>
            <a href="#how-it-works" className={buttonClasses('outline', 'lg')}>
              See how it works
            </a>
          </div>

          <p className="mt-5 text-sm text-gray-500 dark:text-gray-500">
            No credit card required &middot; Free plan available forever
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card interactive className="p-6 sm:p-8">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your long URL</p>
            <div className="mt-2 truncate rounded-xl border border-gray-900/10 bg-gray-900/[0.03] px-4 py-3 text-sm text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
              https://example.com/campaigns/summer-launch/2026?ref=newsletter
            </div>

            <div className="my-5 flex items-center gap-3 text-gray-300 dark:text-gray-700">
              <div className="h-px flex-1 bg-gray-900/10 dark:bg-white/10" />
              <ArrowRight className="size-4 rotate-90" />
              <div className="h-px flex-1 bg-gray-900/10 dark:bg-white/10" />
            </div>

            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your SnapLink</p>
            <div className="glow-primary mt-2 flex items-center justify-between rounded-xl border border-primary-500/20 bg-primary-500/10 px-4 py-3">
              <span className="font-mono text-sm font-medium text-primary-700 dark:text-primary-300">
                snap.link/summer26
              </span>
              <Copy className="size-4 text-primary-600 dark:text-primary-400" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-900/5 bg-gray-900/[0.02] p-3 text-center transition-transform duration-200 hover:-translate-y-0.5 dark:border-white/5 dark:bg-white/[0.03]">
                <MousePointerClick className="mx-auto size-4 text-primary-600 dark:text-primary-400" />
                <p className="mt-1.5 text-lg font-semibold text-gray-900 dark:text-white">8,492</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Clicks</p>
              </div>
              <div className="rounded-xl border border-gray-900/5 bg-gray-900/[0.02] p-3 text-center transition-transform duration-200 hover:-translate-y-0.5 dark:border-white/5 dark:bg-white/[0.03]">
                <Globe2 className="mx-auto size-4 text-accent-600 dark:text-accent-400" />
                <p className="mt-1.5 text-lg font-semibold text-gray-900 dark:text-white">42</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Countries</p>
              </div>
              <div className="rounded-xl border border-gray-900/5 bg-gray-900/[0.02] p-3 text-center transition-transform duration-200 hover:-translate-y-0.5 dark:border-white/5 dark:bg-white/[0.03]">
                <QrCode className="mx-auto size-4 text-gray-700 dark:text-gray-300" />
                <p className="mt-1.5 text-lg font-semibold text-gray-900 dark:text-white">Live</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">QR code</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}
