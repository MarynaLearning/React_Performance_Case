import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useDashboardData } from '../../hooks/useDashboardData'

// Colors reference the CSS custom properties defined in styles/tokens.css
// (var(--signal-amber) etc.) rather than duplicating hex values here.
// No chart-specific stylesheet is needed — layout comes from the shared
// .panel/.panel-title primitives in styles/shared.css.
export default function ChartPanel() {
  const { metrics, loading } = useDashboardData()

  if (loading || !metrics) {
    return <div className="loading">Loading chart…</div>
  }

  return (
    <div className="panel">
      <p className="panel-title">Event Volume — Last 24h</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={metrics.points} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="eventsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--signal-amber)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--signal-amber)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="blockedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--signal-teal)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--signal-teal)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="hour" stroke="var(--text-dim)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--text-dim)" fontSize={11} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            contentStyle={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
            }}
          />
          <Area type="monotone" dataKey="events" stroke="var(--signal-amber)" fill="url(#eventsFill)" strokeWidth={2} />
          <Area type="monotone" dataKey="blocked" stroke="var(--signal-teal)" fill="url(#blockedFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
