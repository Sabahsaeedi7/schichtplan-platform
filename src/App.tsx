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
import MarketingPage from '@/pages/MarketingPage'
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
        <Route path="/marketing/*" element={<MarketingPage />} />
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
