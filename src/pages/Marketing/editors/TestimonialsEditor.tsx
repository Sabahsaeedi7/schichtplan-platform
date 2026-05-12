import { MessageSquareQuote } from 'lucide-react'
import { testimonialsApi } from '@/api/marketing-client'
import type { MarketingTestimonial } from '@/api/marketing-types'
import { ListEditorShell } from '@/components/marketing/ListEditorShell'
import { BilingualField } from '@/components/marketing/BilingualField'
import { MediaUploadField } from '@/components/marketing/MediaUploadField'
import { PublishedRow } from '@/components/marketing/PublishedRow'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const QK = ['platform', 'marketing', 'testimonials'] as const

export default function TestimonialsEditor() {
  return (
    <ListEditorShell<MarketingTestimonial>
      title="Testimonials"
      description="Customer quotes shown in the testimonials carousel. The `industry_key` should match an existing Industry key for cross-linking."
      icon={<MessageSquareQuote className="w-5 h-5 text-blue-400" />}
      livePath="/#testimonials"
      queryKey={QK}
      api={testimonialsApi}
      itemLabel="Testimonial"
      emptyForm={() => ({
        key: '',
        quote: { de: '', en: '' },
        author: { de: '', en: '' },
        company: { de: '', en: '' },
        industry_key: null,
        avatar_url: null,
        is_published: true,
      })}
      describeItem={(item) => `Edit testimonial from ${item.author?.de ?? item.author?.en ?? item.key}`}
      renderRow={(item) => (
        <div className="flex items-center gap-3 min-w-0">
          {item.avatar_url ? (
            <img src={item.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover border border-[hsl(var(--border))]" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] flex items-center justify-center text-xs text-[hsl(var(--muted-foreground))]">
              {(item.author?.de ?? item.author?.en ?? '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {item.author?.de ?? item.author?.en ?? '—'}
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))] truncate">
              {item.company?.de ?? item.company?.en ?? ''} · <code>{item.industry_key ?? '—'}</code>
            </div>
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
                placeholder="anna-cafe"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Industry key</Label>
              <Input
                value={form.industry_key ?? ''}
                onChange={(e) => setForm({ industry_key: e.target.value || null })}
                placeholder="hospitality"
                className="mt-1"
              />
            </div>
          </div>
          <BilingualField
            label="Quote"
            required
            multiline
            rows={3}
            maxLength={500}
            value={form.quote}
            onChange={(v) => setForm({ quote: v })}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <BilingualField
              label="Author"
              required
              maxLength={120}
              value={form.author}
              onChange={(v) => setForm({ author: v })}
            />
            <BilingualField
              label="Company / role"
              required
              maxLength={120}
              value={form.company}
              onChange={(v) => setForm({ company: v })}
            />
          </div>
          <MediaUploadField
            label="Avatar"
            context="testimonials"
            value={form.avatar_url}
            onChange={(url) => setForm({ avatar_url: url })}
          />
          <PublishedRow value={!!form.is_published} onChange={(v) => setForm({ is_published: v })} />
        </div>
      )}
    />
  )
}
