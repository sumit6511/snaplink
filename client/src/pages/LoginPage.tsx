import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/utils/errorMessage';
import { loginSchema, type LoginFormValues } from '@/validators/auth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      await login(values.email, values.password);
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error, 'Invalid email or password.'));
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={
        <>
          New to SnapLink?{' '}
          <Link to="/register" className="font-medium text-primary-600 dark:text-primary-400">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <p className="-mt-2 text-right text-sm">
          <Link
            to="/forgot-password"
            className="font-medium text-primary-600 dark:text-primary-400"
          >
            Forgot password?
          </Link>
        </p>

        {formError && <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>}

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}
