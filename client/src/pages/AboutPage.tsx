import { motion } from 'framer-motion';
import { Heart, Rocket, ShieldCheck, Sparkles } from 'lucide-react';
import { CTASection } from '@/components/sections/CTASection';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';

const VALUES = [
  {
    icon: Sparkles,
    title: 'Simple by design',
    description: 'A short link should take seconds to create — not a tutorial to figure out.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy-respecting',
    description: 'We collect only what powers your analytics: no ad trackers, no data resale.',
  },
  {
    icon: Rocket,
    title: 'Built for scale',
    description: 'From your first link to your millionth click, the same fast redirect path.',
  },
  {
    icon: Heart,
    title: 'Made for creators',
    description: 'Designed with marketers, developers, and small teams in the room.',
  },
];

const STATS = [
  { value: '2M+', label: 'Links shortened' },
  { value: '180+', label: 'Countries reached' },
  { value: '99.9%', label: 'Redirect uptime' },
];

export function AboutPage() {
  return (
    <>
      <section className="py-20 sm:py-28">
        <Container className="max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              We think links should tell you more
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
              SnapLink started as a simple question: why does sharing a link mean giving up all
              visibility into who clicks it? We built the tool we wanted — a fast shortener with
              real analytics baked in from day one.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STATS.map((stat) => (
              <Card key={stat.label} className="p-8 text-center">
                <p className="text-4xl font-bold text-gradient">{stat.value}</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-gray-50 py-24 dark:bg-gray-900/40">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              What we believe
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <Card key={value.title} className="p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                  <value.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{value.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
