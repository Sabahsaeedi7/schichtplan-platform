import { useCallback, useState } from 'react'
import { useQuery, type QueryKey } from '@tanstack/react-query'

/**
 * Convenience hook for "load a server resource, edit it locally, save"
 * editor pages. Avoids the `setState-in-useEffect` anti-pattern by
 * deriving the visible form from server data while preserving any local
 * edits (`draft`) until the parent explicitly resets via `reset()` (e.g.
 * after a successful save).
 *
 *   const { form, set, reset, isLoading } = useEditableQuery(qk, fetch)
 *   set({ title: { de: '…', en: '…' } })   // patches the draft
 *   reset(fresh)                           // call inside onSuccess to
 *                                          // adopt the server's response
 */
export function useEditableQuery<T extends object>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
) {
  const { data, isLoading } = useQuery({ queryKey, queryFn })
  const [draft, setDraft] = useState<T | null>(null)
  const form = draft ?? data ?? null

  const set = useCallback((patch: Partial<T>) => {
    setDraft((curr) => {
      const base = curr ?? data
      if (!base) return curr
      return { ...base, ...patch } as T
    })
  }, [data])

  const replace = useCallback((next: T | null) => setDraft(next), [])

  return { data, form, set, replace, isLoading }
}
