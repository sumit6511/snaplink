import { motion } from 'framer-motion';
import {
  AppWindow,
  Clock,
  Globe2,
  Link2,
  QrCode,
  Search,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';

const FEATURES = [
  {
    icon: Link2,
    title: 'Custom aliases',
    description: 'Replace random codes with branded, memorable slugs your audience will trust.',
  },
  {
    icon: QrCode,
    title: 'QR codes, built in',
    description:
      'Every link gets a downloadable QR code automatically — great for print and events.',
  },
  {
    icon: Clock,
    title: 'Expiration dates',
    description: 'Set links to expire automatically for time-sensitive campaigns and promotions.',
  },
  {
    icon: Search,
    title: 'Search & manage',
    description: 'Find, edit, and organize hundreds of links in a searchable, paginated dashboard.',
  },
  {
    icon: Globe2,
    title: 'Global click analytics',
    description: 'See exactly which countries, browsers, and devices your audience clicks from.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by default',
    description: 'JWT authentication, rate limiting, and input validation on every request.',
  },
];

const ANALYTICS_CARDS = [
  { icon: AppWindow, label: 'Top browser', value: 'Chrome', sub: '61% of clicks' },
  { icon: Smartphone, label: 'Top device', value: 'Mobile', sub: '54% of clicks' },
  { icon: Globe2, label: 'Top country', value: 'United States', sub: '38% of clicks' },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Everything you need in a short link
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            SnapLink isn't just a redirect — it's a lightweight analytics platform for every link
            you share.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Analytics at a glance
            </h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Every link comes with a breakdown of who's clicking and how.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {ANALYTICS_CARDS.map((item) => (
              <Card key={item.label} className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
                    <item.icon className="size-5" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                </div>
                <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.sub}</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
