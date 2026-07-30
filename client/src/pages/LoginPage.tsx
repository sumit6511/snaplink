import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginSchema, type LoginFormValues } from '@/validators/auth';

export function LoginPage() {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    // Wired up to POST /api/auth/login in the next milestone (auth context +
    // protected routes). For now this validates and simulates the request.
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.info('Login submitted', values);
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

        {formError && <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>}

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}
