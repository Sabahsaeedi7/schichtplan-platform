import { useState, lazy, Suspense } from 'react'
import type { Locale, Translatable } from '@/api/marketing-types'
import { Label } from '@/components/ui/label'
import { LocaleToggle } from './LocaleToggle'

const MDEditor = lazy(() => import('@uiw/react-md-editor'))

interface BilingualMarkdownFieldProps {
  label: string
  description?: string
  value: Translatable | null | undefined
  onChange: (next: Translatable) => void
  required?: boolean
  height?: number
}

/**
 * Markdown editor for translatable bodies (used by Legal Documents).
 *
 * Lazy-loads `@uiw/react-md-editor` so the rest of the dashboard isn't
 * weighed down by the markdown bundle on first load.
 */
export function BilingualMarkdownField({
  label, description, value, onChange,
  required, height = 400,
}: BilingualMarkdownFieldProps) {
  const [locale, setLocale] = useState<Locale>('de')
  const current = value?.[locale] ?? ''

  const handleChange = (next?: string) => {
    onChange({
      de: locale === 'de' ? (next ?? '') : value?.de ?? '',
      en: locale === 'en' ? (next ?? '') : value?.en ?? '',
    })
  }

  return (
    <div className="space-y-2" data-color-mode="dark">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Label>
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
          </Label>
          {description && (
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{description}</p>
          )}
        </div>
        <LocaleToggle value={locale} onChange={setLocale} hasValue={value} />
      </div>

      <Suspense
        fallback={
          <div
            style={{ height }}
            className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--input))] flex items-center justify-center text-sm text-[hsl(var(--muted-foreground))]"
          >
            Loading editor…
          </div>
        }
      >
        <MDEditor
          value={current}
          onChange={handleChange}
          height={height}
          preview="edit"
        />
      </Suspense>
    </div>
  )
}
