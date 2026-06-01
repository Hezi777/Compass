# Screen 5: Releases (CD / Deployments)
> Status: UNFINISHED in Qlik. This mockup defines the target state.

---

## Purpose
CD / release pipeline health. Approval gate visibility.
Answers: Are deployments succeeding? How long do they take? How long is the approval wait?

## Filters (recommended order)
Year, Quarter, Iteration, Mador, Environment, Deployment Status, Operation Status, Triggered By

## Fields from load script (deployments fact)
deployment_id, deployment_release_name, deployment_pipeline_name,
deployment_environment, deployment_status, deployment_operation_status,
deployment_reason, triggered_by_name, requested_for_name,
deployment_queue_datetime, deployment_start_datetime, deployment_finish_datetime,
deployment_start_date, deployment_url

## Status values
deployment_status: succeeded | failed | canceled | partiallySucceeded
deployment_operation_status: approved | rejected | queued | pending   ← DIFFERENT field, used for donut

## Status colors (same as Builds)
- succeeded:          `#10b981`
- failed:             `#ef4444`
- canceled:           `#9ca3af`
- partiallySucceeded: `#f59e0b`

## Operation status colors
- approved:  `#10b981`
- rejected:  `#ef4444`
- queued:    `#3b82f6`
- pending:   `#f59e0b`

---

## Row 1 - KPI Cards (4 equal columns)

| # | Label | Value | Icon | Notes |
|---|---|---|---|---|
| 1 | TOTAL DEPLOYMENTS | 342 | Rocket | |
| 2 | SUCCESS RATE | 82.7% | CheckCircle | value green `#10b981` |
| 3 | AVG DEPLOYMENT TIME | 18.4 Mins | Clock | "Mins" as smaller suffix text |
| 4 | AVG APPROVAL WAIT | 6.2 Mins | Hourglass | meaningful here — approval gate wait = deployment_start - deployment_queue |

Card 4 is unique to this screen. The queue-to-start interval represents how long deployments sit waiting for approval. Show it prominently.

---

## Row 2 - Deployment results over time (full width)

**Card title:** "Deployments by Iteration"
**Chart type:** Stacked bar, SVG, ~240px tall
**Stack:** succeeded (bottom), partiallySucceeded, failed, canceled (top)

**Data (sprint, succ, partial, failed, canceled):**
| Sprint | Succ | Partial | Failed | Canceled |
|---|---|---|---|---|
| Sprint 24.1 | 38 | 5 | 7 | 2 |
| Sprint 24.2 | 44 | 6 | 9 | 3 |
| Sprint 25.1 | 31 | 4 | 6 | 2 |
| Sprint 25.2 | 52 | 7 | 11 | 4 |
| Sprint 25.3 | 47 | 6 | 8 | 3 |
| Sprint 26.1 | 58 | 8 | 13 | 5 |
| Sprint 26.2 | 34 | 4 | 6 | 2 |

---

## Row 3 - Two equal columns

### Left card: "Avg Deployment Time (Mins)"
Area + line chart, line `#3b82f6`, same style as other screens.
Y axis: "Minutes"
Drill-down breadcrumb: Year (active) › Quarter › Iteration

**Data (quarter, avg mins):**
Q1 24: 22.1 | Q2 24: 20.8 | Q3 24: 19.4 | Q4 24: 21.3 | Q1 25: 19.8 | Q2 25: 18.4

### Right card: "Operation Status Breakdown"
**Chart type:** Donut, ~180px diameter
**IMPORTANT:** Uses `deployment_operation_status` NOT `deployment_status`.
This is non-redundant with the KPIs which use deployment_status.

**Center:** "342 Deployments"

**Data:**
| Op Status | Count | Color |
|---|---|---|
| approved | 283 | `#10b981` |
| pending | 31 | `#f59e0b` |
| rejected | 18 | `#ef4444` |
| queued | 10 | `#3b82f6` |

---

## Row 4 - Deployment detail table (full width)

**Card title:** "Deployment Details"
**Columns:** Pipeline | Environment | Triggered By | Requested For | Reason | Start Date | Duration | Status | Link

**Column specs:**
- Pipeline: 13px `#111827`, truncate
- Environment: pill badge — Prod=red, Stage=amber, Dev=blue, Test=gray
- Triggered By: 13px `#111827` (from triggered_by_name, ApplyMap resolved)
- Requested For: 13px `#6b7280` (from requested_for_name)
- Reason: 11px `#6b7280` (automated/manual/scheduled)
- Start Date: 13px `#6b7280`
- Duration: 13px mono `#111827`
- Status: colored dot + label
- Link: `↗` `#3b82f6`, represents deployment_url

**Sample data (8 rows):**
| Pipeline | Env | By | For | Reason | Date | Duration | Status |
|---|---|---|---|---|---|---|---|
| web-app-release | Prod | Amit Cohen | Noa Klein | manual | 15/05/2025 | 22m 14s | succeeded |
| api-release | Stage | Sara Levi | Sara Levi | automated | 15/05/2025 | 15m 38s | succeeded |
| ml-deploy | Prod | Yossi Ben | Tamar Gal | manual | 14/05/2025 | 31m 07s | failed |
| data-pipeline | Dev | Noa Klein | Noa Klein | automated | 14/05/2025 | 8m 22s | succeeded |
| web-app-release | Stage | Amit Cohen | Amit Cohen | automated | 13/05/2025 | 19m 51s | partiallySucceeded |
| auth-service | Prod | Tamar Gal | David Mor | manual | 13/05/2025 | 24m 03s | succeeded |
| api-release | Dev | David Mor | David Mor | automated | 12/05/2025 | 12m 44s | succeeded |
| ml-deploy | Stage | Yossi Ben | Yossi Ben | automated | 12/05/2025 | 28m 19s | canceled |
