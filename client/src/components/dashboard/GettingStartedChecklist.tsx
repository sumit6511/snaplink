import { CheckCircle2, Circle, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import type { Link as LinkType, LinkStats } from '@/types/link';
import { cn } from '@/utils/cn';

const DISMISSED_KEY = 'snaplink-onboarding-dismissed';

interface ChecklistItem {
  label: string;
  description: string;
  done: boolean;
  cta?: { to: string; label: string };
}

interface GettingStartedChecklistProps {
  stats: LinkStats | undefined;
  recentLinks: LinkType[] | undefined;
}

export function GettingStartedChecklist({ stats, recentLinks }: GettingStartedChecklistProps) {
  const { user } = useAuth();
  // Read once at mount, same pattern as useTheme's localStorage usage — this
  // is a plain Vite SPA (no SSR), so localStorage is always available here.
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === '1');

  const items: ChecklistItem[] = [
    {
      label: 'Create your first link',
      description: 'Shorten a URL and give it a home on SnapLink.',
      done: (stats?.totalLinks ?? 0) > 0,
      cta: { to: '/dashboard/links', label: 'Create a link' },
    },
    {
      label: 'Verify your email',
      description: 'Confirm your address to keep your account secure.',
      done: Boolean(user?.emailVerified),
    },
    {
      label: 'Get your first click',
      description: 'Share your link and watch the click count move.',
      done: (stats?.totalClicks ?? 0) > 0,
      cta: { to: '/dashboard/links', label: 'Share a link' },
    },
    {
      label: 'Try a custom alias',
      description: 'Swap a random code for something memorable and on-brand.',
      // Only checks the 5 most recent links (what the dashboard already has
      // in hand) — an approximation, not a full account scan. Fine here: once
      // an account has grown past its first few links it's aged out of
      // "getting started" anyway, and this list disappears once every item
      // is done or the user dismisses it.
      done: (recentLinks ?? []).some((link) => Boolean(link.customAlias)),
      cta: { to: '/dashboard/links', label: 'Edit a link' },
    },
  ];

  const doneCount = items.filter((item) => item.done).length;
  const allDone = doneCount === items.length;

  if (dismissed || allDone) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setDismissed(true);
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Getting started</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {doneCount} of {items.length} done
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss getting started checklist"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-600 to-accent-600 transition-[width] duration-300"
          style={{ width: `${(doneCount / items.length) * 100}%` }}
        />
      </div>

      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item.label} className="flex items-start gap-3">
            {item.done ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
            ) : (
              <Circle className="mt-0.5 size-5 shrink-0 text-gray-300 dark:text-gray-700" />
            )}
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'text-sm font-medium',
                  item.done
                    ? 'text-gray-500 line-through dark:text-gray-500'
                    : 'text-gray-900 dark:text-white',
                )}
              >
                {item.label}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
            </div>
            {!item.done && item.cta && (
              <Link
                to={item.cta.to}
                className="shrink-0 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
              >
                {item.cta.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
