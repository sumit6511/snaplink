import { Moon, Sun } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

export function DashboardSettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account preferences.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white">Appearance</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose how SnapLink looks on this device.
        </p>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => theme !== 'light' && toggleTheme()}
            className={cn(
              'flex flex-1 items-center gap-3 rounded-xl border p-4 text-left transition-colors',
              theme === 'light'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60',
            )}
          >
            <Sun className="size-5 text-gray-700 dark:text-gray-300" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Light</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Bright and clean</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => theme !== 'dark' && toggleTheme()}
            className={cn(
              'flex flex-1 items-center gap-3 rounded-xl border p-4 text-left transition-colors',
              theme === 'dark'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60',
            )}
          >
            <Moon className="size-5 text-gray-700 dark:text-gray-300" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Dark</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Easy on the eyes</p>
            </div>
          </button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white">Account</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Signed in as{' '}
          <span className="font-medium text-gray-700 dark:text-gray-300">{user?.email}</span>.
          Profile editing and password changes aren't available yet.
        </p>
      </Card>
    </div>
  );
}
