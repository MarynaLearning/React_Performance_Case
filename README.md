# Threat Watch — baseline (pre-optimization)

This branch (`before-fix`) is the starting point for a React performance
case study — a working security-alerts dashboard with four common,
realistic performance issues left in place on purpose.

**See the `main` branch for the fixed version, the full write-up of each
issue, and instructions for reproducing the measurements yourself.**

Quick summary of what's wrong here:

1. `KpiCards`, `ChartPanel`, and `AlertsTable` each fetch their own copy of
   data independently — duplicated network requests for identical data.
2. Filtering/sorting the 5,000-row alert list runs on every render, with no
   memoization and no debounce on the search input.
3. Table rows aren't memoized and receive a new inline callback every
   render, so the entire list re-renders on any unrelated state change
   (e.g. the header clock ticking every 2 seconds).
4. All 5,000 rows mount into the DOM at once — no virtualization.

## Run it

```bash
npm install
npm run dev
```
