import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useCreateLink, useUpdateLink } from '@/hooks/useLinks';
import type { Link } from '@/types/link';
import { getErrorMessage } from '@/utils/errorMessage';
import { linkFormSchema, type LinkFormValues } from '@/validators/link';

interface LinkFormModalProps {
  open: boolean;
  onClose: () => void;
  link?: Link | null;
}

function toDateInputValue(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : '';
}

export function LinkFormModal({ open, onClose, link }: LinkFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={link ? 'Edit link' : 'Create a new link'}>
      {/* Keyed by link id so opening for a different link (or switching
          create <-> edit) mounts a fresh form instead of carrying over
          stale field values or validation state from the previous one. */}
      {open && <LinkForm key={link?.id ?? 'new'} link={link} onClose={onClose} />}
    </Modal>
  );
}

function LinkForm({ link, onClose }: { link?: Link | null; onClose: () => void }) {
  const isEditing = Boolean(link);
  const createMutation = useCreateLink();
  const updateMutation = useUpdateLink();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      originalUrl: link?.originalUrl ?? '',
      customAlias: link?.customAlias ?? '',
      title: link?.title ?? '',
      expiresAt: toDateInputValue(link?.expiresAt),
    },
  });

  const onSubmit = async (values: LinkFormValues) => {
    setFormError(null);

    try {
      if (isEditing && link) {
        // Editing sends explicit null for cleared fields so the backend
        // actually unsets them, not just "leave unchanged".
        await updateMutation.mutateAsync({
          id: link.id,
          input: {
            originalUrl: values.originalUrl,
            customAlias: values.customAlias || null,
            title: values.title || null,
            expiresAt: values.expiresAt || null,
          },
        });
      } else {
        await createMutation.mutateAsync({
          originalUrl: values.originalUrl,
          customAlias: values.customAlias || undefined,
          title: values.title || undefined,
          expiresAt: values.expiresAt || undefined,
        });
      }
      onClose();
    } catch (error) {
      setFormError(getErrorMessage(error, 'Could not save this link.'));
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Destination URL"
        placeholder="https://example.com/your-long-url"
        error={errors.originalUrl?.message}
        {...register('originalUrl')}
      />
      <Input
        label="Title (optional)"
        placeholder="Summer campaign"
        error={errors.title?.message}
        {...register('title')}
      />
      <Input
        label="Custom alias (optional)"
        placeholder="summer-sale"
        error={errors.customAlias?.message}
        {...register('customAlias')}
      />
      <Input
        label="Expiration date (optional)"
        type="date"
        error={errors.expiresAt?.message}
        {...register('expiresAt')}
      />

      {formError && <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? 'Save changes' : 'Create link'}
        </Button>
      </div>
    </form>
  );
}
