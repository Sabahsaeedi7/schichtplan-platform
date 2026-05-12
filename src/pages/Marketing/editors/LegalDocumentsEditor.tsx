import { Scale } from 'lucide-react'
import { legalDocumentsApi } from '@/api/marketing-client'
import type { MarketingLegalDocument } from '@/api/marketing-types'
import { ListEditorShell } from '@/components/marketing/ListEditorShell'
import { BilingualField } from '@/components/marketing/BilingualField'
import { BilingualMarkdownField } from '@/components/marketing/BilingualMarkdownField'
import { PublishedRow } from '@/components/marketing/PublishedRow'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'

const QK = ['platform', 'marketing', 'legal'] as const

export default function LegalDocumentsEditor() {
  return (
    <ListEditorShell<MarketingLegalDocument>
      title="Legal documents"
      description="Long-form legal pages (Impressum, Datenschutz, AGB). Body is Markdown, with separate DE / EN content."
      icon={<Scale className="w-5 h-5 text-blue-400" />}
      livePath="/legal/impressum"
      queryKey={QK}
      api={legalDocumentsApi}
      itemLabel="Legal document"
      noReorder
      emptyForm={() => ({
        slug: '',
        title: { de: '', en: '' },
        body: { de: '', en: '' },
        is_published: false,
        published_at: null,
      })}
      describeItem={(item) => `Edit "${item.title?.de ?? item.title?.en ?? item.slug}"`}
      renderRow={(item) => (
        <div>
          <div className="text-sm font-medium text-white truncate">
            {item.title?.de ?? item.title?.en ?? item.slug}
          </div>
          <div className="text-xs text-[hsl(var(--muted-foreground))] truncate">
            <code>/legal/{item.slug}</code>
            {item.published_at && (
              <> · last published {format(new Date(item.published_at), 'dd.MM.yyyy')}</>
            )}
          </div>
        </div>
      )}
      renderForm={(form, setForm) => (
        <div className="space-y-4">
          <div>
            <Label>Slug</Label>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 mb-1">
              Used as the URL path: <code>/legal/&lt;slug&gt;</code>. Lowercase letters and dashes only.
            </p>
            <Input
              value={form.slug ?? ''}
              onChange={(e) => setForm({ slug: e.target.value })}
              placeholder="impressum"
              className="mt-1"
            />
          </div>
          <BilingualField
            label="Title"
            required
            maxLength={200}
            value={form.title}
            onChange={(v) => setForm({ title: v })}
          />
          <BilingualMarkdownField
            label="Body (Markdown)"
            required
            height={500}
            value={form.body}
            onChange={(v) => setForm({ body: v })}
          />
          <PublishedRow
            value={!!form.is_published}
            onChange={(v) => setForm({ is_published: v })}
            hint="Once published, the document is reachable at /legal/{slug} on the marketing site."
          />
        </div>
      )}
    />
  )
}
