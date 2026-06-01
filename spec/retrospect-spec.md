# Screen 3: Retrospect
> Status: DONE in Qlik (POC published). Mockup goal: portfolio-quality visual.

---

## Purpose
Sprint retrospective view. Planning accuracy, time mix, task status.
Answers: Did we plan correctly? Where did hours actually go? What is blocked?

## Filters active on this screen
Year, Quarter, Iteration, Mador, Team

## Fields used
From TaskDetails: task_original_estimate, task_completed_work, task_remaining_work, task_activity
From WorkItems: wi_state, wi_title, wi_type, wi_iteration

---

## Row 1 - KPI Cards (5 columns — this screen has 5 KPIs)

| # | Label | Value | Icon |
|---|---|---|---|
| 1 | PLANNED HOURS | 3,840 | Calendar |
| 2 | ACTUAL HOURS | 3,612 | Clock |
| 3 | MANAGEMENT HOURS | 284 | Users |
| 4 | NON-WORKING HOURS | 196 | Coffee |
| 5 | POTENTIAL HOURS | 4,320 | Zap |

Note: "Potential Hours" has subtitle "(coming soon)" in muted text below the value.
Same white card anatomy. Icon color `#3b82f6`.

---

## Row 2 - Two equal columns

### Left card: "Task State Distribution"
**Chart type:** Donut / pie chart, SVG, ~200px diameter
**Center label:** "284 Tasks" (13px 600 `#111827`)

**Data:**
| State | Count | Color |
|---|---|---|
| Done | 142 | `#10b981` |
| Committed | 78 | `#3b82f6` |
| New | 41 | `#9ca3af` |
| Removed | 23 | `#e5e7eb` |

Legend below chart: colored dot + label + count + % (11px `#6b7280`)

### Right card: "Work Item Category Mix"
**Chart type:** 100% stacked horizontal bar, SVG, ~180px tall (one bar per Mador)
**Purpose:** Show relative proportion of Requirement vs Bug vs Other per team

**Data (Mador, Requirement%, Bug%, Other%):**
| Mador | Req | Bug | Other |
|---|---|---|---|
| Backend | 62 | 24 | 14 |
| Frontend | 58 | 31 | 11 |
| Integrations | 70 | 18 | 12 |
| Reports | 55 | 28 | 17 |
| Search | 65 | 22 | 13 |

Colors: Requirement `#3b82f6` | Bug `#ef4444` | Other `#9ca3af`
Bar height: 20px, gap: 10px, border-radius 4px
Y axis: Mador names 11px `#6b7280`
Legend: below chart

---

## Row 3 - Planned vs Actual Hours (full width)

**Card title:** "Planned vs Actual Hours by Mador"
**Chart type:** Grouped bar chart, SVG, ~220px tall
**Legend:** Planned `#3b82f6` | Actual `#10b981`

**Data:**
| Mador | Planned | Actual |
|---|---|---|
| Backend | 920 | 876 |
| Frontend | 780 | 821 |
| Integrations | 640 | 598 |
| Reports | 560 | 534 |
| Search | 480 | 451 |
| DevOps | 460 | 332 |

Bar top radius: 4px
Gridlines: `#e5e7eb`
Axis labels: 11px `#9ca3af`
Show value labels above bars: 11px 600 `#6b7280`

---

## Row 4 - Task detail table (full width)

**Card title:** "Task Details"
**Columns:** Task ID | Title | State | Mador | Created | Original Est. | Completed | Remaining

**Column specs:**
- Task ID: 11px mono `#3b82f6`, link style
- Title: 13px `#111827`, truncate
- State: badge pill (same as Bugs screen)
- Mador: 13px `#111827`
- Created: 13px `#6b7280`
- Original Est.: 13px mono `#111827` (hours)
- Completed: 13px mono `#10b981` (green)
- Remaining: 13px mono — if >0 use `#f59e0b`, if 0 use `#10b981`

**Sample data (8 rows):**
| ID | Title | State | Mador | Created | Est | Done | Rem |
|---|---|---|---|---|---|---|---|
| TASK-3841 | Implement OAuth flow | Done | Backend | 02/03/2025 | 16h | 14h | 0h |
| TASK-3842 | Design login page | Committed | Frontend | 03/03/2025 | 8h | 5h | 3h |
| TASK-3867 | Write migration script | Active | Backend | 05/03/2025 | 12h | 9h | 3h |
| TASK-3891 | Setup CI pipeline | Done | DevOps | 07/03/2025 | 10h | 11h | 0h |
| TASK-3912 | PDF report template | New | Reports | 10/03/2025 | 20h | 0h | 20h |
| TASK-3934 | Search index rebuild | Committed | Search | 12/03/2025 | 8h | 6h | 2h |
| TASK-3956 | Webhook signature check | Active | Integrations | 14/03/2025 | 6h | 4h | 2h |
| TASK-3978 | Dashboard loading state | New | Frontend | 16/03/2025 | 4h | 0h | 4h |

Same table styling as Bugs screen table.
