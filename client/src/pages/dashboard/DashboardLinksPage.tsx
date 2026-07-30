import { Card } from '@/components/ui/Card';

export function DashboardLinksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Links</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create, search, and manage all of your shortened links.
        </p>
      </div>

      <Card className="p-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Full link management (create, edit, delete, search, pagination, QR codes) is the next
          milestone.
        </p>
      </Card>
    </div>
  );
}
