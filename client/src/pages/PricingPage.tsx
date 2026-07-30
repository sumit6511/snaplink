import { motion } from 'framer-motion';
import { CTASection } from '@/components/sections/CTASection';
import { FAQ } from '@/components/sections/FAQ';
import { PricingSection } from '@/components/sections/PricingSection';
import { Container } from '@/components/ui/Container';

export function PricingPage() {
  return (
    <>
      <section className="pt-20 pb-4 sm:pt-28">
        <Container className="max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              Pricing that grows with you
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
              Start free, no credit card needed. Upgrade whenever you outgrow the basics.
            </p>
          </motion.div>
        </Container>
      </section>

      <PricingSection showHeading={false} />
      <FAQ />
      <CTASection />
    </>
  );
}
