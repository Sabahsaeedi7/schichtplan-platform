import { clsx } from 'clsx'
import type { Locale, Translatable } from '@/api/marketing-types'

interface LocaleToggleProps {
  value: Locale
  onChange: (next: Locale) => void
  hasValue?: Translatable | null
}

export function LocaleToggle({ value, onChange, hasValue }: LocaleToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] p-0.5 text-xs">
      {(['de', 'en'] as const).map((loc) => {
        const filled = !!hasValue?.[loc]?.trim()
        return (
          <button
            key={loc}
            type="button"
            onClick={() => onChange(loc)}
            className={clsx(
              'px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1.5',
              value === loc
                ? 'bg-blue-600/20 text-blue-300'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
            )}
          >
            <span>{loc.toUpperCase()}</span>
            <span
              className={clsx(
                'inline-block w-1.5 h-1.5 rounded-full',
                filled ? 'bg-green-400' : 'bg-orange-400/60'
              )}
              title={filled ? 'Has content' : 'Empty'}
            />
          </button>
        )
      })}
    </div>
  )
}
