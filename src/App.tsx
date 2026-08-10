import { useEffect, useState } from 'react'
import { DashboardDataProvider } from './hooks/useDashboardData'
import KpiCards from './components/KpiCards'
import ChartPanel from './components/ChartPanel'
import AlertsTable from './components/AlertsTable'

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
        <ChartPanel />
        <AlertsTable />

        <p className="footer-note">
          Portfolio demo — synthetic data, no client information. See README for the performance case study.
        </p>
      </div>
    </DashboardDataProvider>
  )
}
