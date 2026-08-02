import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { GuestRoute } from '@/components/GuestRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { AboutPage } from '@/pages/AboutPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PricingPage } from '@/pages/PricingPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { VerifyEmailPage } from '@/pages/VerifyEmailPage';

// Code-split: Chart.js and the rest of the authenticated dashboard have no
// business being in the bundle a first-time visitor downloads to read the
// marketing pages or log in.
const DashboardHomePage = lazy(() =>
  import('@/pages/dashboard/DashboardHomePage').then((m) => ({ default: m.DashboardHomePage })),
);
const DashboardLinksPage = lazy(() =>
  import('@/pages/dashboard/DashboardLinksPage').then((m) => ({ default: m.DashboardLinksPage })),
);
const DashboardAnalyticsPage = lazy(() =>
  import('@/pages/dashboard/DashboardAnalyticsPage').then((m) => ({
    default: m.DashboardAnalyticsPage,
  })),
);
const DashboardSettingsPage = lazy(() =>
  import('@/pages/dashboard/DashboardSettingsPage').then((m) => ({
    default: m.DashboardSettingsPage,
  })),
);
const DashboardProfilePage = lazy(() =>
  import('@/pages/dashboard/DashboardProfilePage').then((m) => ({
    default: m.DashboardProfilePage,
  })),
);

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="pricing" element={<PricingPage />} />
      </Route>

      <Route element={<GuestRoute />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Not under GuestRoute: registration auto-logs-in, so a user who
          clicks their verification link is often still authenticated and
          would otherwise get redirected away before seeing the result. */}
      <Route path="verify-email" element={<VerifyEmailPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<FullPageSpinner />}>
                <DashboardHomePage />
              </Suspense>
            }
          />
          <Route
            path="dashboard/links"
            element={
              <Suspense fallback={<FullPageSpinner />}>
                <DashboardLinksPage />
              </Suspense>
            }
          />
          <Route
            path="dashboard/analytics"
            element={
              <Suspense fallback={<FullPageSpinner />}>
                <DashboardAnalyticsPage />
              </Suspense>
            }
          />
          <Route
            path="dashboard/analytics/:id"
            element={
              <Suspense fallback={<FullPageSpinner />}>
                <DashboardAnalyticsPage />
              </Suspense>
            }
          />
          <Route
            path="dashboard/settings"
            element={
              <Suspense fallback={<FullPageSpinner />}>
                <DashboardSettingsPage />
              </Suspense>
            }
          />
          <Route
            path="dashboard/profile"
            element={
              <Suspense fallback={<FullPageSpinner />}>
                <DashboardProfilePage />
              </Suspense>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
