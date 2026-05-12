import { useQuery } from '@tanstack/react-query'
import { ListChecks } from 'lucide-react'
import { pricingFeaturesApi, pricingPlansApi } from '@/api/marketing-client'
import type { MarketingPricingFeature, MarketingPricingPlan } from '@/api/marketing-types'
import { ListEditorShell } from '@/components/marketing/ListEditorShell'
import { BilingualField } from '@/components/marketing/BilingualField'
import { PublishedRow } from '@/components/marketing/PublishedRow'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const QK = ['platform', 'marketing', 'pricing-features'] as const
const PLANS_QK = ['platform', 'marketing', 'pricing-plans'] as const

export default function PricingFeaturesEditor() {
  const { data: plans } = useQuery({
    queryKey: PLANS_QK, queryFn: pricingPlansApi.list,
  })

  return (
    <ListEditorShell<MarketingPricingFeature>
      title="Pricing feature matrix"
      description="Rows of the feature comparison matrix. Tick which plans include each feature."
      icon={<ListChecks className="w-5 h-5 text-blue-400" />}
      livePath="/#pricing"
      queryKey={QK}
      api={pricingFeaturesApi}
      itemLabel="Pricing feature"
      emptyForm={() => ({
        key: '',
        label: { de: '', en: '' },
        included_plans: [],
        is_published: true,
      })}
      describeItem={(item) => `Edit "${item.label?.de ?? item.label?.en ?? item.key}"`}
      renderRow={(item) => (
        <div>
          <div className="text-sm font-medium text-white truncate">
            {item.label?.de ?? item.label?.en ?? item.key}
          </div>
          <div className="text-xs text-[hsl(var(--muted-foreground))] truncate">
            <code>{item.key}</code> · in {item.included_plans?.length ?? 0} plan(s)
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
              placeholder="ai-scheduling"
              className="mt-1"
            />
          </div>
          <BilingualField
            label="Label"
            required
            maxLength={200}
            value={form.label}
            onChange={(v) => setForm({ label: v })}
          />
          <div>
            <Label>Included plans</Label>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 mb-2">
              Pick which plans include this feature. Plan keys come from the Pricing plans editor.
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {(plans ?? []).map((plan) => (
                <PlanCheckbox
                  key={plan.id}
                  plan={plan}
                  checked={(form.included_plans ?? []).includes(plan.key)}
                  onChange={(next) => {
                    const current = new Set(form.included_plans ?? [])
                    if (next) current.add(plan.key)
                    else current.delete(plan.key)
                    setForm({ included_plans: Array.from(current) })
                  }}
                />
              ))}
            </div>
          </div>
          <PublishedRow value={!!form.is_published} onChange={(v) => setForm({ is_published: v })} />
        </div>
      )}
    />
  )
}

function PlanCheckbox({
  plan, checked, onChange,
}: {
  plan: MarketingPricingPlan
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <label
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${
        checked
          ? 'border-blue-500/40 bg-blue-500/10 text-white'
          : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-white'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-blue-500"
      />
      <span className="truncate">
        {plan.name?.de ?? plan.name?.en ?? plan.key}
      </span>
      <code className="ml-auto text-xs text-[hsl(var(--muted-foreground))]">{plan.key}</code>
    </label>
  )
}
