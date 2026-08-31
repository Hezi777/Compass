<h1 align="center">
  <img width="140" height="140" alt="Compass logo" src="src/assets/logo.png" />
  <br />
  <b>Compass</b>
</h1>

<p align="center">
  React rebuild of an internal Azure DevOps analytics dashboard, originally built in Qlik Sense.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-charts-FF6384?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<p align="center">
  <a href="#about">About</a> &nbsp;|&nbsp;
  <a href="#screens">Screens</a> &nbsp;|&nbsp;
  <a href="#screenshots">Screenshots</a> &nbsp;|&nbsp;
  <a href="#tech-stack">Tech Stack</a> &nbsp;|&nbsp;
  <a href="#getting-started">Getting Started</a>
</p>

---

## About

Compass is a six-screen delivery lifecycle dashboard built for engineering management. It covers the full pipeline from work items to retrospectives - pull requests, CI builds, CD releases, bugs, and sprint data.

The original runs in Qlik Sense on a nightly PostgreSQL snapshot pulled from Azure DevOps OData via Trino. This version reproduces the layout, KPIs, chart types, and color system exactly, with realistic mock data at the same scale.

---

## The BI work behind it

The React app is the front half. The modeling is in [`spec/`](spec/), which is the
part worth reading if you care about the data rather than the charts.

| File | What it covers |
|---|---|
| [`compass-data-model.md`](spec/compass-data-model.md) | Full schema and measure reference: 6 fact tables, 4 prefixed calendars, 2 shared dimensions, and the reasoning for each |
| [`compass-load-script.qvs`](spec/compass-load-script.qvs) | The Qlik load script that builds it |
| [`compass-theme.qext`](spec/compass-theme.qext), [`theme.json`](spec/theme.json) | The Qlik theme extension |
| [`design-system.md`](spec/design-system.md) | Color system, typography, chart conventions |
| `*-spec.md` | Per-screen specs: overview, PRs, builds, releases, bugs, retrospect |

### Why constellation and not star

Six facts (`work_items`, `task_details`, `bug_details`, `builds`, `deployments`,
`pull_requests`) share one dimensional hub (`projects`) and one user dimension,
but they have **different grains and different time fields**. A star schema would
force them into a single fact table. A snowflake would over-normalize the
dimensions for no gain. A constellation lets each fact keep its own grain and its
own calendar while still sharing the project context that makes filtering work
across all six screens at once.

### The calendar-prefix problem

Every calendar table prefixes its derived fields (`wi_Year`, `build_Year`,
`dep_Year`, `pr_Year`) rather than using a shared `Year`. Without that, Qlik
auto-associates same-named fields across calendars and you get either synthetic
keys or, worse, silent wrong-date associations that look plausible on the screen.

This is the kind of thing that does not show up until a number is quietly wrong
in production, which is most of why the model is written down at all.

---

## Screens

| # | Screen | What's on it |
|---|---|---|
| 1 | **Overview** | Work item counts (Features, PBIs, Tasks), open vs. closed PBIs, top-10 by age, avg closure time |
| 2 | **Pull Requests** | PR volume, open count, avg closure time, per-PR duration strip, status breakdown |
| 3 | **Builds** | CI pipeline times, pass/fail rates, slowest pipelines, status breakdown |
| 4 | **Releases** | CD deployment durations, approval wait times, success rate, operation status |
| 5 | **Bugs** | Bug counts, avg age, critical rate, severity-stacked bars, oldest open bugs |
| 6 | **Retrospect** | Capacity hours, task state distribution, work item categories, remaining vs. actual hours by project |

---

## Screenshots

| Overview | Pull Requests |
|---|---|
| ![Overview](docs/screenshots/01-overview.png) | ![Pull Requests](docs/screenshots/02-prs.png) |

| Builds | Releases |
|---|---|
| ![Builds](docs/screenshots/03-builds.png) | ![Releases](docs/screenshots/04-releases.png) |

| Bugs | Retrospect |
|---|---|
| ![Bugs](docs/screenshots/05-bugs.png) | ![Retrospect](docs/screenshots/06-retrospect.png) |

---

## Tech Stack

| | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Routing | React Router v6 |
| Charts | Recharts |
| Styling | Tailwind CSS v3 |
| Icons | lucide-react |
| Font | Inter |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/Hezi777/Compass.git
cd Compass
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) - lands on Overview by default.

```bash
npm run build   # production build
```

---

## License

MIT
