import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Save } from 'lucide-react'
import { seoApi } from '@/api/marketing-client'
import type { MarketingSeo } from '@/api/marketing-types'
import { useEditableQuery } from '@/hooks/useEditableQuery'
import { EditorHeader } from '@/components/marketing/EditorHeader'
import { BilingualField } from '@/components/marketing/BilingualField'
import { BilingualListField } from '@/components/marketing/BilingualListField'
import { MediaUploadField } from '@/components/marketing/MediaUploadField'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toaster'
import { extractApiErrors } from '@/lib/marketing-errors'

const QK = ['platform', 'marketing', 'seo'] as const

export default function SeoEditor() {
  const qc = useQueryClient()
  const { form, set, replace, isLoading } = useEditableQuery<MarketingSeo>(QK, seoApi.get)

  const mutation = useMutation({
    mutationFn: (payload: Partial<MarketingSeo>) => seoApi.update(payload),
    onSuccess: (fresh) => {
      replace(fresh)
      qc.setQueryData(QK, fresh)
      toast.success('SEO settings saved.')
    },
    onError: (err) => toast.error(extractApiErrors(err).message),
  })

  if (isLoading || !form) {
    return <div className="text-sm text-[hsl(var(--muted-foreground))]">Loading…</div>
  }

  return (
    <div className="max-w-3xl space-y-6">
      <EditorHeader
        title="SEO"
        description="Meta titles, descriptions, and social cards used by search engines and link unfurlers."
        icon={<Search className="w-5 h-5 text-blue-400" />}
        livePath="/"
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

      <Section title="Page meta">
        <BilingualField
          label="Title"
          required
          value={form.title}
          onChange={(v) => set({ title: v })}
          maxLength={70}
          hint="Shown as the browser tab title and the headline in search results (≤ 70 chars)."
        />
        <BilingualField
          label="Description"
          required
          multiline
          rows={3}
          value={form.description}
          onChange={(v) => set({ description: v })}
          maxLength={170}
          hint="Shown under the title in search results (≤ 170 chars)."
        />
        <BilingualListField
          label="Keywords"
          value={form.keywords}
          onChange={(v) => set({ keywords: v })}
          placeholder="e.g. Schichtplan"
        />
        <div>
          <Label>Canonical URL</Label>
          <Input
            type="url"
            placeholder="https://schichtio.com"
            value={form.canonical_url ?? ''}
            onChange={(e) => set({ canonical_url: e.target.value || null })}
            className="mt-1"
          />
        </div>
      </Section>

      <Section title="OpenGraph (Facebook, LinkedIn, Slack)">
        <BilingualField
          label="OG title"
          value={form.og_title}
          onChange={(v) => set({ og_title: v })}
          maxLength={90}
        />
        <BilingualField
          label="OG description"
          multiline
          rows={2}
          value={form.og_description}
          onChange={(v) => set({ og_description: v })}
          maxLength={200}
        />
        <MediaUploadField
          label="OG image"
          description="1200×630 recommended."
          context="seo"
          value={form.og_image_url}
          onChange={(url) => set({ og_image_url: url })}
        />
      </Section>

      <Section title="Twitter / X">
        <BilingualField
          label="Twitter title"
          value={form.twitter_title}
          onChange={(v) => set({ twitter_title: v })}
          maxLength={70}
        />
        <BilingualField
          label="Twitter description"
          multiline
          rows={2}
          value={form.twitter_description}
          onChange={(v) => set({ twitter_description: v })}
          maxLength={200}
        />
        <MediaUploadField
          label="Twitter image"
          description="Same dimensions as OG image; falls back to OG if empty."
          context="seo"
          value={form.twitter_image_url}
          onChange={(url) => set({ twitter_image_url: url })}
        />
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card space-y-4">
      <h2 className="text-sm font-semibold text-white uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  )
}
