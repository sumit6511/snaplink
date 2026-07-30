import { Navigate, Outlet } from 'react-router-dom';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';

/** Keeps already-authenticated users off the login/register pages. */
export function GuestRoute() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <FullPageSpinner />;
  }

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
