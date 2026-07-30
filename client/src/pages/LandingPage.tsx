import { CTASection } from '@/components/sections/CTASection';
import { FAQ } from '@/components/sections/FAQ';
import { Features } from '@/components/sections/Features';
import { Hero } from '@/components/sections/Hero';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { PricingSection } from '@/components/sections/PricingSection';
import { Testimonials } from '@/components/sections/Testimonials';

export function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <CTASection />
    </>
  );
}
