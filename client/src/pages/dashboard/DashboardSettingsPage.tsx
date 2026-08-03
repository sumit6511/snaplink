import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useChangePassword } from '@/hooks/useUser';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';
import { getErrorMessage } from '@/utils/errorMessage';
import { changePasswordSchema, type ChangePasswordFormValues } from '@/validators/user';

export function DashboardSettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
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
                ? 'border-primary-500 bg-primary-500/10 ring-1 ring-primary-500/20'
                : 'border-gray-200/80 hover:bg-gray-900/[0.02] dark:border-white/10 dark:hover:bg-white/5',
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
                ? 'border-primary-500 bg-primary-500/10 ring-1 ring-primary-500/20'
                : 'border-gray-200/80 hover:bg-gray-900/[0.02] dark:border-white/10 dark:hover:bg-white/5',
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
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white">Change password</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose a strong password you're not using elsewhere.
        </p>
        <ChangePasswordForm />
      </Card>
    </motion.div>
  );
}

function ChangePasswordForm() {
  const changePasswordMutation = useChangePassword();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setFormError(null);
    setSuccess(false);
    try {
      await changePasswordMutation.mutateAsync(values);
      reset();
      setSuccess(true);
    } catch (error) {
      setFormError(getErrorMessage(error, 'Could not change your password.'));
    }
  };

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Current password"
        type="password"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        {...register('currentPassword')}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmNewPassword?.message}
          {...register('confirmNewPassword')}
        />
      </div>

      {formError && <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>}
      {success && <p className="text-sm text-green-600 dark:text-green-400">Password changed.</p>}

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          Update password
        </Button>
      </div>
    </form>
  );
}
