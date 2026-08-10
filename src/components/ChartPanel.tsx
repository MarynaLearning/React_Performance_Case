import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { fetchMetrics } from '../data/mockApi'
import type { DashboardMetrics } from '../types'

// BUG: independent fetch, duplicating the request KpiCards already makes.
export default function ChartPanel() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics().then((result) => {
      setMetrics(result)
      setLoading(false)
    })
  }, [])

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
              <stop offset="0%" stopColor="#f0a93b" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#f0a93b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="blockedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4fd1c5" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#4fd1c5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#232d4a" vertical={false} />
          <XAxis dataKey="hour" stroke="#8891ab" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#8891ab" fontSize={11} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            contentStyle={{
              background: '#182140',
              border: '1px solid #232d4a',
              borderRadius: 8,
              fontSize: 12,
              fontFamily: 'JetBrains Mono, monospace',
            }}
          />
          <Area type="monotone" dataKey="events" stroke="#f0a93b" fill="url(#eventsFill)" strokeWidth={2} />
          <Area type="monotone" dataKey="blocked" stroke="#4fd1c5" fill="url(#blockedFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
