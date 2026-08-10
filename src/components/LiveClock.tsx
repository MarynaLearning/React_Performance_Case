import { useEffect, useState } from 'react'
import { CLOCK_TICK_MS } from '../constants'

/**
 * Colocated state: the ticking clock lives entirely inside this component
 * instead of in App. Previously App held the `now` state so a header clock
 * could tick — meaning every 2s re-render started at the top of the tree.
 * Now only LiveClock itself re-renders on each tick.
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
