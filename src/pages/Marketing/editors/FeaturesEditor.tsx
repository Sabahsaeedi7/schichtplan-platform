import { ListChecks } from 'lucide-react'
import { featuresApi } from '@/api/marketing-client'
import type { FeatureTint, MarketingFeature } from '@/api/marketing-types'
import { ListEditorShell } from '@/components/marketing/ListEditorShell'
import { BilingualField } from '@/components/marketing/BilingualField'
import { BilingualListField } from '@/components/marketing/BilingualListField'
import { PublishedRow } from '@/components/marketing/PublishedRow'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const QK = ['platform', 'marketing', 'features'] as const

const TINTS: { value: FeatureTint; label: string; bg: string }[] = [
  { value: 'blue', label: 'Blue', bg: 'bg-blue-500/40' },
  { value: 'coral', label: 'Coral', bg: 'bg-orange-400/50' },
  { value: 'sage', label: 'Sage', bg: 'bg-green-500/40' },
]

export default function FeaturesEditor() {
  return (
    <ListEditorShell<MarketingFeature>
      title="Features"
      description="The feature cards rendered in the Features section. Each card has a title, description, three to five bullets, an icon, and a tint."
      icon={<ListChecks className="w-5 h-5 text-blue-400" />}
      livePath="/#features"
      queryKey={QK}
      api={featuresApi}
      itemLabel="Feature"
      emptyForm={() => ({
        key: '',
        icon: 'sparkles',
        tint: 'blue' as FeatureTint,
        title: { de: '', en: '' },
        description: { de: '', en: '' },
        bullets: { de: [''], en: [''] },
        is_published: true,
      })}
      describeItem={(item) => `Edit "${item.title?.de ?? item.title?.en ?? item.key}"`}
      renderRow={(item) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-2 h-8 rounded ${TINTS.find((t) => t.value === item.tint)?.bg ?? 'bg-blue-500/40'}`} />
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
                placeholder="ai-scheduling"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Icon (Lucide name)</Label>
              <Input
                value={form.icon ?? ''}
                onChange={(e) => setForm({ icon: e.target.value })}
                placeholder="sparkles"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Tint</Label>
              <div className="mt-1 flex gap-1.5">
                {TINTS.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setForm({ tint: t.value })}
                    className={`flex-1 h-9 rounded-lg border text-xs font-medium transition-colors ${
                      form.tint === t.value
                        ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                        : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
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
            maxLength={500}
            value={form.description}
            onChange={(v) => setForm({ description: v })}
          />
          <BilingualListField
            label="Bullets"
            required
            value={form.bullets}
            onChange={(v) => setForm({ bullets: v })}
            placeholder="One concise selling point per bullet"
          />
          <PublishedRow value={!!form.is_published} onChange={(v) => setForm({ is_published: v })} />
        </div>
      )}
    />
  )
}
