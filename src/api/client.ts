import axios, { type AxiosResponse } from 'axios'
import type {
  AuthLoginResponse,
  SuperAdminUser,
  DashboardKpis,
  SignupsChartPoint,
  ActivityLogEntry,
  TenantListRow,
  TenantDetail,
  PaginatedResponse,
  ImpersonateResponse,
  FeatureRow,
  PlatformSetting,
  SmtpTestResponse,
  DataEnvelope,
  MessageEnvelope,
} from './types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: `${BASE_URL}/platform`,
  withCredentials: true,
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('platform_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

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
  login: (email: string, password: string): Promise<AxiosResponse<AuthLoginResponse>> =>
    api.post('/login', { email, password }),
  logout: (): Promise<AxiosResponse<MessageEnvelope>> => api.post('/logout'),
  getUser: (): Promise<AxiosResponse<SuperAdminUser>> => api.get('/user'),
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardApi = {
  kpis: (): Promise<AxiosResponse<DataEnvelope<DashboardKpis>>> => api.get('/dashboard/kpis'),
  recentActivity: (): Promise<AxiosResponse<DataEnvelope<ActivityLogEntry[]>>> =>
    api.get('/dashboard/activity'),
  signupsChart: (days?: number): Promise<AxiosResponse<DataEnvelope<SignupsChartPoint[]>>> =>
    api.get('/dashboard/signups-chart', { params: { days } }),
}

// ── Tenants ──────────────────────────────────────────────────────────────────
export const tenantsApi = {
  list: (params?: Record<string, string>): Promise<AxiosResponse<PaginatedResponse<TenantListRow>>> =>
    api.get('/tenants', { params }),
  show: (id: string): Promise<AxiosResponse<DataEnvelope<TenantDetail>>> =>
    api.get(`/tenants/${id}`),
  suspend: (id: string, reason: string): Promise<AxiosResponse<MessageEnvelope>> =>
    api.post(`/tenants/${id}/suspend`, { reason }),
  activate: (id: string): Promise<AxiosResponse<MessageEnvelope>> =>
    api.post(`/tenants/${id}/activate`),
  impersonate: (id: string): Promise<AxiosResponse<ImpersonateResponse>> =>
    api.post(`/tenants/${id}/impersonate`),
  updateSub: (id: string, planId: string): Promise<AxiosResponse<MessageEnvelope>> =>
    api.put(`/tenants/${id}/subscription`, { plan_id: planId }),
}

// ── Feature Overrides ─────────────────────────────────────────────────────────
export const featuresApi = {
  list: (tenantId: string): Promise<AxiosResponse<DataEnvelope<FeatureRow[]>>> =>
    api.get(`/tenants/${tenantId}/features`),
  toggle: (
    tenantId: string,
    featureId: string,
    isEnabled: boolean,
    expiresAt?: string
  ): Promise<AxiosResponse<MessageEnvelope>> =>
    api.post(`/tenants/${tenantId}/features`, {
      feature_id: featureId,
      is_enabled: isEnabled,
      expires_at: expiresAt,
    }),
  remove: (tenantId: string, overrideId: string): Promise<AxiosResponse<MessageEnvelope>> =>
    api.delete(`/tenants/${tenantId}/features/${overrideId}`),
}

// ── Platform Settings ──────────────────────────────────────────────────────────
export const settingsApi = {
  list: (): Promise<AxiosResponse<DataEnvelope<PlatformSetting[]>>> => api.get('/settings'),
  update: (
    settings: { key: string; value: string | null }[]
  ): Promise<AxiosResponse<MessageEnvelope>> => api.put('/settings', { settings }),
  testSmtp: (to: string): Promise<AxiosResponse<SmtpTestResponse>> =>
    api.post('/settings/smtp/test', { to }),
}

// ── Audit / GDPR ──────────────────────────────────────────────────────────────
export const auditApi = {
  logs: (): Promise<AxiosResponse<DataEnvelope<ActivityLogEntry[]>>> => api.get('/gdpr/audit'),
}
