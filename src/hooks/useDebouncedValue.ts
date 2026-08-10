import { useEffect, useState } from 'react'

/**
 * PERF FIX: debounces a fast-changing value (like search input) so
 * expensive downstream work — filtering/sorting 5,000 rows — runs once
 * after typing pauses, instead of on every single keystroke.
 */
export function useDebouncedValue<T>(value: T, delayMs = 250): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
