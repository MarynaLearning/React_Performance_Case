import { useEffect, useState } from 'react'
import { fetchMetrics } from '../data/mockApi'
import type { DashboardMetrics } from '../types'

// BUG: this component fetches its own copy of the metrics with its own
// useEffect. ChartPanel below does the exact same fetch independently —
// two network requests for identical data, every time the dashboard mounts.
export default function KpiCards() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics().then((result) => {
      setMetrics(result)
      setLoading(false)
    })
  }, [])

  if (loading || !metrics) {
    return <div className="loading">Loading metrics…</div>
  }

  return (
    <div className="kpi-row">
      <div className="kpi-card">
        <div className="kpi-label">Events (24h)</div>
        <div className="kpi-value">{metrics.totalEvents24h.toLocaleString()}</div>
      </div>
      <div className="kpi-card teal">
        <div className="kpi-label">Blocked (24h)</div>
        <div className="kpi-value">{metrics.totalBlocked24h.toLocaleString()}</div>
      </div>
      <div className="kpi-card amber">
        <div className="kpi-label">Active Sources</div>
        <div className="kpi-value">{metrics.activeSources.toLocaleString()}</div>
      </div>
    </div>
  )
}
