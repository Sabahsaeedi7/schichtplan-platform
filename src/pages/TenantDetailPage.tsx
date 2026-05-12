import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tenantsApi, featuresApi } from '@/api/client'
import { ArrowLeft, Building2, Users, CreditCard, LogIn, PlayCircle, Zap } from 'lucide-react'
import { format } from 'date-fns'
import { clsx } from 'clsx'
import { useState } from 'react'

export default function TenantDetailPage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc       = useQueryClient()

  const [tab, setTab] = useState<'overview' | 'features'>('overview')

  const { data: tenant, isLoading } = useQuery({
    queryKey: ['platform', 'tenant', id],
    queryFn: () => tenantsApi.show(id!).then((r) => r.data.data),
    enabled: !!id,
  })

  const { data: features } = useQuery({
    queryKey: ['platform', 'tenant-features', id],
    queryFn: () => featuresApi.list(id!).then((r) => r.data.data),
    enabled: !!id && tab === 'features',
  })

  const activateMut = useMutation({
    mutationFn: () => tenantsApi.activate(id!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'tenant', id] }),
  })

  const impersonateMut = useMutation({
    mutationFn: () => tenantsApi.impersonate(id!),
    onSuccess: (res) => {
      const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173'
      window.open(`${appUrl}/impersonate?token=${res.data.token}`, '_blank')
    },
  })

  const featureMut = useMutation({
    mutationFn: ({ featureId, isEnabled }: { featureId: string; isEnabled: boolean }) =>
      featuresApi.toggle(id!, featureId, isEnabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'tenant-features', id] }),
  })

  if (isLoading) {
    return <div className="text-sm text-[hsl(var(--muted-foreground))] py-8 text-center">Loading tenant…</div>
  }

  if (!tenant) {
    return <div className="text-sm text-red-400 py-8 text-center">Tenant not found</div>
  }

  const statusBadge = tenant.status === 'active' ? 'badge-active' : 'badge-suspended'

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Back + Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => navigate('/tenants')} className="btn-ghost !p-2 mt-0.5">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white truncate">{tenant.name}</h1>
            <span className={statusBadge}>{tenant.status ?? 'active'}</span>
          </div>
          <div className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">{tenant.country_code}</div>
        </div>
        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => impersonateMut.mutate()} className="btn-ghost text-xs">
            <LogIn className="w-3.5 h-3.5" /> Impersonate
          </button>
          {tenant.status === 'suspended' && (
            <button onClick={() => activateMut.mutate()} className="btn-primary text-xs">
              <PlayCircle className="w-3.5 h-3.5" /> Activate
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[hsl(var(--border))]">
        {(['overview', 'features'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx(
              'px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors',
              tab === t
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
            )}
          >{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subscription */}
          <div className="card space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <CreditCard className="w-4 h-4 text-blue-400" /> Subscription
            </div>
            <div className="space-y-2 text-sm">
              <Row label="Plan" value={tenant.plan} />
              <Row label="Status" value={<span className={statusBadge}>{tenant.subscription_status ?? 'none'}</span>} />
              <Row label="Provider" value={tenant.payment_provider ?? '—'} />
              <Row label="Current Period" value={
                tenant.period_end
                  ? format(new Date(tenant.period_end), 'dd.MM.yyyy')
                  : '—'
              } />
            </div>
          </div>

          {/* Company Info */}
          <div className="card space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Building2 className="w-4 h-4 text-blue-400" /> Company Info
            </div>
            <div className="space-y-2 text-sm">
              <Row label="ID" value={<code className="text-xs font-mono text-blue-400">{tenant.id}</code>} />
              <Row label="Phone" value={tenant.phone ?? '—'} />
              <Row label="Address" value={tenant.address ?? '—'} />
              <Row label="Created" value={format(new Date(tenant.created_at), 'dd.MM.yyyy')} />
            </div>
          </div>

          {/* Users */}
          <div className="card space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Users className="w-4 h-4 text-blue-400" /> Users
            </div>
            <div className="space-y-2 text-sm">
              <Row label="Total Users" value={tenant.users_count} />
              <Row label="Total Employees" value={tenant.employees_count} />
              <Row label="Employee Limit" value={tenant.employee_limit ?? '—'} />
            </div>
          </div>
        </div>
      )}

      {tab === 'features' && (
        <div className="card space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-white border-b border-[hsl(var(--border))] pb-3 mb-3">
            <Zap className="w-4 h-4 text-blue-400" /> Feature Overrides
            <span className="text-xs text-[hsl(var(--muted-foreground))] ml-1 font-normal">(overrides plan defaults)</span>
          </div>
          {!features && <div className="text-sm text-[hsl(var(--muted-foreground))]">Loading features…</div>}
          {features?.map((f) => {
            const override = f.override
            return (
              <div key={f.id} className="flex items-center justify-between py-2.5 table-row last:border-0">
                <div>
                  <div className="text-sm font-medium text-white">{f.name}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">
                    {f.in_plan ? '✓ In plan' : '✗ Not in plan'}
                    {override && (
                      <span className={clsx('ml-2', override.is_enabled ? 'text-green-400' : 'text-red-400')}>
                        {override.is_enabled ? '→ Enabled by override' : '→ Disabled by override'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {override ? (
                    <button
                      onClick={() => featureMut.mutate({ featureId: f.id, isEnabled: !override.is_enabled })}
                      className={clsx('btn text-xs !px-2.5 !py-1', override.is_enabled ? 'btn-danger' : 'btn-primary')}
                    >
                      {override.is_enabled ? 'Disable' : 'Enable'}
                    </button>
                  ) : (
                    <button
                      onClick={() => featureMut.mutate({ featureId: f.id, isEnabled: true })}
                      className="btn-ghost text-xs text-green-400 hover:bg-green-500/10"
                    >+ Grant Override</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-[hsl(var(--muted-foreground))] flex-shrink-0">{label}</span>
      <span className="text-[hsl(var(--foreground))] text-right">{value}</span>
    </div>
  )
}
