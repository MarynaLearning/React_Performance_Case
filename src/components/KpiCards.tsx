import { useDashboardData } from '../hooks/useDashboardData'

export default function KpiCards() {
  const { metrics, loading } = useDashboardData()

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
