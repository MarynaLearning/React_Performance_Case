# Threat Watch — React Performance Case Study

A small security-alerts dashboard (KPI cards, an event chart, a searchable
table of 5,000 alerts) built in two versions to demonstrate a real
performance-debugging pass:

- **`before-fix`** branch — a working dashboard with four common React
  performance problems, the kind that show up constantly in production
  codebases.
- **`main`** branch (this one) — the same app, same UI, same data, with
  each problem diagnosed and fixed.

**[Compare the two branches on GitHub →](../../compare/before-fix...main)**
(replace with your repo's actual compare URL once pushed)

## Why a synthetic app, not a client project

Client codebases I've worked on are under NDA, so none of that code can be
shown here. Instead, this app reproduces performance patterns I regularly
diagnose and fix in production React/TypeScript apps — duplicated data
fetching, unmemoized expensive computation, unnecessary re-renders, and
unvirtualized long lists — in an original codebase built for this purpose.
The bugs are real bugs; the app around them is new.

## The four issues

| # | Problem (`before-fix`) | Fix (`main`) | Where |
|---|---|---|---|
| 1 | `KpiCards` and `ChartPanel` each run their own `useEffect` fetch for the same data, on every mount | Single fetch in a shared `DashboardDataProvider`, consumed via context | `src/hooks/useDashboardData.tsx` |
| 2 | Filtering + sorting 5,000 alerts runs inline on every render, including every keystroke | `useMemo` keyed on data + a **debounced** search term | `src/components/AlertsTable.tsx`, `src/hooks/useDebouncedValue.ts` |
| 3 | Table rows re-render on any unrelated state change (e.g. the header's live clock ticking every 2s), because rows aren't memoized and receive new inline props each render | Row component wrapped in `React.memo`; stable, primitive props only | `src/components/AlertsTable.tsx` |
| 4 | All 5,000 `<tr>`-equivalents mount in the DOM at once — slow initial paint, janky scroll | Windowed rendering with `react-window`, only ~15 rows mounted at a time | `src/components/AlertsTable.tsx` |

Each fix is marked with a `PERF FIX:` comment in the `main` branch source,
explaining what was wrong and why the fix works — the same way I'd leave
notes for a client reviewing the change.

## How to reproduce the measurements yourself

The repo doesn't ship screenshots, since the honest way to verify a
performance claim is to run it, not to trust a picture. Two minutes, no
account needed:

1. `npm install && npm run dev`, open the app.
2. **React DevTools → Profiler tab** → click record → type a few characters
   in the search box → stop recording.
   - On `before-fix`: every keystroke re-renders the full 5,000-row list.
   - On `main`: typing produces no table re-render until the debounce
     settles, and only the filtered rows re-render.
3. Leave the app open for 10+ seconds and check the Profiler flame graph
   again — the header clock ticks every 2s.
   - On `before-fix`: each tick re-renders the entire table.
   - On `main`: each tick re-renders only the header.
4. **Chrome DevTools → Lighthouse → Performance** on both branches for a
   Time to Interactive / Total Blocking Time comparison — the windowed list
   on `main` mounts far fewer DOM nodes on first paint.

## Architecture (main branch)

Beyond the performance fixes above, `main` is organized by **feature**,
not by file type. Each dashboard section owns its own component(s),
styles, and logic in one folder, instead of components living in one
place, styles in another, and hooks in a third:

```
src/
  App.tsx                  composition root — owns no state of its own
  main.tsx
  types.ts                 shared data contracts, used across features
  data/
    mockApi.ts              data layer
  hooks/
    useDashboardData.tsx     shared fetch context (cross-feature)
    useDebouncedValue.ts     generic utility (cross-feature)
  lib/
    format.ts                pure formatting helpers (cross-feature)
  styles/
    tokens.css                design tokens + base resets — the only
                               truly global CSS
    shared.css                cross-feature UI primitives (.panel,
                               .loading, app shell) that no single
                               feature owns
  features/
    alerts/
      AlertsTable.tsx          presentation — search input + list
      AlertRow.tsx             one row
      SeverityBadge.tsx        reusable atom
      StatusDot.tsx            reusable atom
      useFilteredAlerts.ts     filter/sort logic, colocated with its feature
      constants.ts             debounce/list-sizing constants, colocated
      alerts.css               styles, colocated
    kpis/
      KpiCards.tsx             data-driven, maps over a config array
      KpiCard.tsx              one card
      kpis.css
    chart/
      ChartPanel.tsx           reads colors from styles/tokens.css
    header/
      DashboardHeader.tsx
      LiveClock.tsx            owns its own ticking state
      constants.ts             tick interval, colocated
      header.css
```

The rule of thumb: **things that change together live together.** A
change to how alerts are filtered, styled, or laid out now touches only
`features/alerts/` — it used to also require reasoning about a shared
`index.css` file that every other section's styles lived in too. Only
genuinely cross-feature things (data types, the shared fetch context, base
design tokens) live outside a feature folder.

`hooks/` and `lib/` intentionally still exist as shared layers — a hook or
util used by more than one feature belongs there, not duplicated into
each feature that needs it. Feature-local logic (like `useFilteredAlerts`)
lives inside its feature instead.

The `before-fix` branch is intentionally left unrefactored — it exists to
demonstrate the render-behavior bugs, not architecture, so restructuring
it would blur the comparison.

## Testing with Lighthouse

Run Lighthouse against the **production build**, not `npm run dev`. The
dev server ships unminified, unbundled ES modules plus HMR client code —
it will score noticeably lower on Performance than the real build, for
reasons that have nothing to do with the app's code:

```bash
npm run build
npm run preview
# then run Lighthouse against the printed localhost URL (usually :4173)
```

Also included, on top of the four render-behavior fixes above:
- Google Fonts loaded via non-blocking `<link rel="preconnect">` +
  `<link rel="stylesheet">` in `index.html`, instead of a render-blocking
  `@import` in CSS.
- `<meta name="description">` and `<meta name="theme-color">` for SEO.
- `aria-label` on the search input (unlabeled form fields fail
  accessibility audits).
- `ChartPanel` (and the `recharts` dependency it pulls in) code-split with
  `React.lazy` + `Suspense`, so it loads after first paint instead of
  blocking it.

## Stack

React 18, TypeScript, Vite, Recharts, react-window.

## Run it

```bash
npm install
npm run dev
```
