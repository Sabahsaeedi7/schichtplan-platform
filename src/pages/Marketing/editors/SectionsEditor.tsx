import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Layers, Save } from 'lucide-react'
import { sectionsApi } from '@/api/marketing-client'
import type { MarketingSection } from '@/api/marketing-types'
import { EditorHeader } from '@/components/marketing/EditorHeader'
import { BilingualField } from '@/components/marketing/BilingualField'
import { toast } from '@/components/ui/toaster'
import { extractApiErrors } from '@/lib/marketing-errors'

const QK = ['platform', 'marketing', 'sections'] as const

const FRIENDLY_LABELS: Record<string, string> = {
  navbar: 'Navbar',
  features: 'Features section',
  steps: 'How it works',
  industries: 'Industries',
  testimonials: 'Testimonials',
  pricing: 'Pricing',
  faq: 'FAQ',
  footer: 'Footer',
  cta: 'Closing CTA',
}

export default function SectionsEditor() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: QK, queryFn: sectionsApi.list })

  // Per-section override of edited fields (id -> partial section); only fields
  // touched by the user appear here, so unedited rows fall through to `data`.
  const [drafts, setDrafts] = useState<Record<string, Partial<MarketingSection>>>({})
  const [pendingKey, setPendingKey] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: ({ key, payload }: { key: string; payload: Partial<MarketingSection> }) =>
      sectionsApi.update(key, payload),
    onSuccess: (fresh) => {
      qc.invalidateQueries({ queryKey: QK })
      setDrafts((prev) => {
        const next = { ...prev }
        delete next[fresh.id]
        return next
      })
      toast.success(`${FRIENDLY_LABELS[fresh.key] ?? fresh.key} saved.`)
      setPendingKey(null)
    },
    onError: (err) => {
      toast.error(extractApiErrors(err).message)
      setPendingKey(null)
    },
  })

  if (isLoading || !data) {
    return <div className="text-sm text-[hsl(var(--muted-foreground))]">Loading…</div>
  }

  const patch = (id: string, change: Partial<MarketingSection>) =>
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...change } }))

  return (
    <div className="max-w-3xl space-y-6">
      <EditorHeader
        title="Section headings"
        description="Eyebrows, titles, and subtitles that introduce every block on the homepage."
        icon={<Layers className="w-5 h-5 text-blue-400" />}
      />

      <div className="space-y-3">
        {data.map((section) => {
          const merged = { ...section, ...(drafts[section.id] ?? {}) }
          const isSaving = mutation.isPending && pendingKey === section.key
          return (
            <div key={section.id} className="card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    {FRIENDLY_LABELS[section.key] ?? section.key}
                  </h2>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] font-mono mt-0.5">
                    key: {section.key}
                  </p>
                </div>
                <button
                  className="btn-primary text-xs"
                  disabled={isSaving}
                  onClick={() => {
                    setPendingKey(section.key)
                    mutation.mutate({ key: section.key, payload: merged })
                  }}
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaving ? 'Saving…' : 'Save'}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <BilingualField
                  label="Eyebrow"
                  value={merged.eyebrow}
                  onChange={(v) => patch(section.id, { eyebrow: v })}
                  maxLength={80}
                />
                <BilingualField
                  label="Title"
                  value={merged.title}
                  onChange={(v) => patch(section.id, { title: v })}
                  maxLength={200}
                />
              </div>
              <BilingualField
                label="Subtitle"
                multiline
                rows={2}
                value={merged.subtitle}
                onChange={(v) => patch(section.id, { subtitle: v })}
                maxLength={500}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
