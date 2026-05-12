import { useState, type ReactNode } from 'react'
import type { Locale, Translatable } from '@/api/marketing-types'
import { Label } from '@/components/ui/label'
import { LocaleToggle } from './LocaleToggle'

interface BilingualFieldProps {
  label: string
  description?: string
  value: Translatable | null | undefined
  onChange: (next: Translatable) => void
  multiline?: boolean
  rows?: number
  placeholder?: string
  required?: boolean
  maxLength?: number
  hint?: ReactNode
}

const LOCALE_LABEL: Record<Locale, string> = { de: 'Deutsch', en: 'English' }

/**
 * A pair of inputs (or textareas) for a translatable jsonb field.
 *
 * Renders a small DE/EN segmented control above the field so the admin can
 * focus on one locale at a time without losing the other one. Always emits a
 * `{ de, en }` object back to the parent.
 */
export function BilingualField({
  label, description, value, onChange,
  multiline = false, rows = 3,
  placeholder, required, maxLength, hint,
}: BilingualFieldProps) {
  const [locale, setLocale] = useState<Locale>('de')
  const current = value?.[locale] ?? ''

  const handleChange = (next: string) => {
    onChange({
      de: locale === 'de' ? next : value?.de ?? '',
      en: locale === 'en' ? next : value?.en ?? '',
    })
  }

  return (
    <div className="space-y-2">
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
      {multiline ? (
        <textarea
          rows={rows}
          value={current}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder ?? `${LOCALE_LABEL[locale]}…`}
          maxLength={maxLength}
          className="input resize-y"
        />
      ) : (
        <input
          type="text"
          value={current}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder ?? `${LOCALE_LABEL[locale]}…`}
          maxLength={maxLength}
          className="input"
        />
      )}
      {hint && <p className="text-xs text-[hsl(var(--muted-foreground))]">{hint}</p>}
    </div>
  )
}
