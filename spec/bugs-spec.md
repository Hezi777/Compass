# Screen 2: Bugs
> Status: DONE in Qlik (POC published). Mockup goal: portfolio-quality visual.

---

## Purpose
Bug quality management. Critical bugs surface immediately.
Answers: How many bugs? How critical? How old? What's stuck?

## Filters active on this screen
Year, Quarter, Iteration, Mador, Team, State, Severity

## Severity palette (use exactly these)
- Critical (1): `#ef4444`
- High (2):     `#f59e0b`
- Medium (3):   `#fbbf24`  (slightly lighter amber)
- Low (4):      `#10b981`

---

## Row 1 - KPI Cards (4 equal columns)

| # | Label | Value | Icon |
|---|---|---|---|
| 1 | TOTAL BUGS | 284 | Bug |
| 2 | AVG OPEN AGE (DAYS) | 23.4 | Clock |
| 3 | CRITICAL BUG RATE | 12.3% | AlertTriangle |
| 4 | OPEN vs CLOSED | 108 / 176 | BarChart2 |

Card 4 shows two stacked values: `108` open (red `#ef4444`) / `176` closed (green `#10b981`).
All other cards: same anatomy as Overview row 1.

---

## Row 2 - Stacked bar by severity (full width)

**Card title:** "Open vs Closed Bugs by Severity"
**Chart type:** Stacked grouped bar, SVG, ~240px tall
**X axis:** Iterations (same sprint list as Overview)
**Legend:** Critical `#ef4444` | High `#f59e0b` | Medium `#fbbf24` | Low `#10b981`

Each group has 2 bars: Open stack and Closed stack, each stacked by severity.

**Data (open: crit/high/med/low, closed: crit/high/med/low):**
| Sprint | Open (C/H/M/L) | Closed (C/H/M/L) |
|---|---|---|
| Sprint 24.1 | 3/5/8/4 | 2/7/12/9 |
| Sprint 24.2 | 4/6/9/3 | 3/8/14/11 |
| Sprint 25.1 | 2/4/7/2 | 2/6/10/8 |
| Sprint 25.2 | 5/8/11/5 | 4/9/16/12 |
| Sprint 25.3 | 3/6/9/4 | 3/7/13/10 |
| Sprint 26.1 | 6/9/12/4 | 5/10/17/13 |
| Sprint 26.2 | 2/4/6/3 | 2/5/9/7 |

---

## Row 3 - Two equal columns

### Left card: "Avg Close Time · Bugs"
Area + line chart, same style as Overview row 3.
Line color: `#ef4444` (red for bugs)
Area fill: `rgba(239,68,68,0.12)` → transparent
Drill-down breadcrumb: Year (active) › Quarter › Iteration

**Data (quarter, avg days):**
Q1 24: 18.2 | Q2 24: 16.8 | Q3 24: 15.1 | Q4 24: 19.3 | Q1 25: 14.7 | Q2 25: 12.4

### Right card: "Top 10 Oldest Open Bugs"
Horizontal bar list. Same layout as Overview row 4.
Bar fill: `#ef4444`

**Data (title, days):**
| Rank | Title | Days |
|---|---|---|
| 1 | Login timeout on Safari | 134 |
| 2 | PDF export truncates tables | 118 |
| 3 | Webhook fails silently on 500 | 97 |
| 4 | Date filter off by one day | 84 |
| 5 | Search returns deleted items | 76 |
| 6 | Duplicate emails on retry | 63 |
| 7 | Chart tooltip misaligned | 51 |
| 8 | Sort breaks on special chars | 44 |
| 9 | Pagination loses filter state | 38 |
| 10 | Modal z-index overlaps nav | 29 |

---

## Row 4 - Bug detail table (full width)

**Card title:** "Bug Details"
**Columns:** BUG ID | Title | State | Severity | Created | Mador | Age (Days)

**Column specs:**
- BUG ID: 11px mono `#3b82f6`, clickable (URL representation - just style as a link)
- Title: 13px `#111827`, truncate
- State: pill badge - New=blue, Committed=amber, Done=green, Removed=gray
- Severity: colored dot + label — Critical=red, High=amber, Medium=yellow, Low=green
- Created: 13px `#6b7280`
- Mador: 13px `#111827`
- Age: 13px 600 mono `#111827` — values above 60 days in `#ef4444`

**Sample data (8 rows):**
| ID | Title | State | Severity | Created | Mador | Age |
|---|---|---|---|---|---|---|
| BUG-1042 | Login timeout on Safari | Active | Critical | 12/01/2025 | Backend | 134 |
| BUG-1078 | PDF export truncates tables | Committed | High | 26/01/2025 | Reports | 118 |
| BUG-1103 | Webhook fails silently | New | Critical | 16/02/2025 | Integrations | 97 |
| BUG-1155 | Date filter off by one | Active | Medium | 01/03/2025 | Frontend | 84 |
| BUG-1189 | Search returns deleted items | Committed | High | 09/03/2025 | Search | 76 |
| BUG-1224 | Duplicate emails on retry | New | Low | 22/03/2025 | Email | 63 |
| BUG-1267 | Chart tooltip misaligned | Active | Medium | 04/04/2025 | Frontend | 51 |
| BUG-1301 | Sort breaks on special chars | New | Low | 11/04/2025 | Backend | 44 |

Table header: 11px 600 uppercase `#6b7280`, background `#f9fafb`
Table rows: 13px `#111827`, border-bottom `1px solid #e5e7eb`
Zebra: even rows `#f9fafb`
Hover: `#eff6ff`
