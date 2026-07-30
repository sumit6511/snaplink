import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-16 dark:bg-gray-950">
      <Container className="max-w-2xl">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.name}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            This is a placeholder — the full dashboard (sidebar, stats, and your links) is the next
            milestone.
          </p>
          <Button variant="outline" className="mt-8" onClick={() => void logout()}>
            Log out
          </Button>
        </Card>
      </Container>
    </div>
  );
}
