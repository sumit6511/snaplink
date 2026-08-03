import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';

const TESTIMONIALS = [
  {
    quote:
      'SnapLink replaced three separate tools for us — link shortening, QR codes, and click analytics all live in one clean dashboard now.',
    name: 'Maya Chen',
    role: 'Growth Lead, Fernwood Studio',
  },
  {
    quote:
      'The per-link analytics are genuinely useful, not just vanity metrics. Knowing which country and device our clicks come from changed how we run campaigns.',
    name: 'Daniel Okafor',
    role: 'Marketing Manager, Northwind Retail',
  },
  {
    quote:
      "Setup took five minutes and the QR codes just work. It's the rare tool that's both simple and powerful.",
    name: 'Priya Nair',
    role: 'Founder, Loom & Co.',
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Loved by teams who share a lot of links
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card interactive className="flex h-full flex-col p-6">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm text-gray-700 dark:text-gray-300">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="glow-primary flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-semibold text-white">
                    {t.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
