import { BarChart3, LayoutDashboard, Link2, LogOut, Settings, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/links', label: 'Links', icon: Link2, end: false },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, end: false },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings, end: false },
  { to: '/dashboard/profile', label: 'Profile', icon: User, end: false },
];

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:translate-x-0.5 hover:bg-gray-900/5 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white',
                isActive &&
                  'bg-primary-500/10 text-primary-700 ring-1 ring-primary-500/20 hover:translate-x-0 hover:bg-primary-500/10 hover:text-primary-700 dark:text-primary-400 dark:ring-primary-400/20 dark:hover:bg-primary-500/10 dark:hover:text-primary-400',
              )
            }
          >
            <item.icon className="size-4.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-900/5 p-4 dark:border-white/5">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="glow-primary flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {user?.name}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-900/5 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <LogOut className="size-4.5" />
          Log out
        </button>
      </div>
    </div>
  );
}
