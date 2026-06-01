# Compass - Data Model and Measure Reference

> Internal Azure DevOps analytics dashboard. Qlik Sense, 6 screens, three management tiers (רש"צ / רמ"ד / רע"ן).
> Data: Azure DevOps OData → Trino → PostgreSQL → Qlik. Nightly refresh, not real-time.

---

## 1. Architecture at a glance

Compass is a constellation (galaxy) schema. One hub, multiple fact tables, shared dimensions, and per-fact calendar copies.

| Layer | Component | Notes |
|---|---|---|
| Source | Azure DevOps OData API | Work items, builds, releases, PRs |
| Transport | Trino (federation) | Cross-source query layer |
| Storage | PostgreSQL | Materialized tables, nightly refresh |
| Presentation | Qlik Sense | `exec-navy` theme, Vizlib Layout Container, Vizlib Table v3.27.2 |

**Why constellation, not star or snowflake.** Six fact tables (work_items, task_details, bug_details, builds, deployments, pull_requests) share one dimensional hub (projects) and one user dimension (users), but they have different grains and different time fields. A star would force a single fact; a snowflake would over-normalize. Constellation lets each fact own its grain and its calendar while still sharing the project context that makes cross-screen filtering work.

**The hub.** `projects` connects every fact via `project_id`. `project_name` aliases to the business term `Mador`. This is the only field that filters every screen.

---

## 2. Schema diagram

See the rendered ERD above. The condensed version:

```
                       ┌─────────────┐
                       │  PROJECTS   │   (hub, Mador = project_name)
                       └──────┬──────┘
                              │ project_id
       ┌──────────┬───────────┼───────────┬──────────────┬──────────────┐
       │          │           │           │              │              │
  WORK_ITEMS  TASK_DETAILS  BUG_DETAILS  BUILDS      DEPLOYMENTS    PULL_REQUESTS
       │          │           │           │              │              │
   wi_created  task_created  bug_created  build_start  deployment_start  pr_created
       │          │           │           │              │              │
   WI_CALENDAR (shared)               BUILD_CAL    DEPLOY_CAL       PR_CAL
       │
   USERS  ←── direct association via wi_assigned_to_user_id
   (other facts: user names resolved via ApplyMap upstream, no join)
```

`task_details` and `bug_details` are link-tables to `work_items`, keyed by `work_item_id`. They share the `wi_created_date_calendar` because their grain is still a work item.

---

## 3. Naming conventions

### Field prefixes (load script)

| Source table | Field prefix | Example |
|---|---|---|
| work_items | `wi_` | `wi_created_date`, `wi_state`, `wi_assigned_to` |
| task_details | `task_` | `task_original_estimate`, `task_completed_work` |
| bug_details | `bug_` | `bug_severity`, `bug_state` |
| builds | `build_` | `build_status`, `build_requested_by_name` |
| deployments | `deployment_` (or `dep_`) | `deployment_status`, `deployment_environment` |
| pull_requests | `pr_` | `pr_status`, `pr_author_name` |

### Measure prefixes (master measures)

| Prefix | Used by | Examples |
|---|---|---|
| `WI.` | Work Items (Overview) | `WI.Count Open`, `WI.Avg Close Days` |
| `BUG.` | Bugs screen | `BUG.Critical Rate`, `BUG.Avg Open Age` |
| `RETRO.` | Retrospect | `RETRO.Planned Hours`, `RETRO.Actual Hours` |
| `BUILD.` | Builds | `BUILD.Success Rate`, `BUILD.Avg Duration` |
| `DEP.` | Releases / Deployments | `DEP.Avg Deployment Mins`, `DEP.Failed Count` |
| `PR.` | Pull Requests | `PR.Avg Time To Merge`, `PR.Open Count` |

Pattern: `[PREFIX].[Aggregation] [Description]`. Display name in master measure tags uses `& ' Mins'` or similar suffix concatenation when units are needed in the KPI body but not the title.

### Calendar prefixes

Every calendar table prefixes its derived fields to prevent auto-association with other calendars:

| Calendar | Date field | Derived fields |
|---|---|---|
| `wi_created_date_calendar` | `wi_created_date` | `wi_Year`, `wi_Quarter`, `wi_Iteration` |
| `wi_closed_date_calendar` | `wi_closed_date` | `wi_closed_Year`, `wi_closed_Quarter`, ... |
| `build_start_date_calendar` | `build_start_date` | `build_Year`, `build_Quarter`, ... |
| `deployment_start_date_calendar` | `deployment_start_date` | `dep_Year`, `dep_Quarter`, ... |
| `pr_created_date_calendar` | `pr_created_date` | `pr_Year`, `pr_Quarter`, ... |

Without the prefix, Qlik auto-merges fields with the same name across calendars and you get either synthetic keys or silent wrong-date associations.

---

## 4. Fact tables

### 4.1 work_items (screens 1-3)

The base fact for Overview, Bugs, and Retrospect.

| Field | Type | Notes |
|---|---|---|
| `work_item_id` | int, PK | Joins to `bug_details` and `task_details` |
| `project_id` | int, FK | → projects |
| `wi_type` | string | `Feature`, `Product Backlog Item`, `Task`, `Bug` |
| `wi_state` | string | `New`, `Committed`, `Active`, `Closed`, `Removed`, `Done` |
| `wi_title` | string | |
| `wi_created_date` | date (integer) | Calendar key, joins to `wi_created_date_calendar` |
| `wi_created_datetime` | timestamp | Used in active-period set analysis (see §8) |
| `wi_closed_date` | date | Nullable |
| `wi_assigned_to_user_id` | int, FK | → users |
| `area_path` | string | Source for `wi_team` via SubField |
| `wi_iteration_path` | string | Source for Iteration (Sprint) |
| `wi_url` | string | Click-through to ADO |

### 4.2 task_details (Retrospect)

Linked 1:1 to work_items where `wi_type = 'Task'`.

| Field | Type | Notes |
|---|---|---|
| `work_item_id` | int, PK/FK | → work_items |
| `task_original_estimate` | decimal | Planned hours |
| `task_completed_work` | decimal | Actual hours |
| `task_remaining_work` | decimal | `Original - Completed` (denormalized) |
| `task_activity` | string | Categorization (Development, Testing, Management, Non-Working) |

### 4.3 bug_details (Bugs)

Linked 1:1 to work_items where `wi_type = 'Bug'`.

| Field | Type | Notes |
|---|---|---|
| `work_item_id` | int, PK/FK | → work_items |
| `bug_severity` | int | 1=Critical, 2=High, 3=Medium, 4=Low |
| `bug_severity_label` | string | Display label |
| `bug_priority` | int | |
| `bug_resolution` | string | If closed |

### 4.4 builds (Builds, screen 4)

CI pipeline executions.

| Field | Type | Notes |
|---|---|---|
| `build_id` | int, PK | |
| `project_id` | int, FK | |
| `build_pipeline_name` | string | |
| `build_status` | string | `succeeded`, `failed`, `canceled`, `partiallySucceeded` |
| `build_start_date` | date | Calendar key |
| `build_start_datetime` | timestamp | |
| `build_finish_datetime` | timestamp | For duration calc |
| `build_requested_by_name` | string | Resolved upstream via ApplyMap from `user_id` |
| `build_url` | string | Click-through |
| `build_original_build_run_id` | int | Groups retry attempts (collapsed in POC, see Gotchas) |

### 4.5 deployments (Releases, screen 5)

CD / release executions.

| Field | Type | Notes |
|---|---|---|
| `deployment_id` | int, PK | |
| `project_id` | int, FK | |
| `deployment_environment` | string | Dev, Stage, Prod, etc. |
| `deployment_status` | string | Overall state |
| `deployment_operation_status` | string | Non-redundant with status (used in donut) |
| `deployment_reason` | string | Manual, automated, scheduled |
| `deployment_start_datetime` | timestamp | |
| `deployment_finish_datetime` | timestamp | |
| `deployment_queue_datetime` | timestamp | For approval-gate wait time |
| `triggered_by_name` | string | ApplyMap-resolved |
| `requested_for_name` | string | ApplyMap-resolved (role-playing dim, see §7) |
| `deployment_url` | string | Click-through |

### 4.6 pull_requests (PRs, screen 6)

Code review activity.

| Field | Type | Notes |
|---|---|---|
| `pr_id` | int, PK | |
| `project_id` | int, FK | |
| `pr_title` | string | |
| `pr_status` | string | `active`, `completed`, `abandoned` |
| `pr_created_datetime` | timestamp | |
| `pr_closed_datetime` | timestamp | Nullable |
| `pr_author_name` | string | ApplyMap-resolved |
| `pr_repository_name` | string | |
| `pr_source_branch`, `pr_target_branch` | string | |
| `pr_url` | string | |

---

## 5. Dimensions

### 5.1 projects (hub)

```
project_id (PK)  |  project_name (Mador)  |  project_description
```

Only one row per Mador. This is the linchpin.

### 5.2 users

```
user_id (PK)  |  user_display_name  |  user_email  |  user_unique_name
```

Connects **directly** to `work_items` only, via `wi_assigned_to_user_id`. Connecting it to multiple facts (each with multiple user FKs) would create synthetic keys. See §7.

### 5.3 team_area_paths (planned bridge)

Not in POC. Fetched from ADO REST:

```
GET https://dev.azure.com/{org}/{project}/_apis/work/teamsettings/teamfieldvalues?api-version=7.1
```

Returns the area paths each team owns. Compass currently derives `wi_team` from `area_path` via SubField, which collapses to the leaf segment. The proper team mapping via this bridge table is the fix for accurate `Team` filtering on screens 1-3.

---

## 6. Calendar pattern - the 4 prefixed copies

Every fact with its own time field needs its own calendar so that filtering on Year/Quarter/Iteration on one fact does not accidentally filter another fact. The naive approach (one shared calendar table) fails the moment two facts have different date columns.

### Why prefix every derived field

If `wi_created_date_calendar` and `build_start_date_calendar` both expose a field literally named `Year`, Qlik auto-merges them into a single field in the data model. Picking 2025 in the Year filter then filters both calendars simultaneously, regardless of which fact is on the chart. Symptom: a Builds KPI moves when you change the Bugs filter.

Fix: every calendar prefixes its derived fields with its scope.

```qlik
// In wi_created_date_calendar load:
DERIVE FIELDS USING ...
[wi_Year] AS Year(wi_created_date),
[wi_Quarter] AS 'Q' & Ceil(Month(wi_created_date)/3),
[wi_Iteration] AS [wi_iteration_path]   // sprint from work item

// In build_start_date_calendar load:
[build_Year] AS Year(build_start_date),
[build_Quarter] AS 'Q' & Ceil(Month(build_start_date)/3),
...
```

The user sees `Year`, `Quarter`, `Iteration` filters per screen, each bound to the right prefixed field on the active fact.

### When the calendar tables are NOT enough

For active-period set analysis (count of items still open at the end of a period, count of bugs open during Q2, etc.), even prefixed calendars cause the **calendar pre-association problem**: Qlik resolves the calendar selection before the set analysis runs, so the fact rows are already filtered to items created in that period. Items created earlier and still open get excluded.

Fix: do not use calendar selection for this case. Use `vStartDate` and `vEndDate` variables with variable input boxes per sheet, and write the set analysis against the timestamps directly. See §8.

---

## 7. Role-playing dimensions and ApplyMap

`builds`, `deployments`, and `pull_requests` each have multiple user fields:

| Fact | User fields |
|---|---|
| builds | `build_requested_by_user_id` |
| deployments | `deployment_triggered_by_user_id`, `deployment_requested_for_user_id` |
| pull_requests | `pr_author_user_id`, `pr_created_by_user_id` (sometimes), `pr_reviewer_user_ids` (multi-valued) |

Connecting `users` to all of these creates synthetic keys (multiple FK columns to the same dim from one table) and ambiguous lookups (which name when the chart says "user"?).

### The ApplyMap pattern

Resolve names in the load script, never at runtime.

```qlik
// 1. Build the lookup ONCE, before loading the facts
UserNameMap:
MAPPING LOAD
    user_id,
    user_display_name
FROM [lib://Trino/users];

// 2. Resolve each user FK into a denormalized name field on its fact
Builds:
LOAD
    build_id,
    project_id,
    build_status,
    build_start_date,
    build_start_datetime,
    build_finish_datetime,
    ApplyMap('UserNameMap', build_requested_by_user_id, 'Unknown') AS build_requested_by_name,
    build_url
FROM [lib://Trino/builds];

Deployments:
LOAD
    deployment_id,
    project_id,
    deployment_status,
    deployment_operation_status,
    ApplyMap('UserNameMap', deployment_triggered_by_user_id, 'Unknown') AS triggered_by_name,
    ApplyMap('UserNameMap', deployment_requested_for_user_id, 'Unknown') AS requested_for_name,
    ...
FROM [lib://Trino/deployments];

DROP TABLE UserNameMap;
```

The user FK columns are NOT loaded onto the fact. Only the resolved names are. No synthetic keys, no ambiguous joins. The cost is denormalization (a user changes their name, the dashboard shows the old one until next reload), which is acceptable here because:

1. Refresh is nightly anyway.
2. User name changes are rare.
3. The benefit (clean model) is large.

### When NOT to use ApplyMap

For `work_items.wi_assigned_to_user_id`, we keep the direct FK join to `users` because:

1. It is the only user FK on that fact, so no role-playing collision.
2. Screens 1-3 sometimes filter by user attributes that ApplyMap cannot give us in one shot (email, team membership, etc).

This asymmetry is intentional.

---

## 8. Active items pattern and vStartDate / vEndDate

This is the section that has burned the most hours in development. Document it carefully.

### The problem

"How many bugs were open during Q2?" means: bugs created on or before the last day of Q2 AND not yet closed by the first day of Q2 (or still open). The natural-looking expression:

```qlik
// WRONG - looks right, returns wrong number
Count({<
  bug_state -= {'Closed', 'Removed'},
  wi_Year = {2025}, wi_Quarter = {'Q2'}
>} work_item_id)
```

This counts only items **created** in Q2 that are still open, missing every item created earlier and still open during Q2. The calendar selection pre-filters the rows before set analysis runs.

### The fix

Step 1: ditch the calendar selection for this kind of query. Use variables.

```qlik
// Variables defined in load script or via input boxes on the sheet
SET vStartDate = MakeDate(2025, 4, 1);   // user-picked via Vizlib variable input
SET vEndDate   = MakeDate(2025, 6, 30);  // user-picked
```

Step 2: write set analysis against the raw timestamps.

```qlik
// Bugs open during the [vStartDate, vEndDate] window
Count({<
  bug_state -= {'Closed', 'Removed'},
  wi_created_date_integer = {"<=$(=Num(vEndDate)+1)"}    // created by end of window
>}
work_item_id)
+
Count({<
  bug_state = {'Closed'},
  wi_created_date_integer = {"<=$(=Num(vEndDate)+1)"},
  wi_closed_date_integer  = {">=$(=Num(vStartDate))"}    // closed after start of window
>}
work_item_id)
```

### The +1 gotcha

`wi_created_date_integer` is the date (no time). But the source is `wi_created_datetime` (timestamp). A work item created on 2025-06-30 at 23:47 has:

- `wi_created_datetime` = `2025-06-30 23:47:00`
- `wi_created_date_integer` = `45838` (the integer for 2025-06-30)

A naive set analysis `wi_created_date_integer = {"<=$(=Num(vEndDate))"}` where `vEndDate = 2025-06-30` resolves to `<= 45838`. The item passes. So far so good.

But when `vEndDate = MakeDate(2025, 6, 30)`, Qlik treats it as the *start* of 2025-06-30 (midnight). For a strict less-than comparison against the timestamp version we lose the late-day items. The fix: always `+1` the upper bound. This guarantees we include items created at any time during the last day of the window.

```qlik
// ALWAYS +1 on the upper bound when comparing date integer to a variable
wi_created_date_integer = {"<=$(=Num(vEndDate)+1)"}
```

### Variable input boxes per sheet

Each sheet that needs active-period semantics gets two Vizlib variable input controls:

- "Period start" bound to `vStartDate`
- "Period end" bound to `vEndDate`

These do NOT make selections in the data model. They just hold values. Set analysis reads them inline. This sidesteps the pre-association problem completely.

---

## 9. Set analysis - the rules and the patterns

### The cardinal rule

**Set analysis variables are evaluated as text, not as the value they hold, unless you wrap them in a `$()` dollar expansion.** And even then, if the variable holds an expression that references field state (like `Max(field)`), you get zero. This is the single biggest gotcha in Compass.

```qlik
// WRONG - returns 0
SET vClosed = "bug_state = {'Closed'}";
Count({<$(vClosed)>} work_item_id)

// WRONG - also returns 0 inside set analysis
SET vEndCutoff = "<=$(=Max(wi_created_date_integer)+1)";
Count({< wi_created_date_integer = {"$(vEndCutoff)"} >} work_item_id)
```

**Always inline.** Every set analysis expression in Compass is written out in the master measure body. Variables hold values (numbers, dates from input boxes) - never set expressions.

### Pattern: closed during a period (Overview)

```qlik
// PBIs closed during the selected period
Count({<
  wi_type = {'Product Backlog Item'},
  wi_state = {'Closed', 'Done'},
  wi_closed_date_integer = {">=$(=Num(vStartDate))<=$(=Num(vEndDate)+1)"}
>} work_item_id)
```

### Pattern: open right now (Overview)

```qlik
// PBIs currently open (no period needed)
Count({<
  wi_type = {'Product Backlog Item'},
  wi_state -= {'Closed', 'Done', 'Removed'}
>} work_item_id)
```

### Pattern: average close time (Overview)

```qlik
// Average close time in days for PBIs closed in period
Avg({<
  wi_type = {'Product Backlog Item'},
  wi_state = {'Closed', 'Done'},
  wi_closed_date_integer = {">=$(=Num(vStartDate))<=$(=Num(vEndDate)+1)"}
>}
wi_closed_date_integer - wi_created_date_integer)
```

### Pattern: critical bug rate (Bugs)

```qlik
// % of currently open bugs that are critical
Count({<
  bug_state -= {'Closed', 'Removed'},
  bug_severity = {1}
>} work_item_id)
/
Count({<
  bug_state -= {'Closed', 'Removed'}
>} work_item_id)
```

Display with `Num(..., '#,##0.0%')`.

### Pattern: build success rate (Builds)

```qlik
Count({<
  build_status = {'succeeded'}
>} build_id)
/
Count({< build_status -= {'canceled'} >} build_id)
```

Cancellations explicitly excluded from the denominator because a canceled build is not a meaningful "outcome".

### Pattern: avg deployment time in minutes (Releases)

```qlik
Avg({<
  deployment_status = {'succeeded'}
>}
(deployment_finish_datetime - deployment_start_datetime) * 24 * 60
)
```

Display master measure:

```qlik
Num(
  Avg({<deployment_status = {'succeeded'}>}
    (deployment_finish_datetime - deployment_start_datetime) * 24 * 60),
  '#,##0'
) & ' Mins'
```

The unit suffix is in the expression, not the title - so the KPI body reads "47 Mins" while the title above reads "Avg Deployment Time".

### Pattern: approval wait (Releases, deployment-specific)

```qlik
// Time from queue to actual start - the approval gate wait
Avg({<deployment_status -= {'canceled'}>}
  (deployment_start_datetime - deployment_queue_datetime) * 24 * 60
)
```

Note this is meaningful only for deployments. The same queue-to-start interval on builds is just scheduler latency (negligible) and was dropped from the Builds screen.

---

## 10. Filter architecture

### Persistent across all screens

| Filter | Bound field | Notes |
|---|---|---|
| Year | `wi_Year` / `build_Year` / `dep_Year` / `pr_Year` per screen | Drives drill-down |
| Quarter | `wi_Quarter` / ... | |
| Iteration | `wi_Iteration` / ... | "Iteration" = "Sprint" |
| Mador | `project_name` | The only universal filter |

### Persistent but applies only on screens 1-3

| Filter | Bound field | Why limited |
|---|---|---|
| Team | `wi_team` (derived from `area_path`) | Builds/Releases/PRs have no team-level field. Filter grays out naturally on screens 4-6. |

### Screen-specific filters

| Screen | Extra filters |
|---|---|
| Bugs | State, Severity |
| Builds | Pipeline, Build Status, Requested By |
| Releases | Environment, Deployment Status, Operation Status, Triggered By |
| PRs | Repository, PR Status, Author |

### Filter order convention

Always: time filters first (Year, Quarter, Iteration), then project scope (Mador), then domain filters (State, Severity, Environment, ...). The Team filter sits with project scope on screens 1-3 and is omitted from screens 4-6.

---

## 11. Gotchas - the consolidated list

| # | Gotcha | Fix |
|---|---|---|
| 1 | Variable inside set analysis returns 0 | Inline the set expression. Variables hold values only, never set expressions. |
| 2 | Calendar pre-association breaks active-items logic | Don't use calendar selection for active-period queries. Use `vStartDate`/`vEndDate` variables and write set analysis against `wi_created_date_integer` directly. |
| 3 | Timestamp vs date integer off-by-one | Always `+1` on the upper bound: `wi_created_date_integer = {"<=$(=Num(vEndDate)+1)"}` |
| 4 | Synthetic keys from role-playing user dims | ApplyMap user names into the fact at load time. Drop the FK columns. |
| 5 | Calendar fields auto-merge across calendars | Prefix every derived calendar field: `wi_Year`, `build_Year`, `dep_Year`, `pr_Year`. |
| 6 | Donut chart redundant with KPIs | Confirm donut uses a different field from the KPIs. Releases donut uses `deployment_operation_status` (different from `deployment_status` in KPIs). |
| 7 | Build/Run distinction added complexity for ~0 benefit | Collapsed to one row per build. `build_original_build_run_id` still in the model, unused in POC. |
| 8 | Queue-to-start interval is meaningful on deployments, noise on builds | Show "Avg Approval Wait" on Releases. Don't show it on Builds. |
| 9 | Team filter on screens 4-6 has no equivalent field | Don't add it. Qlik grays it out automatically when the filter cannot resolve. |
| 10 | `area_path` derives team via SubField - lossy | Proper fix: `team_area_paths` bridge from ADO REST. Tracked, not yet built. |

---

## 12. Open tasks (current sprint)

| ID | Description | Affects | Decision |
|---|---|---|---|
| OT-1 | Rename date fields to "Created" | All screens | Cosmetic. Master dimension display labels rename `wi_created_date` → "Created", etc. Field names stay. |
| OT-2 | Active items logic: add State filter | Overview, Bugs | Replace the `vStartDate`/`vEndDate` active-period logic with an explicit State multi-select filter for the simpler case. Keep variables for true period-over-period charts. |
| OT-3 | Sprints / Iteration issue | All screens | Iteration filter currently inconsistent across calendars. Audit the iteration_path mapping per fact and confirm one canonical source. |
| OT-4 | Releases screen: finish remaining | Screen 5 | Trend chart, detail table click-through, master measure publishing. |
| OT-5 | PR screen final polish | Screen 6 | Final spec confirmation, master measures, navbar icon. |
| OT-6 | `team_area_paths` bridge | Screens 1-3 | REST endpoint integration, new bridge table in load script, rewire Team filter. |
| OT-7 | Screen 7 (TBD) | New | Topic not yet chosen. |

---

## 13. Quick reference - per screen

| Screen | Fact | Calendar | Persistent filters | Extra filters |
|---|---|---|---|---|
| Overview | work_items | wi_created | Year, Quarter, Iteration, Mador, Team | - |
| Bugs | work_items + bug_details | wi_created | Year, Quarter, Iteration, Mador, Team | State, Severity |
| Retrospect | work_items + task_details | wi_created | Year, Quarter, Iteration, Mador, Team | - |
| Builds | builds | build_start | Year, Quarter, Iteration, Mador | Pipeline, Status, Requested By |
| Releases | deployments | deployment_start | Year, Quarter, Iteration, Mador | Environment, Status, Op Status, Triggered By |
| PRs | pull_requests | pr_created | Year, Quarter, Iteration, Mador | Repository, Status, Author |

Navbar order (delivery lifecycle): **Overview → PRs → Builds → Releases → Bugs → Retrospect**.

---

*Document version: POC + screens 4-5 specified, screen 6 in finalization.*
