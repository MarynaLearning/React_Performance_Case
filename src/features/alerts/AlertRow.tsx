import { memo, type CSSProperties } from 'react'
import type { Alert } from '../../types'
import { formatTime } from '../../lib/format'
import { SeverityBadge } from './SeverityBadge'
import { StatusDot } from './StatusDot'

interface AlertRowProps {
  alert: Alert
  style: CSSProperties
}

/**
 * PERF FIX (see README): memoized so it only re-renders when its own
 * `alert` prop reference actually changes, not on every parent re-render.
 * This only works because the parent (AlertsTable) passes a stable object
 * reference and no inline callbacks — see useFilteredAlerts.
 */
export const AlertRow = memo(function AlertRow({ alert, style }: AlertRowProps) {
  return (
    <div className="table-row" style={style}>
      <span className="mono-dim">{alert.id}</span>
      <span className="mono-dim">{formatTime(alert.timestamp)}</span>
      <span>{alert.description}</span>
      <span>
        <SeverityBadge severity={alert.severity} />
      </span>
      <span className="mono-dim">{alert.sourceIp}</span>
      <span>
        <StatusDot status={alert.status} />
      </span>
    </div>
  )
})
