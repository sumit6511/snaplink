import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { Link } from '@/types/link';
import { getShortUrlDisplay } from '@/utils/shortLink';

interface QrCodeModalProps {
  open: boolean;
  onClose: () => void;
  link: Link | null;
}

export function QrCodeModal({ open, onClose, link }: QrCodeModalProps) {
  if (!link) return null;

  return (
    <Modal open={open} onClose={onClose} title="QR code">
      <div className="flex flex-col items-center">
        {link.qrCode ? (
          <img
            src={link.qrCode}
            alt={`QR code for ${getShortUrlDisplay(link)}`}
            className="size-56 rounded-xl border border-gray-200 dark:border-gray-800"
          />
        ) : (
          <div className="flex size-56 items-center justify-center rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 dark:border-gray-700">
            No QR code available
          </div>
        )}
        <p className="mt-4 font-mono text-sm text-primary-600 dark:text-primary-400">
          {getShortUrlDisplay(link)}
        </p>

        {link.qrCode && (
          <a
            href={link.qrCode}
            download={`snaplink-${link.customAlias || link.shortCode}.png`}
            className="mt-6 w-full"
          >
            <Button className="w-full">
              <Download className="size-4" />
              Download QR code
            </Button>
          </a>
        )}
      </div>
    </Modal>
  );
}
