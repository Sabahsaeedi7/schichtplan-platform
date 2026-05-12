import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tenantsApi } from '@/api/client'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown, Eye, PauseCircle, PlayCircle, LogIn } from 'lucide-react'
import { format } from 'date-fns'
import { clsx } from 'clsx'

const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active',     value: 'active' },
  { label: 'Suspended',  value: 'suspended' },
]

export default function TenantsPage() {
  const navigate     = useNavigate()
  const qc           = useQueryClient()
  const [search, setSearch]   = useState('')
  const [status, setStatus]   = useState('')
  const [page, setPage]       = useState(1)
  const [suspendId, setSuspendId] = useState<string | null>(null)
  const [suspendReason, setSuspendReason] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['platform', 'tenants', { search, status, page }],
    queryFn: () => tenantsApi.list({ search, status, page: String(page), per_page: '20' }).then((r) => r.data),
  })

  const suspendMut = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => tenantsApi.suspend(id, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['platform', 'tenants'] }); setSuspendId(null); setSuspendReason('') },
  })

  const activateMut = useMutation({
    mutationFn: (id: string) => tenantsApi.activate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'tenants'] }),
  })

  const impersonateMut = useMutation({
    mutationFn: (id: string) => tenantsApi.impersonate(id),
    onSuccess: (res) => {
      const { token } = res.data
      const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173'
      window.open(`${appUrl}/impersonate?token=${token}`, '_blank')
    },
  })

  const tenants = data?.data ?? []
  const meta    = data?.meta

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Tenants</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Manage all company accounts</p>
        </div>
        {meta && (
          <div className="badge bg-blue-500/10 text-blue-400 text-sm px-3 py-1">
            {meta.total} total
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="card !p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input
            className="input pl-9"
            placeholder="Search by company name…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="relative">
          <select
            className="input appearance-none pr-8 w-40"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          >
            {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-medium">Company</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Plan</th>
                <th className="px-4 py-3 text-right font-medium">Users</th>
                <th className="px-4 py-3 text-right font-medium">Employees</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-[hsl(var(--muted-foreground))]">Loading…</td></tr>
              )}
              {!isLoading && tenants.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-[hsl(var(--muted-foreground))]">No tenants found</td></tr>
              )}
              {tenants.map((t) => (
                <tr key={t.id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{t.name}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">{t.country_code}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx(t.status === 'active' ? 'badge-active' : 'badge-suspended')}>
                      {t.status ?? 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[hsl(var(--foreground))]">{t.plan}</td>
                  <td className="px-4 py-3 text-right text-[hsl(var(--muted-foreground))]">{t.users_count}</td>
                  <td className="px-4 py-3 text-right text-[hsl(var(--muted-foreground))]">{t.employees_count}</td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))] text-xs">
                    {format(new Date(t.created_at), 'dd.MM.yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/tenants/${t.id}`)}
                        className="btn-ghost !px-2 !py-1 text-xs"
                        title="View detail"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => impersonateMut.mutate(t.id)}
                        className="btn-ghost !px-2 !py-1 text-xs"
                        title="Login as tenant"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                      </button>
                      {(t.status ?? 'active') === 'active' ? (
                        <button
                          onClick={() => setSuspendId(t.id)}
                          className="btn-ghost !px-2 !py-1 text-xs text-orange-400 hover:bg-orange-500/10"
                          title="Suspend tenant"
                        >
                          <PauseCircle className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => activateMut.mutate(t.id)}
                          className="btn-ghost !px-2 !py-1 text-xs text-green-400 hover:bg-green-500/10"
                          title="Activate tenant"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--border))] text-sm">
            <span className="text-[hsl(var(--muted-foreground))]">
              Page {meta.current_page} of {meta.last_page}
            </span>
            <div className="flex gap-2">
              <button
                disabled={meta.current_page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-ghost disabled:opacity-40"
              >Previous</button>
              <button
                disabled={meta.current_page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="btn-ghost disabled:opacity-40"
              >Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Suspend modal */}
      {suspendId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="card w-full max-w-sm space-y-4">
            <h2 className="text-base font-semibold text-white">Suspend Tenant</h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Please provide a reason for suspension. The tenant will be notified.
            </p>
            <textarea
              className="input h-24 resize-none"
              placeholder="Reason for suspension…"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button className="btn-ghost" onClick={() => setSuspendId(null)}>Cancel</button>
              <button
                className="btn-danger"
                disabled={!suspendReason.trim() || suspendMut.isPending}
                onClick={() => suspendMut.mutate({ id: suspendId!, reason: suspendReason })}
              >
                {suspendMut.isPending ? 'Suspending…' : 'Suspend Tenant'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
