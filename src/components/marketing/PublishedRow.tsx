import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface PublishedRowProps {
  value: boolean
  onChange: (next: boolean) => void
  label?: string
  hint?: string
}

export function PublishedRow({
  value, onChange,
  label = 'Published',
  hint = 'Unpublished items are hidden on the public site but kept in the CMS.',
}: PublishedRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 pt-2 border-t border-[hsl(var(--border))]">
      <div>
        <Label>{label}</Label>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{hint}</p>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  )
}
