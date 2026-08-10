import { useEffect, useState } from 'react'
import { fetchAlerts } from '../data/mockApi'
import type { Alert } from '../types'

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// BUG: not memoized. Combined with the inline `onSelect` callback passed
// from AlertsTable below (a new function every render), this component
// re-renders on every parent render regardless — memoizing it alone
// wouldn't even help without also fixing the prop below.
function AlertRow({ alert, onSelect }: { alert: Alert; onSelect: (id: string) => void }) {
  return (
    <div className="table-row" onClick={() => onSelect(alert.id)}>
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
}

export default function AlertsTable() {
  // BUG: a third independent fetch of data KpiCards/ChartPanel already
  // requested in their own effects.
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchAlerts().then((result) => {
      setAlerts(result)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="loading">Loading alerts…</div>
  }

  // BUG: filtering + sorting 5,000 rows recomputed on every render —
  // including every keystroke (no debounce) and every unrelated re-render
  // of the App above (e.g. the header clock ticking every 2s).
  const term = search.trim().toLowerCase()
  const filtered = term
    ? alerts.filter((a) => a.description.toLowerCase().includes(term) || a.sourceIp.includes(term))
    : alerts
  const sorted = [...filtered].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))

  return (
    <div className="panel">
      <p className="panel-title">Alerts</p>
      <div className="search-row">
        <input
          type="text"
          placeholder="Filter by description or source IP…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="result-count">
          {sorted.length.toLocaleString()} / {alerts.length.toLocaleString()}
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
      {/* BUG: every row renders into the DOM at once. With 5,000 alerts
          that's 5,000 mounted rows on first paint, and again on every
          re-render described above — instead of only the ~15 rows the
          viewport can actually show. */}
      <div style={{ maxHeight: 420, overflowY: 'auto' }}>
        {sorted.map((alert) => (
          <AlertRow key={alert.id} alert={alert} onSelect={(id) => console.log('selected', id)} />
        ))}
      </div>
    </div>
  )
}
