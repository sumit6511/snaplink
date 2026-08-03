import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { buttonClasses } from '@/utils/buttonVariants';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { status, logout } = useAuth();
  const isAuthenticated = status === 'authenticated';

  return (
    <header className="glass-strong sticky top-0 z-50">
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
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={buttonClasses('ghost', 'sm')}>
                Dashboard
              </NavLink>
              <button
                type="button"
                onClick={() => void logout()}
                className={buttonClasses('outline', 'sm')}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={buttonClasses('ghost', 'sm')}>
                Log in
              </NavLink>
              <NavLink to="/register" className={buttonClasses('primary', 'sm')}>
                Get started
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex size-10 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-900/5 dark:text-gray-300 dark:hover:bg-white/10 md:hidden"
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
            className="glass-strong overflow-hidden border-t-0 md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-900/5 dark:text-gray-200 dark:hover:bg-white/10"
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-2 flex items-center gap-2 border-t border-gray-900/10 pt-4 dark:border-white/10">
                <ThemeToggle />
                {isAuthenticated ? (
                  <>
                    <NavLink
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className={buttonClasses('ghost', 'sm', 'flex-1')}
                    >
                      Dashboard
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        void logout();
                      }}
                      className={buttonClasses('outline', 'sm', 'flex-1')}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
