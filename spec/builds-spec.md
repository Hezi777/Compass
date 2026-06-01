# Screen 4: Builds (CI)
> Status: DONE in Qlik. Mockup goal: portfolio-quality visual.

---

## Purpose
CI pipeline health. Answers: Are builds succeeding? How long do they take? Who is triggering failures?

## Filters active on this screen
Year, Quarter, Iteration, Mador
(Team filter grays out — no wi_team on this fact)

## Fields from load script (builds fact)
build_id, build_pipeline_name, build_build_number, build_status,
build_result, build_reason, build_requested_by_name,
build_start_datetime, build_finish_datetime, build_start_date, build_url

## Status values
succeeded | failed | canceled | partiallySucceeded

## Status colors
- succeeded:           `#10b981`
- failed:              `#ef4444`
- canceled:            `#9ca3af`
- partiallySucceeded:  `#f59e0b`

---

## Row 1 - KPI Cards (4 equal columns)

| # | Label | Value | Icon |
|---|---|---|---|
| 1 | TOTAL BUILDS | 1,284 | Wrench |
| 2 | SUCCESS RATE | 87.3% | CheckCircle |
| 3 | FAILURE RATE | 9.1% | XCircle |
| 4 | AVG BUILD TIME | 4.2 Mins | Clock |

Card 2 value color: `#10b981` (green)
Card 3 value color: `#ef4444` (red)
Card 4: value is numeric, unit "Mins" rendered as smaller 14px text after the number.

---

## Row 2 - Build results over time (full width)

**Card title:** "Build Results by Iteration"
**Chart type:** Stacked bar, SVG, ~240px tall
**Stack order (bottom to top):** succeeded, partiallySucceeded, failed, canceled
**Colors:** as above

**Data (sprint, succeeded, partial, failed, canceled):**
| Sprint | Succ | Partial | Failed | Canceled |
|---|---|---|---|---|
| Sprint 24.1 | 142 | 12 | 18 | 6 |
| Sprint 24.2 | 168 | 15 | 21 | 8 |
| Sprint 25.1 | 134 | 10 | 16 | 5 |
| Sprint 25.2 | 187 | 18 | 24 | 9 |
| Sprint 25.3 | 156 | 14 | 19 | 7 |
| Sprint 26.1 | 201 | 20 | 27 | 11 |
| Sprint 26.2 | 118 | 9 | 13 | 5 |

Gridlines: `#e5e7eb`, axis labels 11px `#9ca3af`, X labels rotate -35deg

---

## Row 3 - Two equal columns

### Left card: "Avg Build Time (Mins)"
Area + line chart, same style as Overview row 3.
Line color: `#3b82f6`
Area: `rgba(59,130,246,0.12)` → transparent
Y axis label: "Minutes"
Drill-down breadcrumb: Year (active) › Quarter › Iteration

**Data (quarter, avg mins):**
Q1 24: 5.8 | Q2 24: 5.2 | Q3 24: 4.9 | Q4 24: 5.4 | Q1 25: 4.6 | Q2 25: 4.2

### Right card: "Build Status Breakdown"
**Chart type:** Donut, SVG, ~180px diameter
**Center:** "1,284 Builds"

**Data:**
| Status | Count | Color |
|---|---|---|
| Succeeded | 1,121 | `#10b981` |
| Failed | 117 | `#ef4444` |
| Partial | 31 | `#f59e0b` |
| Canceled | 15 | `#9ca3af` |

Legend below: dot + label + count + %

---

## Row 4 - Build detail table (full width)

**Card title:** "Build Details"
**Columns:** Pipeline | Build # | Triggered By | Reason | Start Date | Duration | Status | Link

**Column specs:**
- Pipeline: 13px `#111827`, truncate
- Build #: 11px mono `#6b7280`
- Triggered By: 13px `#111827`
- Reason: 11px pill badge (individualCI=blue, manual=gray, schedule=purple, pullRequest=amber)
- Start Date: 13px `#6b7280`
- Duration: 13px mono `#111827` e.g. "3m 42s"
- Status: colored dot + label (succeeded=green, failed=red, canceled=gray, partial=amber)
- Link: 11px `#3b82f6` "↗" icon, represents build_url

**Sample data (8 rows):**
| Pipeline | Build # | By | Reason | Date | Duration | Status |
|---|---|---|---|---|---|---|
| web-frontend | #1847 | Amit Cohen | individualCI | 15/05/2025 | 3m 42s | succeeded |
| api-backend | #924 | Sara Levi | pullRequest | 15/05/2025 | 5m 18s | succeeded |
| ml-pipeline | #312 | Yossi Ben | manual | 14/05/2025 | 12m 04s | failed |
| data-ingestion | #678 | Noa Klein | schedule | 14/05/2025 | 2m 31s | succeeded |
| web-frontend | #1846 | Amit Cohen | individualCI | 13/05/2025 | 3m 58s | partiallySucceeded |
| auth-service | #445 | Tamar Gal | pullRequest | 13/05/2025 | 4m 12s | succeeded |
| ml-pipeline | #311 | Yossi Ben | individualCI | 12/05/2025 | 11m 47s | failed |
| api-backend | #923 | David Mor | manual | 12/05/2025 | 5m 02s | canceled |

Same table styling as other screens.
