import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { buttonClasses } from '@/utils/buttonVariants';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur-lg dark:border-gray-800/70 dark:bg-gray-950/80">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
                  isActive && 'text-gray-900 dark:text-white',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <NavLink to="/login" className={buttonClasses('ghost', 'sm')}>
            Log in
          </NavLink>
          <NavLink to="/register" className={buttonClasses('primary', 'sm')}>
            Get started
          </NavLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex size-10 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-200 dark:border-gray-800 md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-2 flex items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-800">
                <ThemeToggle />
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={buttonClasses('outline', 'sm', 'flex-1')}
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setOpen(false)}
                  className={buttonClasses('primary', 'sm', 'flex-1')}
                >
                  Get started
                </NavLink>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
