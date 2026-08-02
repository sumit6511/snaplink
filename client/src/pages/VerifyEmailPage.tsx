import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { verifyEmailRequest } from '@/services/auth.service';
import { getErrorMessage } from '@/utils/errorMessage';

type Status = 'verifying' | 'success' | 'error';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { user, updateUser } = useAuth();
  // Read through a ref instead of depending on user/updateUser directly:
  // updateUser's identity changes every time it's called (it updates the
  // same AuthContext user state this page reads), so depending on it would
  // re-fire the effect and re-submit the token a second time right after
  // the first success — by then already consumed server-side, so it'd
  // overwrite the success state with a false error.
  const authRef = useRef({ user, updateUser });
  useEffect(() => {
    authRef.current = { user, updateUser };
  });

  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'error');
  const [errorMessage, setErrorMessage] = useState('This verification link is missing its token.');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    verifyEmailRequest(token)
      .then(() => {
        if (cancelled) return;
        setStatus('success');
        const { user: currentUser, updateUser: setAuthUser } = authRef.current;
        if (currentUser) setAuthUser({ ...currentUser, emailVerified: true });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setErrorMessage(getErrorMessage(error, 'Could not verify your email.'));
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <AuthLayout title="Verify your email" subtitle="Confirming your SnapLink email address.">
      {status === 'verifying' && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your email address has been verified.
          </p>
          <Link to={user ? '/dashboard' : '/login'}>
            <Button className="mt-4 w-full" size="lg">
              {user ? 'Continue to dashboard' : 'Log in'}
            </Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <p className="text-center text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
    </AuthLayout>
  );
}
