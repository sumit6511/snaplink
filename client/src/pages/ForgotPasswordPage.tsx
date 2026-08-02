import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { forgotPasswordRequest } from '@/services/auth.service';
import { getErrorMessage } from '@/utils/errorMessage';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/validators/auth';

export function ForgotPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setFormError(null);
    try {
      await forgotPasswordRequest(values.email);
      setSubmitted(true);
    } catch (error) {
      setFormError(getErrorMessage(error, 'Could not send the reset link.'));
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-medium text-primary-600 dark:text-primary-400">
            Log in
          </Link>
        </>
      }
    >
      {submitted ? (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          If an account exists for that email, we've sent a link to reset your password. It expires
          in 1 hour.
        </p>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          {formError && <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>}

          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
