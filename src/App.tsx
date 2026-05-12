import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { useAuth } from '@/hooks/useAuth'
import { PlatformAppShell } from '@/components/layout/PlatformAppShell'
import { Toaster } from '@/components/ui/toaster'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import TenantsPage from '@/pages/TenantsPage'
import TenantDetailPage from '@/pages/TenantDetailPage'
import SystemSettingsPage from '@/pages/SystemSettingsPage'
import MarketingIndex from '@/pages/Marketing/MarketingIndex'
import SeoEditor from '@/pages/Marketing/editors/SeoEditor'
import BrandEditor from '@/pages/Marketing/editors/BrandEditor'
import HeroEditor from '@/pages/Marketing/editors/HeroEditor'
import SectionsEditor from '@/pages/Marketing/editors/SectionsEditor'
import NavLinksEditor from '@/pages/Marketing/editors/NavLinksEditor'
import IndustriesEditor from '@/pages/Marketing/editors/IndustriesEditor'
import FeaturesEditor from '@/pages/Marketing/editors/FeaturesEditor'
import StepsEditor from '@/pages/Marketing/editors/StepsEditor'
import TestimonialsEditor from '@/pages/Marketing/editors/TestimonialsEditor'
import FaqsEditor from '@/pages/Marketing/editors/FaqsEditor'
import PricingPlansEditor from '@/pages/Marketing/editors/PricingPlansEditor'
import PricingFeaturesEditor from '@/pages/Marketing/editors/PricingFeaturesEditor'
import FooterEditor from '@/pages/Marketing/editors/FooterEditor'
import LegalDocumentsEditor from '@/pages/Marketing/editors/LegalDocumentsEditor'
import BillingPage from '@/pages/BillingPage'
import PlansPage from '@/pages/PlansPage'
import AuditLogsPage from '@/pages/AuditLogsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

function ProtectedRoutes() {
  const { admin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[hsl(var(--background))]">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!admin) return <Navigate to="/login" replace />

  return (
    <PlatformAppShell>
      <Routes>
        <Route path="/"            element={<DashboardPage />} />
        <Route path="/tenants"     element={<TenantsPage />} />
        <Route path="/tenants/:id" element={<TenantDetailPage />} />

        {/* Marketing CMS */}
        <Route path="/marketing"                  element={<MarketingIndex />} />
        <Route path="/marketing/seo"              element={<SeoEditor />} />
        <Route path="/marketing/brand"            element={<BrandEditor />} />
        <Route path="/marketing/hero"             element={<HeroEditor />} />
        <Route path="/marketing/sections"         element={<SectionsEditor />} />
        <Route path="/marketing/nav-links"        element={<NavLinksEditor />} />
        <Route path="/marketing/industries"       element={<IndustriesEditor />} />
        <Route path="/marketing/features"         element={<FeaturesEditor />} />
        <Route path="/marketing/steps"            element={<StepsEditor />} />
        <Route path="/marketing/testimonials"     element={<TestimonialsEditor />} />
        <Route path="/marketing/faqs"             element={<FaqsEditor />} />
        <Route path="/marketing/pricing-plans"    element={<PricingPlansEditor />} />
        <Route path="/marketing/pricing-features" element={<PricingFeaturesEditor />} />
        <Route path="/marketing/footer"           element={<FooterEditor />} />
        <Route path="/marketing/legal"            element={<LegalDocumentsEditor />} />

        <Route path="/billing"     element={<BillingPage />} />
        <Route path="/plans"       element={<PlansPage />} />
        <Route path="/audit"       element={<AuditLogsPage />} />
        <Route path="/settings"    element={<SystemSettingsPage />} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </PlatformAppShell>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*"    element={<ProtectedRoutes />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}
