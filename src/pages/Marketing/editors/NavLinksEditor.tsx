import { Compass } from 'lucide-react'
import { navLinksApi } from '@/api/marketing-client'
import type { MarketingNavLink } from '@/api/marketing-types'
import { ListEditorShell } from '@/components/marketing/ListEditorShell'
import { BilingualField } from '@/components/marketing/BilingualField'
import { PublishedRow } from '@/components/marketing/PublishedRow'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const QK = ['platform', 'marketing', 'nav-links'] as const

export default function NavLinksEditor() {
  return (
    <ListEditorShell<MarketingNavLink>
      title="Nav links"
      description="Top navigation labels and their hrefs (anchors or absolute URLs)."
      icon={<Compass className="w-5 h-5 text-blue-400" />}
      livePath="/"
      queryKey={QK}
      api={navLinksApi}
      itemLabel="Nav link"
      emptyForm={() => ({
        key: '',
        href: '#',
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
          <div className="text-xs text-[hsl(var(--muted-foreground))] truncate">
            <code>{item.key}</code> → <code>{item.href}</code>
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
                placeholder="features"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Href</Label>
              <Input
                value={form.href ?? ''}
                onChange={(e) => setForm({ href: e.target.value })}
                placeholder="#features"
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
