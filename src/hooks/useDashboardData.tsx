import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchAlerts, fetchMetrics } from '../data/mockApi'
import type { Alert, DashboardMetrics } from '../types'

interface DashboardData {
  alerts: Alert[]
  metrics: DashboardMetrics | null
  loading: boolean
}

const DashboardDataContext = createContext<DashboardData | null>(null)

/**
 * PERF FIX: single source of truth for dashboard data.
 *
 * In the `before-fix` branch, KpiCards and ChartPanel each ran their own
 * `useEffect(() => fetchX(), [])`, so every mount fired two independent
 * network requests for data that's identical and shared. Here the fetch
 * happens exactly once, at the provider, and every consumer reads from
 * the same in-memory result via context.
 */
export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchAlerts(), fetchMetrics()]).then(([alertsResult, metricsResult]) => {
      if (cancelled) return
      setAlerts(alertsResult)
      setMetrics(metricsResult)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => ({ alerts, metrics, loading }), [alerts, metrics, loading])

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>
}

export function useDashboardData(): DashboardData {
  const ctx = useContext(DashboardDataContext)
  if (!ctx) throw new Error('useDashboardData must be used within DashboardDataProvider')
  return ctx
}
