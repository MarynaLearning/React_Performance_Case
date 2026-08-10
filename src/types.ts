export type Severity = 'low' | 'medium' | 'high' | 'critical'
export type AlertStatus = 'open' | 'investigating' | 'resolved'

export interface Alert {
  id: string
  timestamp: string
  sourceIp: string
  severity: Severity
  status: AlertStatus
  description: string
}

export interface MetricPoint {
  hour: string
  events: number
  blocked: number
}

export interface DashboardMetrics {
  points: MetricPoint[]
  totalEvents24h: number
  totalBlocked24h: number
  activeSources: number
}
