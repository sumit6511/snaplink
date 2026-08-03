import { ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';

const FAQS = [
  {
    question: 'Is SnapLink free to use?',
    answer:
      'Yes. The Free plan includes 50 short links, QR codes, and basic analytics forever — no credit card required.',
  },
  {
    question: 'Can I use my own custom alias instead of a random code?',
    answer:
      'Yes. When creating a link, you can set a custom alias (like snap.link/summer-sale) instead of the auto-generated short code.',
  },
  {
    question: 'What analytics do I get for each link?',
    answer:
      'Total clicks, click history, last-clicked time, and breakdowns by browser, operating system, device type, country, and referrer.',
  },
  {
    question: 'Can links expire automatically?',
    answer:
      'Yes. Set an optional expiration date when creating or editing a link, and it will stop redirecting once that date passes.',
  },
  {
    question: 'Do you generate QR codes for every link?',
    answer:
      'Every short link automatically gets a downloadable QR code you can use in print materials, packaging, or presentations.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24">
      <Container className="max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="glass group rounded-2xl p-5 transition-shadow open:shadow-lg open:shadow-primary-600/5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-gray-900 marker:content-none dark:text-white">
                {faq.question}
                <ChevronDown className="size-4.5 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
