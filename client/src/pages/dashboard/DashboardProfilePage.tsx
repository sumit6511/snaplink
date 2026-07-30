import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/utils/format';

export function DashboardProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your account information.</p>
      </div>

      <Card className="p-8">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-2xl font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2 dark:border-gray-800">
          <div>
            <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Full name
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Email address
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Member since
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {user?.createdAt ? formatDate(user.createdAt) : '—'}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
