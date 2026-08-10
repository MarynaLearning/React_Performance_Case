import { lazy, Suspense, useEffect, useState } from 'react'
import { DashboardDataProvider } from './hooks/useDashboardData'
import KpiCards from './components/KpiCards'
import AlertsTable from './components/AlertsTable'

// recharts is one of the heaviest deps in this bundle. It's only needed
// for one panel, so it's split into its own chunk and loaded after the
// initial paint instead of blocking it.
const ChartPanel = lazy(() => import('./components/ChartPanel'))

export default function App() {
  // A live clock in the header, ticking every 2s — unrelated to alerts/metrics.
  // On the `before-fix` branch this alone is enough to re-render all 5,000
  // table rows on every tick. Here it doesn't touch the table at all.
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <DashboardDataProvider>
      <div className="app">
        <header className="app-header">
          <div className="brand">
            <span className="brand-mark" />
            <h1>Threat Watch</h1>
            <span className="subtitle">security alerts dashboard</span>
          </div>
          <span className="status-pill">
            LIVE · {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </header>

        <KpiCards />
        <Suspense fallback={<div className="loading">Loading chart…</div>}>
          <ChartPanel />
        </Suspense>
        <AlertsTable />

        <p className="footer-note">
          Portfolio demo — synthetic data, no client information. See README for the performance case study.
        </p>
      </div>
    </DashboardDataProvider>
  )
}
