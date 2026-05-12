import { ComingSoonPage } from '@/components/common/ComingSoonPage'

export default function PlansPage() {
  return (
    <ComingSoonPage
      title="Plans"
      description="Manage the subscription plans offered to tenants (Starter, Pro, Business, Enterprise)."
      upcoming={[
        'Create / edit / archive plans',
        'Set monthly + yearly prices in EUR',
        'Per-plan employee caps and feature flags',
        'Highlight a recommended plan on the marketing site',
        'Sync with the marketing site pricing section automatically',
      ]}
    />
  )
}
