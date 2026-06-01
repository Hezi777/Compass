# CLAUDE.md — Compass Mockup Project

You are building **Compass** — a portfolio-quality mockup of an internal Azure DevOps
analytics dashboard originally built in Qlik Sense, re-implemented as a **React app**.

Read this file fully before writing a single line of code.

---

## Project context

Compass is a 6-screen dashboard used by three management tiers in a Hebrew-speaking org:
- רש"צ (Team Lead), רמ"ד (Dept Head), רע"ן (Branch Head)
- Data: Azure DevOps OData → Trino → PostgreSQL → Qlik. Nightly refresh.
- Screens (delivery lifecycle order): Overview · PRs · Builds · Releases · Bugs · Retrospect

The mockups are **portfolio artifacts** — they must look like real production screens,
not wireframes or generic dashboards.

### Source of truth precedence
1. **The 6 screenshots** of the published Qlik screens — the visual & layout truth.
   KPI counts, chart types, chart titles, axis labels, table columns: match them precisely.
   (Black rectangles in screenshots are privacy redactions — use realistic placeholder
   data at the same magnitudes.)
2. **`spec/compass-data-model.md` + `spec/compass-load-script.qvs`** — field names, table
   structure, associations, the ApplyMap pattern. Never invent field names.
3. **`spec/design-system.md` / `theme.json`** — design tokens.
4. The per-screen `spec/*-spec.md` files describe an **older POC layout** and may diverge
   from the screenshots (e.g. KPI values). When they conflict, the **screenshot wins**;
   use the spec only for field names and supporting detail.

---

## Tech stack — Vite + React + TypeScript + Recharts

This is a real React app with a build step (NOT single-file HTML).

- **Vite 5** dev server / build (`npm run dev`, `npm run build`)
- **React 18** + **TypeScript** (strict)
- **React Router v6** — `<BrowserRouter>`, one route per screen
- **Tailwind CSS v3** — configured in `tailwind.config.ts`; tokens mirrored there
- **Recharts** — all charts (bar, donut/pie, line/area). Do NOT hand-code SVG charts.
- **lucide-react** — import icons directly (`import { Wrench } from 'lucide-react'`)
- **Google Fonts Inter** — loaded in `index.html`
- Assets imported from `src/assets/` (`import wallpaper from '../assets/wallpaper.jpg'`).
  Hi-res originals are archived in `assets/source/`.

### Project structure
```
compass/
  package.json  vite.config.ts  tsconfig*.json  tailwind.config.ts  postcss.config.js
  index.html
  assets/                      ← optimized working assets + source/ originals
  spec/                        ← data model, load script, theme, per-screen specs
  src/
    main.tsx                   ← BrowserRouter root
    App.tsx                    ← routes
    vite-env.d.ts              ← image module decls
    styles/globals.css         ← Tailwind + CSS vars + keyframes
    lib/theme.ts               ← COLORS / DATA_COLORS / STATUS_COLORS tokens
    components/
      AppShell.tsx             ← wallpaper bg + glowing frame + Sidebar + FilterPane
      Sidebar.tsx  FilterPane.tsx
      Card.tsx (Card + ChartCard)  KpiCard.tsx  DetailsTable.tsx
      Donut.tsx  Toggle.tsx  ChartTooltip.tsx
    screens/
      Overview.tsx  PRs.tsx  Builds.tsx  Releases.tsx  Bugs.tsx  Retrospect.tsx
```

---

## Design language — match the screenshots

The published screens are **white opaque cards floating on a deep-navy wallpaper**, inside
one large rounded frame with a soft blue glow. Blue is the accent; Inter is the font.
The **only** gold element is the compass logo. NO glassmorphism, NO gold UI, NO backdrop-blur.

### Shell (`AppShell`)
- Page background: `assets/wallpaper.jpg` (navy radial gradient), `bg-fixed bg-cover`,
  plus overlay `linear-gradient(180deg, rgba(5,10,24,0.20), rgba(5,10,24,0.55))`.
- One rounded **frame**: `rounded-[24px]`, 1px border `rgba(86,132,232,0.30)`,
  glow `shadow-[0_0_60px_-10px_rgba(40,90,210,0.45)]`, `14px` inner padding.
- Inside: `flex gap-[14px]` → `Sidebar` · `main` (content) · `FilterPane`.
- Navy shows through the gaps between cards and around the pills.

### Cards — WHITE and OPAQUE
```
background #ffffff · rounded-[14px] · shadow 0 2px 12px rgba(0,0,0,0.08) · overflow-hidden
```
KPI cards add a faint graph-paper texture (`.kpi-grid`) and a 1px `#eaeef5` border.

### Sidebar (`Sidebar`) — floating white pill, 64px wide
- White, `rounded-[20px]`, card shadow. Gold compass `logo.png` in a `#0a0e2a` circle at top.
- Nav icons (lucide, 21px): **active = blue `#3b82f6` on `#eaf2ff` pill**; inactive
  `#1f2d4a`, hover `#f1f5fb`. Tooltip on hover (screen name, right side).
- Order top→bottom: LayoutDashboard→Overview, GitPullRequest→PRs, Wrench→Builds,
  Rocket→Releases, Bug→Bugs, RotateCcw→Retrospect, then a **dimmed FlaskConical**
  (screen 7, TBD — render, non-functional). A `‹` collapse chevron sits at the bottom.

### Filter pane (`FilterPane`) — floating white pill, 200px wide
- White, `rounded-[20px]`, card shadow. Header: sliders icon + "Filters" (17px bold).
- Each filter: 11px 600 muted label over an underlined select-style control (`ChevronDown`),
  placeholder value, not interactive. Filters per screen come from the screenshot —
  see "Per-screen filters" below.

### Colors (`src/lib/theme.ts`, mirrors `spec/design-system.md`)
- Accent `#3b82f6` · accent-dark `#1d4ed8` · ink `#111827` · muted `#6b7280`
- axis `#9ca3af` · line/grid `#e5e7eb` · zebra `#f9fafb` · row hover `#eff6ff` · navy bg `#0a0e2a`
- success `#10b981` · warning `#f59e0b` · error/critical `#ef4444` · canceled `#6b7280`
- Build/Deploy status donut: succeeded `#10b981`, failed `#ef4444`,
  canceled `#6b7280`, partiallySucceeded `#f59e0b`.

### Charts (Recharts)
- `<ResponsiveContainer>` inside `ChartCard`; generous top margin (~24px) so top
  `LabelList` value labels are never clipped.
- Horizontal gridlines only (`CartesianGrid vertical={false}` stroke `#e5e7eb`); `YAxis hide`.
- Axis tick labels 11px `#9ca3af`, `tickLine={false}`, axis line `#e5e7eb`.
- Rotate x labels `-35deg` (`textAnchor="end"`, `interval={0}`) when they would overlap.
- Bars: `radius=[4,4,0,0]` (single) / `[3,3,0,0]` (dense); color individual bars with `<Cell>`.
- Use the shared white-card `ChartTooltip`. Use `Donut` for pie/donut, `Toggle` for the
  Features/PBIs switches.
- Numbers/IDs/durations use the `.tnum` class (tabular-nums).

### Animation
Cards use `.animate-card` (`fadeInUp` 0.34s) with `style={{ '--i': index }}` for a 60ms
stagger. Pass an incrementing `index` to every `Card`/`ChartCard`/`KpiCard`/`DetailsTable`.

---

## Per-screen content (cross-check against the matching screenshot)

| Screen | Active nav | KPIs | Charts | Table |
|---|---|---|---|---|
| **Overview** ✅ | LayoutDashboard | Total Work Items 90k (Layers) · Total Features 1.36k (Star) · Total PBIs 3.56k (Package) · Total Tasks 18.59k (CheckSquare) | Open vs Closed PBIs (blue/green) · Top 10 Open Days (orange bars, shortest=red, Features/PBIs toggle) · Average Closure Time Days (blue, toggle) | Work Item Details (… Created, Closed) |
| **PRs** ✅ | GitPullRequest | Total Pull Requests 2.38k (GitPullRequest) · Total Open PRs 154 (GitPullRequestArrow) · Average PRs Closure Time 585 Hours (Clock) | Average PR Closure Time (blue, by year) · Specific PR Duration Hours (scrollable strip) · Status Distribution donut (completed/active/abandoned) | Pull Requests Details (PR ID, Repo, Title, Status, Created Date, Closed Date, Created By, Iteration) |
| **Builds** ✅ | Wrench | Avg Pipeline Build Time 467 Mins (Clock) · % Successful Builds 66% (CheckCircle) · % Failed Builds 22% (XCircle) | Average CI Pipeline Build Time Mins (blue, by year) · Top 10 Slowest Pipelines Mins · Status donut | Pipeline Details (Build ID, Name, Triggered By, Reason, Start Date, End Date, Build Time (Mins), Status, Result) |
| **Releases** ⬜ | Rocket | Avg Deployment Duration 8.4 Mins · Avg Approval Wait 3.8 Mins · Deployment Success Rate 71.7% · Failed Deployments 235 | Deployments Over Time (by year) · Average CD Pipeline Duration Mins (descending) · CD Operation Status donut (Approved/Canceled/PhaseFailed) | Deployment Detail (Deployment ID, Environment, Triggered By, Requested For, Reason, Deployment Status, Operation Status, Start Date, Duration (Mins), Approval Wait (Mins)) |
| **Bugs** ⬜ | Bug | Total Bugs 933 · Avg Age Open 310 Days · Critical Bug Rate 10.5% | Open vs Closed Bugs (stacked by Severity) · Average Bug Closure Time Days (by year) · Top 10 Oldest Open Bugs (colored by severity) | Bug Details (Bug ID, Title, State, Severity, Created Date, Project, Age) |
| **Retrospect** ⬜ | RotateCcw | Potential Hours N/A · Planned Hours 52.31k · Actual Hours 29.21k · Management Hours 0 · Non Working Hours 1,273 | Task State Distribution donut · Work Item Category Distribution (100% stacked bar) · Remaining vs Actual Hours by Mador (grouped) | Task Details (Task ID, Title, State, Project, Created Date, Original Estimate, Completed Work, Remaining Work) |

Notes:
- Releases user fields (Triggered By, Requested For) are aliased direct loads per the data
  model — do NOT invent a user FK.
- Bugs severity palette: Critical `#ef4444`, High `#f59e0b`, Medium `#fbbf24`, Low `#10b981`.
- Donut for Releases uses `deployment_operation_status` (different field from the KPI status).

### Per-screen filters (from screenshots)
- Overview: Year, Quarter, Iteration, Project, Area Path
- PRs: PR Year, PR Quarter, PR Iteration, Project, Status
- Builds: Year, Quarter, Iteration, Project, Build ID, Status
- Releases: Year, Quarter, Iteration, Project, Environment, Status
- Bugs: Year, Quarter, Iteration, Project, State, Severity
- Retrospect: Year, Quarter, Iteration, Project, Area Path

---

## Build order & workflow

Build **one screen at a time**, then verify before moving on.
Order: Overview → PRs → Builds → Releases → Bugs → Retrospect.
Status: Overview ✅ · PRs ✅ · Builds ✅ · Releases / Bugs / Retrospect ⬜.

To add a screen: create `src/screens/<Name>.tsx`, wire its route in `src/App.tsx`, reuse
the shared components. After each screen:
1. `npx tsc --noEmit` passes clean.
2. `npm run dev` runs (server at http://localhost:5173) with zero console errors.
3. Visually confirm against the screenshot: white cards on navy, no chart clipping,
   correct active nav icon, filters present.

---

## Quality bar — done means ALL of these

- [ ] Wallpaper/navy visible behind the pills and in the gaps between cards
- [ ] All cards white and opaque; KPI cards in a row are equal height
- [ ] All Recharts render without clipping — every bar, top label, donut slice & axis label visible
- [ ] X-axis labels rotated when they would overlap
- [ ] Sidebar shows the correct **blue** active icon/pill for the screen; FlaskConical dimmed
- [ ] Filter pane present with the screen's placeholder filters
- [ ] Inter weights load; numbers use `.tnum`
- [ ] Zero TypeScript errors and zero console errors
- [ ] Hover states on nav items, bars, donut slices, table rows
- [ ] Staggered fade-in on cards

---

## What NOT to do

- Do NOT invent field names — use only those in `spec/compass-load-script.qvs`
- Do NOT use glassmorphism, backdrop-filter, or gold (#D4A946) in the UI (logo only)
- Do NOT hand-code chart SVGs — use Recharts
- Do NOT use localStorage or sessionStorage
- Do NOT add emojis
- Do NOT add features not shown in the screenshot / screen spec

---

## Start command

```
npm install && npm run dev
```
Then read the matching screenshot + `spec/compass-data-model.md`, and build the next
`src/screens/<Name>.tsx`, reusing the shared components.
