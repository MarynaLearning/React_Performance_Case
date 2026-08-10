import type { Severity } from '../../types'

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`badge severity-${severity}`}>{severity}</span>
}
