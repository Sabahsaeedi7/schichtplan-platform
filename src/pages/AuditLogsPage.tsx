import { ComingSoonPage } from '@/components/common/ComingSoonPage'

export default function AuditLogsPage() {
  return (
    <ComingSoonPage
      title="Audit logs"
      description="Searchable, filterable audit trail of every super-admin action across tenants, billing, and the marketing CMS."
      upcoming={[
        'Filter by actor, tenant, action type, date range',
        'Per-tenant audit timeline',
        'Export to CSV for compliance requests',
        'Retention policy controls (DSGVO Art. 5)',
        'Diff view for content edits in the Marketing CMS',
      ]}
    />
  )
}
