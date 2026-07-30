import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied by the browser; failing silently is
      // preferable to throwing over a non-critical convenience action.
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      aria-label="Copy short link"
      className={cn(
        'flex size-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200',
        className,
      )}
    >
      {copied ? (
        <Check className="size-4 text-green-600 dark:text-green-400" />
      ) : (
        <Copy className="size-4" />
      )}
    </button>
  );
}
