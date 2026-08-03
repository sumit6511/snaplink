import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useUpdateProfile } from '@/hooks/useUser';
import { formatDate } from '@/utils/format';
import { getErrorMessage } from '@/utils/errorMessage';
import { updateProfileSchema, type UpdateProfileFormValues } from '@/validators/user';

export function DashboardProfilePage() {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    // Controlled by AuthContext's user, which updateUser() refreshes on a
    // successful save — that resync also clears isDirty automatically.
    values: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  // isDirty flips true the instant the user edits again, so gating on it
  // here hides the banner on the next keystroke without a separate effect.
  const showSuccess = success && !isDirty;

  const onSubmit = async (values: UpdateProfileFormValues) => {
    setFormError(null);
    setSuccess(false);
    try {
      await updateProfileMutation.mutateAsync(values);
      setSuccess(true);
    } catch (error) {
      setFormError(getErrorMessage(error, 'Could not update your profile.'));
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your account information.</p>
      </div>

      <Card className="p-8">
        <div className="flex items-center gap-4">
          <div className="glow-primary flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-2xl font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Member since {user?.createdAt ? formatDate(user.createdAt) : '—'}
            </p>
          </div>
        </div>

        <form
          className="mt-8 space-y-4 border-t border-gray-900/5 pt-6 dark:border-white/5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full name" error={errors.name?.message} {...register('name')} />
            <Input
              label="Email address"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          {formError && <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>}
          {showSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400">Profile updated.</p>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
              Save changes
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
