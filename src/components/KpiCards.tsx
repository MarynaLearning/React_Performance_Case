import { useDashboardData } from '../hooks/useDashboardData'
import { KpiCard, type KpiTone } from './KpiCard'

export default function KpiCards() {
  const { metrics, loading } = useDashboardData()

  if (loading || !metrics) {
    return <div className="loading">Loading metrics…</div>
  }

  const kpis: { label: string; value: string; tone: KpiTone }[] = [
    { label: 'Events (24h)', value: metrics.totalEvents24h.toLocaleString(), tone: 'default' },
    { label: 'Blocked (24h)', value: metrics.totalBlocked24h.toLocaleString(), tone: 'teal' },
    { label: 'Active Sources', value: metrics.activeSources.toLocaleString(), tone: 'amber' },
  ]

  return (
    <div className="kpi-row">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} {...kpi} />
      ))}
    </div>
  )
}
