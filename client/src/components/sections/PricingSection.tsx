import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { buttonClasses } from '@/utils/buttonVariants';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { cn } from '@/utils/cn';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For personal projects and trying SnapLink out.',
    features: ['50 short links', 'Basic click analytics', 'QR codes', '7-day click history'],
    cta: 'Get started free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'For creators and small teams who share links every day.',
    features: [
      'Unlimited short links',
      'Full analytics dashboard',
      'Custom aliases & expiration',
      '1-year click history',
      'CSV export',
    ],
    cta: 'Start free trial',
    featured: true,
  },
  {
    name: 'Business',
    price: '$39',
    period: 'per month',
    description: 'For teams that need collaboration and higher limits.',
    features: [
      'Everything in Pro',
      'Team members & roles',
      'Custom domains',
      'Priority support',
      'Unlimited click history',
    ],
    cta: 'Contact sales',
    featured: false,
  },
];

interface PricingSectionProps {
  showHeading?: boolean;
}

export function PricingSection({ showHeading = true }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-24">
      <Container>
        {showHeading && (
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Start free. Upgrade when you need more links, more history, or more teammates.
            </p>
          </div>
        )}

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card
                className={cn(
                  'flex h-full flex-col p-8',
                  plan.featured &&
                    'border-primary-300 ring-2 ring-primary-500/40 dark:border-primary-500/40',
                )}
              >
                {plan.featured && (
                  <Badge variant="primary" className="mb-4 w-fit">
                    Most popular
                  </Badge>
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{plan.period}</span>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary-600 dark:text-primary-400" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={cn(
                    'mt-8 w-full',
                    buttonClasses(plan.featured ? 'primary' : 'outline', 'md', 'w-full'),
                  )}
                >
                  {plan.cta}
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
