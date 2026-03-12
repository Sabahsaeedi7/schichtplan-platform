import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/client'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { TrendingUp, TrendingDown, Building2, Users, AlertTriangle, DollarSign } from 'lucide-react'
import { clsx } from 'clsx'
import { format } from 'date-fns'

function KpiCard({ title, value, sub, trend, icon: Icon, color = 'blue' }: {
  title: string; value: string | number; sub?: string
  trend?: number; icon: any; color?: string
}) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
    orange: 'text-orange-400 bg-orange-500/10',
    red: 'text-red-400 bg-red-500/10',
  }

  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className={clsx('flex items-center gap-1 text-xs font-medium', trend >= 0 ? 'text-green-400' : 'text-red-400')}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">{title}</div>
        {sub && <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{sub}</div>}
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card !p-3 text-xs">
      <div className="text-[hsl(var(--muted-foreground))] mb-1">{label}</div>
      <div className="font-semibold text-blue-400">{payload[0].value} {payload[0].name}</div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: kpiData, isLoading: kpiLoading } = useQuery({
    queryKey: ['platform', 'kpis'],
    queryFn: () => dashboardApi.kpis().then((r) => r.data.data),
    refetchInterval: 60_000,
  })

  const { data: chartData } = useQuery({
    queryKey: ['platform', 'signups-chart'],
    queryFn: () => dashboardApi.signupsChart(30).then((r) => r.data.data),
  })

  const { data: activity } = useQuery({
    queryKey: ['platform', 'activity'],
    queryFn: () => dashboardApi.recentActivity().then((r) => r.data.data),
  })

  if (kpiLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="kpi-card animate-pulse h-28 !bg-[hsl(var(--card)/0.5)]" />
        ))}
      </div>
    )
  }

  const mrr = kpiData?.mrr
  const tenants = kpiData?.active_tenants
  const users = kpiData?.total_users
  const churn = kpiData?.churn_rate
  const planDist = kpiData?.plan_distribution ?? []

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-white">Platform Dashboard</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Real-time SaaS metrics and activity</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Monthly Recurring Revenue"
          value={`€${mrr?.current?.toLocaleString('de-DE', { minimumFractionDigits: 0 }) ?? 0}`}
          trend={mrr?.trend}
          sub={`Previous: €${mrr?.previous?.toLocaleString('de-DE') ?? 0}`}
          icon={DollarSign}
          color="green"
        />
        <KpiCard
          title="Active Tenants"
          value={tenants?.count ?? 0}
          sub={`+${tenants?.new_this_month ?? 0} this month`}
          icon={Building2}
          color="blue"
        />
        <KpiCard
          title="Suspended Tenants"
          value={tenants?.suspended ?? 0}
          icon={AlertTriangle}
          color="orange"
        />
        <KpiCard
          title="Total Users"
          value={users?.total?.toLocaleString() ?? 0}
          sub={`${users?.active_today ?? 0} active today`}
          icon={Users}
          color="blue"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Signups area chart */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-4">New Signups — Last 30 Days</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData ?? []} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(216 34% 14%)" />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => format(new Date(v), 'dd.MM')}
                tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }}
                tickLine={false} axisLine={false}
                interval={4}
              />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone" dataKey="count" name="Signups"
                stroke="#3b82f6" strokeWidth={2}
                fill="url(#signupGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Plan distribution bar chart */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-4">Plan Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={planDist} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(216 34% 14%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Tenants" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent signups list */}
      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-4">Recent Signups</h2>
        <div className="space-y-1">
          {kpiData?.recent_signups?.length === 0 && (
            <div className="text-sm text-[hsl(var(--muted-foreground))] py-4 text-center">No recent signups</div>
          )}
          {kpiData?.recent_signups?.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between py-2.5 table-row last:border-0">
              <div>
                <div className="text-sm font-medium text-white">{s.name}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">{s.plan}</div>
              </div>
              <div className="text-xs text-[hsl(var(--muted-foreground))]">
                {format(new Date(s.created_at), 'dd.MM.yyyy HH:mm')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent audit activity */}
      {activity && activity.length > 0 && (
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-4">Recent Platform Activity</h2>
          <div className="divide-y divide-[hsl(var(--border))]">
            {activity.slice(0, 10).map((log: any) => (
              <div key={log.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  <span className="text-sm text-[hsl(var(--foreground))]">{log.action}</span>
                </div>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  {format(new Date(log.created_at), 'dd.MM HH:mm')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
