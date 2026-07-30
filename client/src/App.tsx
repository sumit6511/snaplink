import { Route, Routes } from 'react-router-dom';
import { GuestRoute } from '@/components/GuestRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AboutPage } from '@/pages/AboutPage';
import { DashboardAnalyticsPage } from '@/pages/dashboard/DashboardAnalyticsPage';
import { DashboardHomePage } from '@/pages/dashboard/DashboardHomePage';
import { DashboardLinksPage } from '@/pages/dashboard/DashboardLinksPage';
import { DashboardProfilePage } from '@/pages/dashboard/DashboardProfilePage';
import { DashboardSettingsPage } from '@/pages/dashboard/DashboardSettingsPage';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PricingPage } from '@/pages/PricingPage';
import { RegisterPage } from '@/pages/RegisterPage';

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
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardHomePage />} />
          <Route path="dashboard/links" element={<DashboardLinksPage />} />
          <Route path="dashboard/analytics" element={<DashboardAnalyticsPage />} />
          <Route path="dashboard/settings" element={<DashboardSettingsPage />} />
          <Route path="dashboard/profile" element={<DashboardProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
