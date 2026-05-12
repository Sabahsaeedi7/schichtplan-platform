import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { settingsApi } from '@/api/client'
import type { PlatformSetting } from '@/api/types'
import { Save, Send, CheckCircle, XCircle, Loader2 } from 'lucide-react'

const groupLabels: Record<string, string> = {
  smtp: 'SMTP Email Configuration',
  general: 'General Settings',
}

const MASKED_VALUE = '••••••••'

export default function SystemSettingsPage() {
  const qc = useQueryClient()
  // `overrides` tracks values the user has edited in the form. We render
  // `initialValues ∪ overrides` so the form is a pure derivation of server
  // data + edits — no setState-in-effect needed.
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [testEmail, setTestEmail] = useState('')
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['platform', 'settings'],
    queryFn: () => settingsApi.list().then((r) => r.data.data),
  })

  const initialValues = useMemo<Record<string, string>>(() => {
    if (!data) return {}
    const init: Record<string, string> = {}
    data.forEach((s) => {
      if (s.value && s.value !== MASKED_VALUE) init[s.key] = s.value
    })
    return init
  }, [data])

  const values: Record<string, string> = { ...initialValues, ...overrides }
  const dirty = Object.keys(overrides).length > 0

  const saveMut = useMutation({
    mutationFn: () => settingsApi.update(
      Object.entries(values).map(([key, value]) => ({ key, value: value || null }))
    ),
    onSuccess: () => {
      setOverrides({})
      qc.invalidateQueries({ queryKey: ['platform', 'settings'] })
    },
  })

  const testMut = useMutation({
    mutationFn: () => settingsApi.testSmtp(testEmail),
    onSuccess: (r) => setTestResult({ ok: true, msg: r.data.message }),
    onError: (err) => {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message
        : undefined
      setTestResult({ ok: false, msg: message ?? 'Test failed' })
    },
  })

  const handleChange = (key: string, value: string) => {
    setOverrides((o) => ({ ...o, [key]: value }))
  }

  if (isLoading) {
    return <div className="text-[hsl(var(--muted-foreground))] text-sm">Loading settings…</div>
  }

  const settings = data ?? []
  const grouped  = settings.reduce<Record<string, PlatformSetting[]>>((acc, s) => {
    acc[s.group] = acc[s.group] ?? []
    acc[s.group].push(s)
    return acc
  }, {})

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-white">System Settings</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Configure platform-wide settings (stored in database, no restart required)</p>
      </div>

      {Object.entries(grouped).map(([group, groupSettings]) => (
        <div key={group} className="card space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-[hsl(var(--border))] pb-3">
            {groupLabels[group] ?? group}
          </h2>

          {groupSettings.map((s) => (
            <div key={s.key}>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1 capitalize">
                {s.key.replace(/_/g, ' ')}
              </label>
              {s.description && (
                <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1.5">{s.description}</p>
              )}
              <input
                className="input"
                type={s.key.includes('password') ? 'password' : 'text'}
                placeholder={s.value === MASKED_VALUE ? 'Leave blank to keep existing' : `Enter ${s.key}`}
                value={values[s.key] ?? ''}
                onChange={(e) => handleChange(s.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}

      {/* SMTP Test */}
      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-white border-b border-[hsl(var(--border))] pb-3">
          Test SMTP Configuration
        </h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Save your settings first, then send a test email to verify the SMTP connection.
        </p>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            type="email"
            placeholder="your@email.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          <button
            className="btn-primary flex-shrink-0"
            disabled={!testEmail || testMut.isPending}
            onClick={() => { setTestResult(null); testMut.mutate() }}
          >
            {testMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Test
          </button>
        </div>
        {testResult && (
          <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${testResult.ok ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {testResult.ok ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {testResult.msg}
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          className="btn-primary"
          disabled={!dirty || saveMut.isPending}
          onClick={() => saveMut.mutate()}
        >
          {saveMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saveMut.isPending ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
