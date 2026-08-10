export type KpiTone = 'default' | 'teal' | 'amber'

interface KpiCardProps {
  label: string
  value: string
  tone?: KpiTone
}

export function KpiCard({ label, value, tone = 'default' }: KpiCardProps) {
  const toneClass = tone === 'default' ? '' : ` ${tone}`
  return (
    <div className={`kpi-card${toneClass}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
    </div>
  )
}
