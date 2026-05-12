import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Palette, Save } from 'lucide-react'
import { brandApi } from '@/api/marketing-client'
import type { MarketingBrand } from '@/api/marketing-types'
import { useEditableQuery } from '@/hooks/useEditableQuery'
import { EditorHeader } from '@/components/marketing/EditorHeader'
import { BilingualField } from '@/components/marketing/BilingualField'
import { MediaUploadField } from '@/components/marketing/MediaUploadField'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toaster'
import { extractApiErrors } from '@/lib/marketing-errors'

const QK = ['platform', 'marketing', 'brand'] as const

export default function BrandEditor() {
  const qc = useQueryClient()
  const { form, set, replace, isLoading } = useEditableQuery<MarketingBrand>(QK, brandApi.get)

  const mutation = useMutation({
    mutationFn: (payload: Partial<MarketingBrand>) => brandApi.update(payload),
    onSuccess: (fresh) => {
      replace(fresh)
      qc.setQueryData(QK, fresh)
      toast.success('Brand settings saved.')
    },
    onError: (err) => toast.error(extractApiErrors(err).message),
  })

  if (isLoading || !form) {
    return <div className="text-sm text-[hsl(var(--muted-foreground))]">Loading…</div>
  }

  return (
    <div className="max-w-3xl space-y-6">
      <EditorHeader
        title="Brand"
        description="Site name, logos, contact information, and the small EU/GDPR labels shown across the site."
        icon={<Palette className="w-5 h-5 text-blue-400" />}
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

      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Site identity</h2>
        <div>
          <Label>Site name</Label>
          <Input
            value={form.site_name}
            onChange={(e) => set({ site_name: e.target.value })}
            className="mt-1"
            maxLength={120}
          />
        </div>
        <BilingualField
          label="Logo aria-label"
          description="Accessible label used by screen readers on every logo."
          value={form.logo_aria_label}
          onChange={(v) => set({ logo_aria_label: v })}
          required
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <MediaUploadField
            label="Logo (wordmark)"
            context="brand"
            value={form.logo_wordmark_url}
            onChange={(url) => set({ logo_wordmark_url: url })}
          />
          <MediaUploadField
            label="Logo (icon)"
            context="brand"
            value={form.logo_icon_url}
            onChange={(url) => set({ logo_icon_url: url })}
          />
        </div>
        <MediaUploadField
          label="Favicon"
          description="32×32 or 64×64 PNG."
          context="brand"
          value={form.favicon_url}
          onChange={(url) => set({ favicon_url: url })}
        />
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Links & emails</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>App URL</Label>
            <Input
              type="url"
              placeholder="https://app.schichtio.com"
              value={form.app_url ?? ''}
              onChange={(e) => set({ app_url: e.target.value || null })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Site URL</Label>
            <Input
              type="url"
              placeholder="https://schichtio.com"
              value={form.site_url ?? ''}
              onChange={(e) => set({ site_url: e.target.value || null })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Status URL</Label>
            <Input
              type="url"
              placeholder="https://status.schichtio.com"
              value={form.status_url ?? ''}
              onChange={(e) => set({ status_url: e.target.value || null })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Demo video URL</Label>
            <Input
              type="url"
              value={form.demo_video_url ?? ''}
              onChange={(e) => set({ demo_video_url: e.target.value || null })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Contact email</Label>
            <Input
              type="email"
              placeholder="hello@schichtio.com"
              value={form.contact_email ?? ''}
              onChange={(e) => set({ contact_email: e.target.value || null })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Sales email</Label>
            <Input
              type="email"
              placeholder="sales@schichtio.com"
              value={form.sales_email ?? ''}
              onChange={(e) => set({ sales_email: e.target.value || null })}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Trust labels</h2>
        <BilingualField
          label='"Made in EU" label'
          value={form.made_in_eu_label}
          onChange={(v) => set({ made_in_eu_label: v })}
          required
        />
        <BilingualField
          label='"GDPR aligned" label'
          value={form.gdpr_aligned_label}
          onChange={(v) => set({ gdpr_aligned_label: v })}
          required
        />
        <BilingualField
          label="Mailto subjects"
          description="Subject line auto-filled when visitors click a mailto link."
          value={form.mailto_subjects}
          onChange={(v) => set({ mailto_subjects: v })}
        />
      </div>
    </div>
  )
}
