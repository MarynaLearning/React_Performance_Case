import type { AlertStatus } from '../../types'

export function StatusDot({ status }: { status: AlertStatus }) {
  return <span className={`status-dot ${status}`}>{status}</span>
}
