import { useState } from 'react'
import { FixedSizeList, type ListChildComponentProps } from 'react-window'
import { useDashboardData } from '../../hooks/useDashboardData'
import { useFilteredAlerts } from './useFilteredAlerts'
import { AlertRow } from './AlertRow'
import { ALERTS_LIST_HEIGHT, ALERTS_ROW_HEIGHT } from './constants'
import './alerts.css'

/**
 * Presentation only: renders the search input, the result count, and the
 * virtualized list. All filtering/sorting logic lives in useFilteredAlerts,
 * and row rendering lives in AlertRow — this file just wires them together.
 */
export default function AlertsTable() {
  const { alerts, loading } = useDashboardData()
  const [search, setSearch] = useState('')
  const { filtered } = useFilteredAlerts(alerts, search)

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
      {/* PERF FIX (see README): only the ~10-15 rows visible in the
          viewport are ever mounted in the DOM, instead of all 5,000. */}
      <FixedSizeList
        height={ALERTS_LIST_HEIGHT}
        itemCount={filtered.length}
        itemSize={ALERTS_ROW_HEIGHT}
        width="100%"
      >
        {Row}
      </FixedSizeList>
    </div>
  )
}
