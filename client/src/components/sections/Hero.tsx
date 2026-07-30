import { motion } from 'framer-motion';
import { ArrowRight, Copy, Globe2, MousePointerClick, QrCode, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { buttonClasses } from '@/utils/buttonVariants';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center blur-3xl"
      >
        <div className="aspect-[1.2/1] w-[60rem] bg-gradient-to-tr from-primary-300 via-accent-200 to-primary-100 opacity-40 dark:opacity-20" />
      </div>

      <Container className="grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="primary" className="mb-6">
            <Sparkles className="size-3.5" />
            Real-time click analytics
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
            Shorten links. <span className="text-gradient">Track clicks.</span>
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
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Card className="p-6 sm:p-8">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your long URL</p>
            <div className="mt-2 truncate rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-400">
              https://example.com/campaigns/summer-launch/2026?ref=newsletter
            </div>

            <div className="my-5 flex items-center gap-3 text-gray-300 dark:text-gray-700">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              <ArrowRight className="size-4 rotate-90" />
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>

            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your SnapLink</p>
            <div className="mt-2 flex items-center justify-between rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 dark:border-primary-500/30 dark:bg-primary-500/10">
              <span className="font-mono text-sm font-medium text-primary-700 dark:text-primary-300">
                snap.link/summer26
              </span>
              <Copy className="size-4 text-primary-600 dark:text-primary-400" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/60">
                <MousePointerClick className="mx-auto size-4 text-primary-600 dark:text-primary-400" />
                <p className="mt-1.5 text-lg font-semibold text-gray-900 dark:text-white">8,492</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Clicks</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/60">
                <Globe2 className="mx-auto size-4 text-accent-600 dark:text-accent-400" />
                <p className="mt-1.5 text-lg font-semibold text-gray-900 dark:text-white">42</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Countries</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/60">
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
