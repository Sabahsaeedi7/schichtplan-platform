import { Building2 } from 'lucide-react'
import { industriesApi } from '@/api/marketing-client'
import type { MarketingIndustry } from '@/api/marketing-types'
import { ListEditorShell } from '@/components/marketing/ListEditorShell'
import { BilingualField } from '@/components/marketing/BilingualField'
import { PublishedRow } from '@/components/marketing/PublishedRow'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const QK = ['platform', 'marketing', 'industries'] as const

export default function IndustriesEditor() {
  return (
    <ListEditorShell<MarketingIndustry>
      title="Industries"
      description="Industry tiles shown in the social-proof strip. The icon name must match a Lucide icon."
      icon={<Building2 className="w-5 h-5 text-blue-400" />}
      livePath="/#industries"
      queryKey={QK}
      api={industriesApi}
      itemLabel="Industry"
      emptyForm={() => ({
        key: '',
        icon: 'briefcase',
        label: { de: '', en: '' },
        sort_order: 0,
        is_published: true,
      })}
      describeItem={(item) => `Edit "${item.label?.de ?? item.label?.en ?? item.key}"`}
      renderRow={(item) => (
        <div>
          <div className="text-sm font-medium text-white truncate">
            {item.label?.de ?? item.label?.en ?? item.key}
          </div>
          <div className="text-xs text-[hsl(var(--muted-foreground))]">
            <code>{item.key}</code> · icon <code>{item.icon}</code>
          </div>
        </div>
      )}
      renderForm={(form, setForm) => (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Key</Label>
              <Input
                value={form.key ?? ''}
                onChange={(e) => setForm({ key: e.target.value })}
                placeholder="hospitality"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Icon (Lucide name)</Label>
              <Input
                value={form.icon ?? ''}
                onChange={(e) => setForm({ icon: e.target.value })}
                placeholder="utensils"
                className="mt-1"
              />
            </div>
          </div>
          <BilingualField
            label="Label"
            required
            value={form.label}
            onChange={(v) => setForm({ label: v })}
          />
          <PublishedRow value={!!form.is_published} onChange={(v) => setForm({ is_published: v })} />
        </div>
      )}
    />
  )
}
