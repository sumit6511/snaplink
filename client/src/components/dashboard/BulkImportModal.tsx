import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useBulkImportLinks } from '@/hooks/useLinks';
import type { BulkImportResult } from '@/services/link.service';
import { getErrorMessage } from '@/utils/errorMessage';
import {
  MAX_BULK_IMPORT_URLS,
  parseBulkImportUrls,
  validateBulkImportUrls,
} from '@/validators/bulkImport';

interface BulkImportModalProps {
  open: boolean;
  onClose: () => void;
}

export function BulkImportModal({ open, onClose }: BulkImportModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Bulk import links" maxWidthClassName="max-w-lg">
      {/* Conditional rendering unmounts/remounts on every open, so each
          open starts from a clean slate without needing an explicit key. */}
      {open && <BulkImportForm onClose={onClose} />}
    </Modal>
  );
}

function BulkImportForm({ onClose }: { onClose: () => void }) {
  const [urlsText, setUrlsText] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const importMutation = useBulkImportLinks();

  const handleImport = async () => {
    setFormError(null);
    setResult(null);

    const urls = parseBulkImportUrls(urlsText);
    const validationError = validateBulkImportUrls(urls);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const data = await importMutation.mutateAsync(urls);
      setResult(data);
      if (data.failed.length === 0) {
        setUrlsText('');
      }
    } catch (error) {
      setFormError(getErrorMessage(error, 'Could not import these links.'));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="bulk-import-urls"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          URLs (one per line)
        </label>
        <textarea
          id="bulk-import-urls"
          rows={8}
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          placeholder={'https://example.com/one\nhttps://example.com/two'}
          className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 font-mono text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          Up to {MAX_BULK_IMPORT_URLS} URLs. Custom aliases and titles aren't supported here — edit
          those individually afterward.
        </p>
      </div>

      {formError && <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>}

      {result && (
        <div className="rounded-xl border border-gray-200 p-3 text-sm dark:border-gray-800">
          <p className="text-green-600 dark:text-green-400">
            Imported {result.created.length} link{result.created.length === 1 ? '' : 's'}.
          </p>
          {result.failed.length > 0 && (
            <div className="mt-2 text-red-600 dark:text-red-400">
              <p>{result.failed.length} failed:</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5">
                {result.failed.map((f) => (
                  <li key={f.url} className="break-all">
                    {f.url} — {f.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          {result ? 'Close' : 'Cancel'}
        </Button>
        <Button
          type="button"
          onClick={() => void handleImport()}
          isLoading={importMutation.isPending}
        >
          Import
        </Button>
      </div>
    </div>
  );
}
