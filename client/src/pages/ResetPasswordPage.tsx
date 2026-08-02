import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { resetPasswordRequest } from '@/services/auth.service';
import { getErrorMessage } from '@/utils/errorMessage';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/validators/auth';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) return;
    setFormError(null);
    try {
      await resetPasswordRequest({ token, newPassword: values.newPassword });
      setSubmitted(true);
    } catch (error) {
      setFormError(getErrorMessage(error, 'Could not reset your password.'));
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        <>
          Remembered it after all?{' '}
          <Link to="/login" className="font-medium text-primary-600 dark:text-primary-400">
            Log in
          </Link>
        </>
      }
    >
      {!token ? (
        <p className="text-center text-sm text-red-600 dark:text-red-400">
          This reset link is missing its token. Request a new one from the{' '}
          <Link to="/forgot-password" className="font-medium underline">
            forgot password
          </Link>{' '}
          page.
        </p>
      ) : submitted ? (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Your password has been reset.</p>
          <Link to="/login">
            <Button className="mt-4 w-full" size="lg">
              Log in
            </Button>
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            error={errors.confirmNewPassword?.message}
            {...register('confirmNewPassword')}
          />

          {formError && <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>}

          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            Reset password
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
