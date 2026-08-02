import { motion } from 'framer-motion';
import { Link2, Share2, TrendingUp } from 'lucide-react';
import { Container } from '@/components/ui/Container';

const STEPS = [
  {
    icon: Link2,
    title: 'Paste your long URL',
    description: 'Drop in any link and SnapLink instantly generates a short, shareable version.',
  },
  {
    icon: Share2,
    title: 'Customize & share',
    description: 'Add a custom alias, set an expiration date, and generate a QR code in one click.',
  },
  {
    icon: TrendingUp,
    title: 'Track performance',
    description:
      'Watch clicks roll in with live charts for location, device, browser, and referrer.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-24 dark:bg-gray-900/40">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            How it works
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            From long URL to full analytics in under ten seconds.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-600/20">
                <step.icon className="size-6" />
              </div>
              <span className="mt-4 block text-sm font-semibold text-primary-600 dark:text-primary-400">
                Step {i + 1}
              </span>
              <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
