import { useEffect, useState } from 'react'
import { CLOCK_TICK_MS } from './constants'

/**
 * Colocated state: the ticking clock lives entirely inside this component
 * instead of in App. A clock tick only re-renders LiveClock itself.
 */
export function LiveClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), CLOCK_TICK_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="status-pill">
      LIVE ·{' '}
      {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}
