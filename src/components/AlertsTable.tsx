import { memo, useMemo, useState, type CSSProperties } from 'react'
import { FixedSizeList, type ListChildComponentProps } from 'react-window'
import { useDashboardData } from '../hooks/useDashboardData'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { Alert } from '../types'

const ROW_HEIGHT = 40
const LIST_HEIGHT = 420

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * PERF FIX: wrapped in React.memo. Because AlertsTable now passes a stable
 * `alert` object reference (unchanged unless that row's data actually
 * changes) and no inline callbacks, this component skips re-rendering
 * when unrelated dashboard state changes.
 */
const AlertRow = memo(function AlertRow({ alert, style }: { alert: Alert; style: CSSProperties }) {
  return (
    <div className="table-row" style={style}>
      <span className="mono-dim">{alert.id}</span>
      <span className="mono-dim">{formatTime(alert.timestamp)}</span>
      <span>{alert.description}</span>
      <span>
        <span className={`badge severity-${alert.severity}`}>{alert.severity}</span>
      </span>
      <span className="mono-dim">{alert.sourceIp}</span>
      <span>
        <span className={`status-dot ${alert.status}`}>{alert.status}</span>
      </span>
    </div>
  )
})

export default function AlertsTable() {
  const { alerts, loading } = useDashboardData()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 250)

  // PERF FIX: filtering + sorting 5,000 rows is real work — O(n log n) on
  // every render. useMemo means it only re-runs when the alert list or the
  // (debounced) search term actually changes, not on every parent re-render.
  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase()
    const base = term
      ? alerts.filter(
          (a) => a.description.toLowerCase().includes(term) || a.sourceIp.includes(term)
        )
      : alerts
    return [...base].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
  }, [alerts, debouncedSearch])

  if (loading) {
    return <div className="loading">Loading alerts…</div>
  }

  const Row = ({ index, style }: ListChildComponentProps) => (
    <AlertRow alert={filtered[index]} style={style} />
  )

  return (
    <div className="panel">
      <p className="panel-title">Alerts</p>
      <div className="search-row">
        <input
          type="text"
          aria-label="Filter alerts by description or source IP"
          placeholder="Filter by description or source IP…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="result-count">
          {filtered.length.toLocaleString()} / {alerts.length.toLocaleString()}
        </span>
      </div>
      <div className="table-head">
        <span>ID</span>
        <span>Time</span>
        <span>Description</span>
        <span>Severity</span>
        <span>Source IP</span>
        <span>Status</span>
      </div>
      {/* PERF FIX: only the ~10-15 rows visible in the viewport are ever
          mounted in the DOM, instead of all 5,000. Scroll performance and
          initial render time stop scaling with the size of the alert list. */}
      <FixedSizeList
        height={LIST_HEIGHT}
        itemCount={filtered.length}
        itemSize={ROW_HEIGHT}
        width="100%"
      >
        {Row}
      </FixedSizeList>
    </div>
  )
}
