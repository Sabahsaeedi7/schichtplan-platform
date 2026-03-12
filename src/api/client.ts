import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: `${BASE_URL}/platform`,
  withCredentials: true,
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
})

// Attach Bearer token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('platform_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('platform_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login:   (email: string, password: string) => api.post('/login', { email, password }),
  logout:  ()                                => api.post('/logout'),
  getUser: ()                                => api.get('/user'),
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardApi = {
  kpis:          () => api.get('/dashboard/kpis'),
  recentActivity:() => api.get('/dashboard/activity'),
  signupsChart:  (days?: number) => api.get('/dashboard/signups-chart', { params: { days } }),
}

// ── Tenants ──────────────────────────────────────────────────────────────────
export const tenantsApi = {
  list:       (params?: Record<string, string>) => api.get('/tenants', { params }),
  show:       (id: string)                      => api.get(`/tenants/${id}`),
  suspend:    (id: string, reason: string)      => api.post(`/tenants/${id}/suspend`, { reason }),
  activate:   (id: string)                      => api.post(`/tenants/${id}/activate`),
  impersonate:(id: string)                      => api.post(`/tenants/${id}/impersonate`),
  updateSub:  (id: string, planId: string)      => api.put(`/tenants/${id}/subscription`, { plan_id: planId }),
}

// ── Feature Overrides ─────────────────────────────────────────────────────────
export const featuresApi = {
  list:   (tenantId: string) => api.get(`/tenants/${tenantId}/features`),
  toggle: (tenantId: string, featureId: string, isEnabled: boolean, expiresAt?: string) =>
    api.post(`/tenants/${tenantId}/features`, { feature_id: featureId, is_enabled: isEnabled, expires_at: expiresAt }),
  remove: (tenantId: string, overrideId: string) =>
    api.delete(`/tenants/${tenantId}/features/${overrideId}`),
}

// ── Platform Settings ──────────────────────────────────────────────────────────
export const settingsApi = {
  list:     ()                                                => api.get('/settings'),
  update:   (settings: { key: string; value: string | null }[]) => api.put('/settings', { settings }),
  testSmtp: (to: string)                                      => api.post('/settings/smtp/test', { to }),
}

// ── Audit / GDPR ──────────────────────────────────────────────────────────────
export const auditApi = {
  logs: () => api.get('/gdpr/audit'),
}
