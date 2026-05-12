/**
 * Typed shapes for the responses returned by `/api/v1/platform/*`.
 *
 * Keep these in sync with `app/Http/Controllers/Platform/*` in schichtplan-api.
 * When unsure, the canonical source of truth is the Laravel resource / controller
 * that produces the payload.
 */

export interface SuperAdminUser {
  id: string
  name: string
  email: string
}

export interface AuthLoginResponse {
  token: string
  user: SuperAdminUser
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface MrrKpi {
  current: number
  previous: number
  trend: number
}

export interface TenantsKpi {
  count: number
  new_this_month: number
  suspended: number
}

export interface UsersKpi {
  total: number
  active_today: number
}

export interface PlanDistributionRow {
  name: string
  count: number
}

export interface RecentSignup {
  id: string
  name: string
  plan: string
  created_at: string
}

export interface DashboardKpis {
  mrr?: MrrKpi
  active_tenants?: TenantsKpi
  total_users?: UsersKpi
  churn_rate?: number
  plan_distribution?: PlanDistributionRow[]
  recent_signups?: RecentSignup[]
}

export interface SignupsChartPoint {
  date: string
  count: number
}

export interface ActivityLogEntry {
  id: string
  action: string
  created_at: string
}

// ─── Tenants ──────────────────────────────────────────────────────────────────

export type TenantStatus = 'active' | 'suspended'

export interface TenantListRow {
  id: string
  name: string
  country_code: string
  status: TenantStatus
  plan: string
  users_count: number
  employees_count: number
  created_at: string
}

export interface TenantDetail extends TenantListRow {
  phone?: string | null
  address?: string | null
  subscription_status?: string | null
  payment_provider?: string | null
  period_end?: string | null
  employee_limit?: number | null
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
  links?: {
    first?: string
    last?: string
    prev?: string | null
    next?: string | null
  }
}

export interface ImpersonateResponse {
  token: string
}

// ─── Feature overrides ────────────────────────────────────────────────────────

export interface FeatureOverride {
  id: string
  is_enabled: boolean
  expires_at?: string | null
}

export interface FeatureRow {
  id: string
  name: string
  in_plan: boolean
  override?: FeatureOverride | null
}

// ─── Platform settings ────────────────────────────────────────────────────────

export interface PlatformSetting {
  key: string
  value: string | null
  type: string
  group: string
  description: string
}

export interface SmtpTestResponse {
  message: string
}

// ─── Common envelopes ─────────────────────────────────────────────────────────

export interface DataEnvelope<T> {
  data: T
}

export interface MessageEnvelope {
  message: string
}
