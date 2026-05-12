import { ComingSoonPage } from '@/components/common/ComingSoonPage'

export default function BillingPage() {
  return (
    <ComingSoonPage
      title="Billing"
      description="Subscription overview, payment history, dunning, and Stripe/PayPal reconciliation for the platform."
      upcoming={[
        'Per-tenant subscription status & lifecycle events',
        'Invoice history with PDF export',
        'Dunning + automated reminders for failed payments',
        'Stripe & PayPal webhook event log',
        'Manual credit / refund / write-off',
      ]}
    />
  )
}
