import {
  BarChart3,
  Download,
  Pencil,
  PlusCircle,
  QrCode,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { BulkImportModal } from '@/components/dashboard/BulkImportModal';
import { CopyButton } from '@/components/dashboard/CopyButton';
import { LinkFormModal } from '@/components/dashboard/LinkFormModal';
import { QrCodeModal } from '@/components/dashboard/QrCodeModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDeleteLink, useLinks } from '@/hooks/useLinks';
import { exportLinksCsvRequest } from '@/services/link.service';
import type { Link } from '@/types/link';
import { downloadBlob } from '@/utils/downloadBlob';
import { formatDate, formatNumber } from '@/utils/format';
import { getShortUrl, getShortUrlDisplay } from '@/utils/shortLink';

const PAGE_SIZE = 10;

export function DashboardLinksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 350);

  const [formOpen, setFormOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [qrLink, setQrLink] = useState<Link | null>(null);
  const [deletingLink, setDeletingLink] = useState<Link | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, isError } = useLinks({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });
  const deleteMutation = useDeleteLink();

  const exportCsv = async () => {
    setIsExporting(true);
    try {
      const blob = await exportLinksCsvRequest(debouncedSearch || undefined);
      downloadBlob(blob, `snaplink-links-${new Date().toISOString().slice(0, 10)}.csv`);
    } finally {
      setIsExporting(false);
    }
  };

  const openCreate = () => {
    setEditingLink(null);
    setFormOpen(true);
  };

  const openEdit = (link: Link) => {
    setEditingLink(link);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingLink) return;
    await deleteMutation.mutateAsync(deletingLink.id);
    setDeletingLink(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Links</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create, search, and manage all of your shortened links.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setBulkImportOpen(true)}>
            <Download className="size-4" />
            Bulk import
          </Button>
          <Button variant="outline" onClick={() => void exportCsv()} isLoading={isExporting}>
            <Upload className="size-4" />
            Export CSV
          </Button>
          <Button onClick={openCreate}>
            <PlusCircle className="size-4" />
            New link
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="relative max-w-sm">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by URL, title, or alias..."
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : isError ? (
          <p className="py-16 text-center text-sm text-red-600 dark:text-red-400">
            Could not load your links. Please try again.
          </p>
        ) : !data || data.links.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {debouncedSearch
                ? 'No links match your search.'
                : "You haven't created any links yet."}
            </p>
            {!debouncedSearch && (
              <Button onClick={openCreate} className="mt-4">
                Create your first link
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-4 -mx-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs tracking-wide text-gray-500 uppercase dark:border-gray-800 dark:text-gray-400">
                  <th className="px-6 py-3 font-medium">Link</th>
                  <th className="px-6 py-3 font-medium">Clicks</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Created</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.links.map((link) => (
                  <tr key={link.id}>
                    <td className="max-w-xs px-6 py-4">
                      <p className="truncate font-medium text-gray-900 dark:text-white">
                        {link.title || link.originalUrl}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <a
                          href={getShortUrl(link)}
                          target="_blank"
                          rel="noreferrer"
                          className="truncate font-mono text-xs text-primary-600 hover:underline dark:text-primary-400"
                        >
                          {getShortUrlDisplay(link)}
                        </a>
                        <CopyButton value={getShortUrl(link)} className="size-6 shrink-0" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {formatNumber(link.clicks)}
                    </td>
                    <td className="px-6 py-4">
                      {link.isExpired ? (
                        <Badge variant="red">Expired</Badge>
                      ) : (
                        <Badge variant="green">Active</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {formatDate(link.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <RouterLink
                          to={`/dashboard/analytics/${link.id}`}
                          aria-label="View analytics"
                          className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                          <BarChart3 className="size-4" />
                        </RouterLink>
                        <button
                          type="button"
                          onClick={() => setQrLink(link)}
                          aria-label="Show QR code"
                          className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                          <QrCode className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(link)}
                          aria-label="Edit link"
                          className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingLink(link)}
                          aria-label="Delete link"
                          className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && (
          <div className="mt-4">
            <Pagination pagination={data.pagination} onPageChange={setPage} />
          </div>
        )}
      </Card>

      <LinkFormModal open={formOpen} onClose={() => setFormOpen(false)} link={editingLink} />
      <BulkImportModal open={bulkImportOpen} onClose={() => setBulkImportOpen(false)} />
      <QrCodeModal open={Boolean(qrLink)} onClose={() => setQrLink(null)} link={qrLink} />
      <ConfirmDialog
        open={Boolean(deletingLink)}
        title="Delete link"
        description={`This will permanently delete "${deletingLink?.title || deletingLink?.originalUrl}" and all of its click history. This can't be undone.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeletingLink(null)}
      />
    </div>
  );
}
