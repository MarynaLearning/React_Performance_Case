import { useMemo } from 'react'
import type { Alert } from '../../types'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { SEARCH_DEBOUNCE_MS } from './constants'

interface UseFilteredAlertsResult {
  filtered: Alert[]
  debouncedSearch: string
}

/**
 * Owns the search/filter/sort logic for the alerts table, independent of
 * how (or whether) it gets rendered — AlertsTable.tsx should only need to
 * call this and render the result.
 *
 * PERF FIX (see README): filtering + sorting 5,000 rows is real work —
 * O(n log n) on every call. useMemo means it only re-runs when the alert
 * list or the *debounced* search term actually changes, and the debounce
 * means that doesn't happen on every keystroke either.
 */
export function useFilteredAlerts(alerts: Alert[], search: string): UseFilteredAlertsResult {
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase()
    const base = term
      ? alerts.filter(
          (a) => a.description.toLowerCase().includes(term) || a.sourceIp.includes(term)
        )
      : alerts
    return [...base].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
  }, [alerts, debouncedSearch])

  return { filtered, debouncedSearch }
}
