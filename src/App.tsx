import { lazy, Suspense } from 'react'
import { DashboardDataProvider } from './hooks/useDashboardData'
import { DashboardHeader } from './components/DashboardHeader'
import KpiCards from './components/KpiCards'
import AlertsTable from './components/AlertsTable'

// recharts is one of the heaviest deps in this bundle. It's only needed
// for one panel, so it's split into its own chunk and loaded after the
// initial paint instead of blocking it.
const ChartPanel = lazy(() => import('./components/ChartPanel'))

/**
 * Pure composition: App owns no state of its own. Data comes from
 * DashboardDataProvider, the clock lives inside DashboardHeader/LiveClock,
 * and every section below is a self-contained component.
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
