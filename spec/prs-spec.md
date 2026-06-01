# Screen 6: Pull Requests
> Status: Needs final polish in Qlik. Mockup defines the polished target.

---

## Purpose
Code review health and throughput.
Answers: How many PRs? How fast are they merged? Who is reviewing?

## Filters
Year, Quarter, Iteration, Mador, Repository, PR Status, Author

## Fields from load script (pull_requests fact)
pr_id, pr_title, pr_status, pr_author_name,
pr_repository_name, pr_source_branch, pr_target_branch,
pr_created_datetime, pr_closed_datetime, pr_created_date, pr_url

## PR status values
active | completed | abandoned

## Status colors
- completed:  `#10b981`
- active:     `#3b82f6`
- abandoned:  `#9ca3af`

---

## Row 1 - KPI Cards (4 equal columns)

| # | Label | Value | Icon |
|---|---|---|---|
| 1 | TOTAL PRs | 438 | GitPullRequest |
| 2 | OPEN PRs | 67 | GitMerge |
| 3 | AVG TIME TO MERGE | 2.4 Days | Clock |
| 4 | COMPLETION RATE | 84.7% | CheckCircle |

Card 2 value color: `#3b82f6`
Card 4 value color: `#10b981`

---

## Row 2 - PR volume over time (full width)

**Card title:** "Pull Request Activity by Iteration"
**Chart type:** Grouped bar, SVG, ~240px tall
**Legend:** Opened `#3b82f6` | Merged `#10b981` | Abandoned `#9ca3af`

**Data (sprint, opened, merged, abandoned):**
| Sprint | Opened | Merged | Abandoned |
|---|---|---|---|
| Sprint 24.1 | 42 | 38 | 4 |
| Sprint 24.2 | 56 | 48 | 7 |
| Sprint 25.1 | 38 | 33 | 3 |
| Sprint 25.2 | 67 | 57 | 8 |
| Sprint 25.3 | 54 | 47 | 6 |
| Sprint 26.1 | 71 | 61 | 9 |
| Sprint 26.2 | 44 | 37 | 5 |

---

## Row 3 - Two equal columns

### Left card: "Avg Time to Merge (Days)"
Area + line chart, line `#10b981` (green for merge velocity)
Area: `rgba(16,185,129,0.12)` → transparent
Drill-down breadcrumb: Year (active) › Quarter › Iteration

**Data (quarter, avg days):**
Q1 24: 3.8 | Q2 24: 3.2 | Q3 24: 2.9 | Q4 24: 3.5 | Q1 25: 2.7 | Q2 25: 2.4

### Right card: "PRs by Status"
**Chart type:** Donut, ~180px diameter
**Center:** "438 PRs"

**Data:**
| Status | Count | Color |
|---|---|---|
| completed | 371 | `#10b981` |
| active | 67 | `#3b82f6` |
| abandoned | 0 | `#9ca3af` |

---

## Row 4 - PR detail table (full width)

**Card title:** "PR Details"
**Columns:** PR ID | Title | Author | Repository | Source Branch | Target Branch | Created | Status

**Column specs:**
- PR ID: 11px mono `#3b82f6`, link style (pr_url)
- Title: 13px `#111827`, truncate
- Author: 13px `#111827` (pr_author_name, ApplyMap resolved)
- Repository: 13px `#6b7280`
- Source Branch: 11px mono `#6b7280`, truncate
- Target Branch: 11px mono `#6b7280` (usually "main" or "develop")
- Created: 13px `#6b7280`
- Status: colored dot + pill label

**Sample data (8 rows):**
| ID | Title | Author | Repo | Source | Target | Created | Status |
|---|---|---|---|---|---|---|---|
| PR-2841 | Add OAuth2 login flow | Amit Cohen | api-backend | feature/oauth | main | 12/05/2025 | active |
| PR-2842 | Fix pagination bug | Sara Levi | web-frontend | fix/pagination | main | 12/05/2025 | completed |
| PR-2867 | Refactor search service | Yossi Ben | search-svc | refactor/search | develop | 11/05/2025 | completed |
| PR-2891 | Add PDF export endpoint | Noa Klein | reports-api | feature/pdf | main | 11/05/2025 | active |
| PR-2912 | Update CI config | Tamar Gal | infra | chore/ci | main | 10/05/2025 | completed |
| PR-2934 | Upgrade dependencies | David Mor | web-frontend | chore/deps | main | 10/05/2025 | completed |
| PR-2956 | Webhook signature check | Amit Cohen | api-backend | security/webhooks | main | 09/05/2025 | active |
| PR-2978 | Loading skeleton UI | Sara Levi | web-frontend | feature/skeleton | develop | 09/05/2025 | completed |

Same table styling as other screens.
