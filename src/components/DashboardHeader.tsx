import { LiveClock } from './LiveClock'

export function DashboardHeader() {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark" />
        <h1>Threat Watch</h1>
        <span className="subtitle">security alerts dashboard</span>
      </div>
      <LiveClock />
    </header>
  )
}
