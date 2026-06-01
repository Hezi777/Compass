# Screen 1: Overview
> Status: DONE in Qlik (POC published). Mockup goal: portfolio-quality visual.

---

## Purpose
Unified work item status snapshot for all three management tiers.
Answers: How much work is in flight? Is it moving? What is stuck?

## Filters active on this screen
Year, Quarter, Iteration, Mador, Team (all persistent)

## Layout: 4 rows

---

## Row 1 - KPI Cards (4 equal columns)

Follow card spec from design-system.md exactly.
White opaque card, 14px radius, shadow `0 2px 12px rgba(0,0,0,0.08)`.
All 4 cards must be equal height (use `align-items: stretch` on flex row).

| # | Label | Value | Icon (Lucide) |
|---|---|---|---|
| 1 | TOTAL WORK ITEMS | 1,847 | Layers |
| 2 | TOTAL FEATURES | 142 | Star |
| 3 | TOTAL PBIs | 583 | Package |
| 4 | TOTAL TASKS | 1,122 | CheckSquare |

Card anatomy (top to bottom):
- Label: 11px 600 uppercase `#6b7280`, padding-top 20px, padding-horizontal 22px
- Value: 2rem (32px) 700 `#111827`, Geist Mono or Inter, padding-horizontal 22px
- Icon: 40px, color `#3b82f6`, positioned top-right inside card at 22px from edges

No delta badge. No trend line. Just label + value + icon.

---

## Row 2 - Open vs Closed PBIs (full width)

**Card title:** "Open vs Closed PBIs"
**Subtitle:** "By Iteration"
**Legend:** two pills — Open `#f59e0b` (amber) | Closed `#3b82f6` (blue)

**Chart type:** Grouped bar chart, SVG
**Height:** ~240px inside card (card total ~300px)

**Data:**
| Sprint | Open | Closed |
|---|---|---|
| Sprint 24.1 | 18 | 45 |
| Sprint 24.2 | 22 | 52 |
| Sprint 25.1 | 15 | 48 |
| Sprint 25.2 | 29 | 61 |
| Sprint 25.3 | 24 | 57 |
| Sprint 26.1 | 31 | 63 |
| Sprint 26.2 | 19 | 44 |

**Styling:**
- Bar color Open: `#f59e0b`
- Bar color Closed: `#3b82f6`
- Bar top radius: 4px
- Bar pair gap: 3px, group gap: 14px
- Gridlines: `1px solid #e5e7eb` horizontal only
- Axis labels: 11px `#9ca3af`
- X axis labels: rotate -35deg if they would overlap
- Hover: darken bar by 10% brightness

---

## Row 3 - Avg Close Time (two equal columns)

### Left card: "Avg Close Time · Features"
### Right card: "Avg Close Time · PBIs"

Both cards have:
- Card header with title (13px 600 `#111827`) + drill-down breadcrumb
- Breadcrumb: `Year` (underline `#3b82f6`, active) `›` `Quarter` `›` `Iteration` — cosmetic only, no click logic
- Chart: area + line, SVG, ~200px tall

**Features data (quarter, avg days):**
Q1 24: 44 | Q2 24: 39 | Q3 24: 36 | Q4 24: 43 | Q1 25: 34 | Q2 25: 29

**PBIs data (quarter, avg days):**
Q1 24: 9.2 | Q2 24: 8.1 | Q3 24: 7.4 | Q4 24: 9.8 | Q1 25: 7.9 | Q2 25: 6.5

**Chart styling:**
- Line: `#3b82f6`, stroke-width 2px
- Area fill: gradient top `rgba(59,130,246,0.18)` → bottom `rgba(59,130,246,0)`
- Data points: 5px circle, white fill, `#3b82f6` stroke 2px
- Gridlines: `#e5e7eb` horizontal
- Axis labels: 11px `#9ca3af`
- Hover: show tooltip with period + value, white card, shadow

---

## Row 4 - Top 10 Open (two equal columns)

### Left card: "Top 10 Open Features"
### Right card: "Top 10 Open PBIs"

Both have subtitle: "Longest open · days"
Text colors: `#111827` for title/value, `#9ca3af` for rank number

**Bar style:**
- Background track: `#f3f4f6`
- Fill: `#3b82f6` solid (use theme accent, not gold — gold is not in this theme)
- Height: 6px, border-radius 99px
- Width proportional: longest item = 100%

**Features data (title, days):**
| Rank | Title | Days |
|---|---|---|
| 1 | Customer portal redesign | 187 |
| 2 | ML recommendation engine | 162 |
| 3 | API v3 migration framework | 145 |
| 4 | Multi-tenant auth layer | 134 |
| 5 | Real-time notifications system | 121 |
| 6 | Legacy service decommission | 108 |
| 7 | Data lake integration | 97 |
| 8 | Mobile SDK overhaul | 89 |
| 9 | Audit log pipeline | 74 |
| 10 | SSO federation module | 61 |

**PBIs data (title, days):**
| Rank | Title | Days |
|---|---|---|
| 1 | Fix search pagination bug | 94 |
| 2 | Upgrade PostgreSQL 15→16 | 88 |
| 3 | Add team-level metrics | 77 |
| 4 | Export to Excel endpoint | 71 |
| 5 | Email digest scheduler | 65 |
| 6 | Webhook retry logic | 58 |
| 7 | Dark mode toggle | 53 |
| 8 | Filter state persistence | 47 |
| 9 | Bulk assignment UI | 42 |
| 10 | Sprint velocity chart | 38 |

Row layout per item: `[rank] [title truncated] [bar] [days]`
Rank: 11px mono `#9ca3af` | Title: 13px `#111827` truncate with ellipsis | Days: 13px 600 mono `#111827`
