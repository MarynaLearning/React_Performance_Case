import type { Alert, DashboardMetrics, Severity, AlertStatus } from '../types'
import { MOCK_LATENCY_MS } from '../constants'

// Deterministic pseudo-random so the "before" and "after" branches render
// the exact same dataset — the only thing that changes is how it's handled.
function seededRandom(seed: number) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

const SEVERITIES: Severity[] = ['low', 'medium', 'high', 'critical']
const STATUSES: AlertStatus[] = ['open', 'investigating', 'resolved']
const DESCRIPTIONS = [
  'Repeated failed login attempts',
  'Outbound traffic to known malicious host',
  'Unusual data exfiltration volume',
  'Port scan detected on perimeter firewall',
  'Privilege escalation attempt',
  'Suspicious lateral movement between hosts',
  'Malformed DNS query pattern',
  'Anomalous VPN session from new geography',
  'Brute-force attempt against admin console',
  'Certificate mismatch on internal service',
]

const ALERT_COUNT = 5000

function buildAlerts(): Alert[] {
  const rand = seededRandom(42)
  const alerts: Alert[] = []
  for (let i = 0; i < ALERT_COUNT; i++) {
    const hoursAgo = Math.floor(rand() * 72)
    const timestamp = new Date(Date.now() - hoursAgo * 3600_000).toISOString()
    alerts.push({
      id: `ALT-${(i + 1).toString().padStart(5, '0')}`,
      timestamp,
      sourceIp: `${Math.floor(rand() * 223) + 1}.${Math.floor(rand() * 255)}.${Math.floor(
        rand() * 255
      )}.${Math.floor(rand() * 255)}`,
      severity: SEVERITIES[Math.floor(rand() * SEVERITIES.length)],
      status: STATUSES[Math.floor(rand() * STATUSES.length)],
      description: DESCRIPTIONS[Math.floor(rand() * DESCRIPTIONS.length)],
    })
  }
  return alerts
}

function buildMetrics(alerts: Alert[]): DashboardMetrics {
  const points = Array.from({ length: 24 }).map((_, hour) => {
    const inWindow = alerts.filter((a) => {
      const age = (Date.now() - new Date(a.timestamp).getTime()) / 3600_000
      return age >= hour && age < hour + 1
    })
    const blocked = inWindow.filter((a) => a.status === 'resolved').length
    return {
      hour: `${23 - hour}h ago`,
      events: inWindow.length,
      blocked,
    }
  })

  return {
    points: points.reverse(),
    totalEvents24h: points.reduce((sum, p) => sum + p.events, 0),
    totalBlocked24h: points.reduce((sum, p) => sum + p.blocked, 0),
    activeSources: new Set(alerts.map((a) => a.sourceIp)).size,
  }
}

const ALERTS = buildAlerts()
const METRICS = buildMetrics(ALERTS)

export function fetchAlerts(): Promise<Alert[]> {
  return new Promise((resolve) => setTimeout(() => resolve(ALERTS), MOCK_LATENCY_MS))
}

export function fetchMetrics(): Promise<DashboardMetrics> {
  return new Promise((resolve) => setTimeout(() => resolve(METRICS), MOCK_LATENCY_MS))
}
