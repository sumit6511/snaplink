import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EmailVerificationBanner } from '@/components/dashboard/EmailVerificationBanner';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { PageTransition } from '@/components/layout/PageTransition';
import { Logo } from '@/components/ui/Logo';

export function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Ambient floating orbs behind the whole dashboard, fixed so they
          don't repaint on scroll — same treatment as the marketing pages,
          kept faint enough not to compete with content. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-orb animate-float-slow -top-32 -left-32 size-96 bg-primary-500/10 dark:bg-primary-500/15" />
        <div className="bg-orb animate-float top-1/2 -right-40 size-96 bg-accent-500/10 dark:bg-accent-500/15" />
      </div>

      <aside className="glass-strong fixed inset-y-0 left-0 z-30 hidden w-64 md:flex">
        <DashboardSidebar />
        <div className="absolute top-6 right-4">
          <ThemeToggle />
        </div>
      </aside>

      <header className="glass-strong sticky top-0 z-40 flex h-16 items-center justify-between px-4 md:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="flex size-10 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-900/5 dark:text-gray-300 dark:hover:bg-white/10"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-gray-950/50 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong fixed inset-y-0 left-0 z-50 w-72 shadow-2xl md:hidden"
            >
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="absolute top-5 right-4 flex size-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-900/5 dark:text-gray-400 dark:hover:bg-white/10"
              >
                <X className="size-5" />
              </button>
              <DashboardSidebar onNavigate={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <EmailVerificationBanner />
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </main>
    </div>
  );
}
