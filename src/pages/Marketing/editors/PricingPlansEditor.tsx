import { CreditCard } from 'lucide-react'
import { pricingPlansApi } from '@/api/marketing-client'
import type { MarketingPricingPlan } from '@/api/marketing-types'
import { ListEditorShell } from '@/components/marketing/ListEditorShell'
import { BilingualField } from '@/components/marketing/BilingualField'
import { PublishedRow } from '@/components/marketing/PublishedRow'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

const QK = ['platform', 'marketing', 'pricing-plans'] as const

const formatPrice = (cents: number | null | undefined) =>
  typeof cents === 'number' ? `€${(cents / 100).toFixed(2)}` : '—'

export default function PricingPlansEditor() {
  return (
    <ListEditorShell<MarketingPricingPlan>
      title="Pricing plans"
      description="The plan cards rendered in the pricing section. Prices are entered in cents to keep currency math exact."
      icon={<CreditCard className="w-5 h-5 text-blue-400" />}
      livePath="/#pricing"
      queryKey={QK}
      api={pricingPlansApi}
      itemLabel="Pricing plan"
      emptyForm={() => ({
        key: '',
        name: { de: '', en: '' },
        description: { de: '', en: '' },
        price_monthly_cents: null,
        price_yearly_cents: null,
        employee_limit: null,
        is_highlighted: false,
        is_contact_sales: false,
        cta_label_override: null,
        is_published: true,
      })}
      describeItem={(item) => `Edit plan "${item.name?.de ?? item.name?.en ?? item.key}"`}
      renderRow={(item) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white truncate">
              {item.name?.de ?? item.name?.en ?? item.key}
            </span>
            {item.is_highlighted && (
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300">
                Featured
              </span>
            )}
            {item.is_contact_sales && (
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300">
                Sales
              </span>
            )}
          </div>
          <div className="text-xs text-[hsl(var(--muted-foreground))] truncate">
            <code>{item.key}</code> · {formatPrice(item.price_monthly_cents)}/mo ·{' '}
            {formatPrice(item.price_yearly_cents)}/yr ·{' '}
            {item.employee_limit ? `${item.employee_limit} employees` : 'unlimited'}
          </div>
        </div>
      )}
      renderForm={(form, setForm) => (
        <div className="space-y-4">
          <div>
            <Label>Key</Label>
            <Input
              value={form.key ?? ''}
              onChange={(e) => setForm({ key: e.target.value })}
              placeholder="growth"
              className="mt-1"
            />
          </div>
          <BilingualField
            label="Name"
            required
            maxLength={80}
            value={form.name}
            onChange={(v) => setForm({ name: v })}
          />
          <BilingualField
            label="Description"
            required
            multiline
            rows={3}
            maxLength={300}
            value={form.description}
            onChange={(v) => setForm({ description: v })}
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Monthly (cents)</Label>
              <Input
                type="number"
                min={0}
                value={form.price_monthly_cents ?? ''}
                onChange={(e) => setForm({
                  price_monthly_cents: e.target.value === '' ? null : Number(e.target.value),
                })}
                placeholder="2900"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Yearly (cents)</Label>
              <Input
                type="number"
                min={0}
                value={form.price_yearly_cents ?? ''}
                onChange={(e) => setForm({
                  price_yearly_cents: e.target.value === '' ? null : Number(e.target.value),
                })}
                placeholder="29900"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Employee limit</Label>
              <Input
                type="number"
                min={0}
                value={form.employee_limit ?? ''}
                onChange={(e) => setForm({
                  employee_limit: e.target.value === '' ? null : Number(e.target.value),
                })}
                placeholder="25"
                className="mt-1"
              />
            </div>
          </div>
          <BilingualField
            label="CTA label override"
            description='If empty, defaults to "Free trial" / "Contact sales" depending on plan type.'
            value={form.cta_label_override ?? undefined}
            onChange={(v) => setForm({ cta_label_override: v })}
          />
          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-[hsl(var(--border))]">
            <ToggleRow
              label="Highlighted"
              hint="Renders this plan with the featured ring."
              value={!!form.is_highlighted}
              onChange={(v) => setForm({ is_highlighted: v })}
            />
            <ToggleRow
              label="Contact sales"
              hint='CTA links to mailto: instead of the app sign-up flow.'
              value={!!form.is_contact_sales}
              onChange={(v) => setForm({ is_contact_sales: v })}
            />
          </div>
          <PublishedRow value={!!form.is_published} onChange={(v) => setForm({ is_published: v })} />
        </div>
      )}
    />
  )
}

function ToggleRow({
  label, hint, value, onChange,
}: { label: string; hint?: string; value: boolean; onChange: (next: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <Label>{label}</Label>
        {hint && (
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{hint}</p>
        )}
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  )
}
