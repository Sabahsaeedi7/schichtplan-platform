import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { Locale, TranslatableList } from '@/api/marketing-types'
import { Label } from '@/components/ui/label'
import { LocaleToggle } from './LocaleToggle'

interface BilingualListFieldProps {
  label: string
  description?: string
  value: TranslatableList | null | undefined
  onChange: (next: TranslatableList) => void
  placeholder?: string
  required?: boolean
  maxLength?: number
}

const LOCALE_LABEL: Record<Locale, string> = { de: 'Deutsch', en: 'English' }

/**
 * A repeatable string array field where each entry is translated DE/EN.
 *
 * The DE and EN arrays are kept length-aligned so updating one entry in DE
 * also creates a slot for the corresponding EN entry, preventing length
 * drift that would confuse server validation (`required|array`).
 */
export function BilingualListField({
  label, description, value, onChange,
  placeholder, required, maxLength = 200,
}: BilingualListFieldProps) {
  const [locale, setLocale] = useState<Locale>('de')

  const de = value?.de ?? []
  const en = value?.en ?? []
  const length = Math.max(de.length, en.length, 1)

  const items = locale === 'de' ? de : en

  const setItem = (i: number, next: string) => {
    const nextList = [...items]
    while (nextList.length < length) nextList.push('')
    nextList[i] = next
    onChange({
      de: locale === 'de' ? nextList : [...de],
      en: locale === 'en' ? nextList : [...en],
    })
  }

  const addItem = () => {
    onChange({
      de: [...de, ...Array(Math.max(0, length + 1 - de.length)).fill('')].slice(0, length + 1),
      en: [...en, ...Array(Math.max(0, length + 1 - en.length)).fill('')].slice(0, length + 1),
    })
  }

  const removeItem = (i: number) => {
    onChange({
      de: de.filter((_, idx) => idx !== i),
      en: en.filter((_, idx) => idx !== i),
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
        <LocaleToggle
          value={locale}
          onChange={setLocale}
          hasValue={{ de: de.join(''), en: en.join('') }}
        />
      </div>

      <div className="space-y-2">
        {Array.from({ length }).map((_, i) => (
          <div key={i} className="flex items-start gap-2">
            <input
              type="text"
              value={items[i] ?? ''}
              onChange={(e) => setItem(i, e.target.value)}
              placeholder={placeholder ?? `${LOCALE_LABEL[locale]} #${i + 1}`}
              maxLength={maxLength}
              className="input flex-1"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              disabled={length <= 1}
              className="btn-ghost !p-2 disabled:opacity-40"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="btn-ghost text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add item
        </button>
      </div>
    </div>
  )
}
