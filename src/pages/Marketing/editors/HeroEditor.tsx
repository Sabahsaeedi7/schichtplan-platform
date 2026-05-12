import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Sparkles, Save } from 'lucide-react'
import { heroApi } from '@/api/marketing-client'
import type { HeroTranslatableKey, MarketingHero } from '@/api/marketing-types'
import { useEditableQuery } from '@/hooks/useEditableQuery'
import { EditorHeader } from '@/components/marketing/EditorHeader'
import { BilingualField } from '@/components/marketing/BilingualField'
import { toast } from '@/components/ui/toaster'
import { extractApiErrors } from '@/lib/marketing-errors'

const QK = ['platform', 'marketing', 'hero'] as const

type FieldDef = { key: HeroTranslatableKey; label: string; multiline?: boolean; max?: number }

const SECTIONS: Array<{ title: string; fields: FieldDef[] }> = [
  {
    title: 'Headline',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', max: 80 },
      { key: 'headline_part1', label: 'Headline (lead)', max: 200 },
      { key: 'headline_emphasis', label: 'Headline (emphasis)', max: 200 },
      { key: 'subheadline', label: 'Sub-headline', multiline: true, max: 400 },
    ],
  },
  {
    title: 'Calls to action',
    fields: [
      { key: 'primary_cta_label', label: 'Primary CTA label', max: 80 },
      { key: 'secondary_cta_label', label: 'Secondary CTA label', max: 80 },
      { key: 'primary_cta_hint', label: 'Hint under CTAs', max: 160 },
    ],
  },
  {
    title: 'Statistics',
    fields: [
      { key: 'stat_one_value', label: 'Stat 1 — value', max: 40 },
      { key: 'stat_one_label', label: 'Stat 1 — label', max: 120 },
      { key: 'stat_two_value', label: 'Stat 2 — value', max: 40 },
      { key: 'stat_two_label', label: 'Stat 2 — label', max: 120 },
      { key: 'stat_three_value', label: 'Stat 3 — value', max: 40 },
      { key: 'stat_three_label', label: 'Stat 3 — label', max: 120 },
    ],
  },
  {
    title: 'App preview labels',
    fields: [
      { key: 'preview_caption', label: 'Caption', max: 200 },
      { key: 'preview_hostname', label: 'Hostname', max: 80 },
      { key: 'preview_monday', label: 'Monday', max: 40 },
      { key: 'preview_tuesday', label: 'Tuesday', max: 40 },
      { key: 'preview_wednesday', label: 'Wednesday', max: 40 },
      { key: 'preview_thursday', label: 'Thursday', max: 40 },
      { key: 'preview_friday', label: 'Friday', max: 40 },
      { key: 'preview_saturday', label: 'Saturday', max: 40 },
      { key: 'preview_sunday', label: 'Sunday', max: 40 },
      { key: 'preview_shift_morning', label: 'Morning shift', max: 80 },
      { key: 'preview_shift_late', label: 'Late shift', max: 80 },
      { key: 'preview_shift_night', label: 'Night shift', max: 80 },
      { key: 'preview_ai_pill', label: 'AI pill', max: 60 },
      { key: 'preview_ai_caption', label: 'AI caption', max: 200 },
      { key: 'preview_compliance_pill', label: 'Compliance pill', max: 60 },
      { key: 'preview_compliance_caption', label: 'Compliance caption', max: 200 },
    ],
  },
]

export default function HeroEditor() {
  const qc = useQueryClient()
  const { form, set, replace, isLoading } = useEditableQuery<MarketingHero>(QK, heroApi.get)

  const mutation = useMutation({
    mutationFn: (payload: Partial<MarketingHero>) => heroApi.update(payload),
    onSuccess: (fresh) => {
      replace(fresh)
      qc.setQueryData(QK, fresh)
      toast.success('Hero saved.')
    },
    onError: (err) => toast.error(extractApiErrors(err).message),
  })

  if (isLoading || !form) {
    return <div className="text-sm text-[hsl(var(--muted-foreground))]">Loading…</div>
  }

  return (
    <div className="max-w-3xl space-y-6">
      <EditorHeader
        title="Hero"
        description="The above-the-fold section. Headline, sub-head, CTAs, stats, and the labels rendered inside the mocked app preview."
        icon={<Sparkles className="w-5 h-5 text-blue-400" />}
        livePath="/#hero"
        actions={
          <button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending}
            className="btn-primary text-sm"
          >
            <Save className="w-4 h-4" />
            {mutation.isPending ? 'Saving…' : 'Save'}
          </button>
        }
      />

      {SECTIONS.map((section) => (
        <div key={section.title} className="card space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">{section.title}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {section.fields.map((field) => (
              <BilingualField
                key={field.key}
                label={field.label}
                multiline={field.multiline}
                maxLength={field.max}
                required
                value={form[field.key]}
                onChange={(v) => set({ [field.key]: v } as Partial<MarketingHero>)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
