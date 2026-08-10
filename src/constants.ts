// Simulated network latency for the mock API (see src/data/mockApi.ts).
export const MOCK_LATENCY_MS = 250

// How long to wait after the user stops typing before the alerts list
// re-filters (see src/hooks/useFilteredAlerts.ts).
export const SEARCH_DEBOUNCE_MS = 250

// Header clock tick interval (see src/components/LiveClock.tsx).
export const CLOCK_TICK_MS = 2000

// Virtualized alerts list dimensions (see src/components/AlertsTable.tsx).
export const ALERTS_ROW_HEIGHT = 40
export const ALERTS_LIST_HEIGHT = 420
