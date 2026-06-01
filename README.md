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
