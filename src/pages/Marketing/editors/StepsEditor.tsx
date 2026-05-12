import { TableProperties } from 'lucide-react'
import { stepsApi } from '@/api/marketing-client'
import type { MarketingStep } from '@/api/marketing-types'
import { ListEditorShell } from '@/components/marketing/ListEditorShell'
import { BilingualField } from '@/components/marketing/BilingualField'
import { PublishedRow } from '@/components/marketing/PublishedRow'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const QK = ['platform', 'marketing', 'steps'] as const

export default function StepsEditor() {
  return (
    <ListEditorShell<MarketingStep>
      title="How it works"
      description="Three onboarding steps shown after the hero. Each has a number, icon, title, and short description."
      icon={<TableProperties className="w-5 h-5 text-blue-400" />}
      livePath="/#how-it-works"
      queryKey={QK}
      api={stepsApi}
      itemLabel="Step"
      emptyForm={() => ({
        key: '',
        icon: 'sparkles',
        step_number: 1,
        title: { de: '', en: '' },
        description: { de: '', en: '' },
        is_published: true,
      })}
      describeItem={(item) => `Edit step ${item.step_number}: ${item.title?.de ?? item.title?.en ?? item.key}`}
      renderRow={(item) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-bold flex items-center justify-center">
            {item.step_number}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {item.title?.de ?? item.title?.en ?? item.key}
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))] truncate">
              <code>{item.key}</code> · icon <code>{item.icon}</code>
            </div>
          </div>
        </div>
      )}
      renderForm={(form, setForm) => (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Key</Label>
              <Input
                value={form.key ?? ''}
                onChange={(e) => setForm({ key: e.target.value })}
                placeholder="import"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Icon (Lucide name)</Label>
              <Input
                value={form.icon ?? ''}
                onChange={(e) => setForm({ icon: e.target.value })}
                placeholder="upload"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Step #</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={form.step_number ?? 1}
                onChange={(e) => setForm({ step_number: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>
          <BilingualField
            label="Title"
            required
            maxLength={120}
            value={form.title}
            onChange={(v) => setForm({ title: v })}
          />
          <BilingualField
            label="Description"
            required
            multiline
            rows={3}
            maxLength={400}
            value={form.description}
            onChange={(v) => setForm({ description: v })}
          />
          <PublishedRow value={!!form.is_published} onChange={(v) => setForm({ is_published: v })} />
        </div>
      )}
    />
  )
}
