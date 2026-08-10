import { lazy, Suspense } from 'react'
import { DashboardDataProvider } from './hooks/useDashboardData'
import { DashboardHeader } from './features/header/DashboardHeader'
import KpiCards from './features/kpis/KpiCards'
import AlertsTable from './features/alerts/AlertsTable'

// recharts is one of the heaviest deps in this bundle. It's only needed
// for one panel, so it's split into its own chunk and loaded after the
// initial paint instead of blocking it.
const ChartPanel = lazy(() => import('./features/chart/ChartPanel'))

/**
 * Pure composition: App owns no state of its own. Data comes from
 * DashboardDataProvider, the clock lives inside the header feature, and
 * every section below is a self-contained feature.
 */
export default function App() {
  return (
    <DashboardDataProvider>
      <div className="app">
        <DashboardHeader />

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
