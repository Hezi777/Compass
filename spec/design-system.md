# Compass Design System
> Extracted from theme.css + theme.json. These are the ground-truth values.
> Use these for every screen. Do not invent new values.

---

## Theme class
Qlik theme namespace: `.compass-theme` (set via `classRef` in theme.json)
In the HTML mockup this wraps the entire `<body>`.

---

## CSS Variables (defined on `.compass-theme *`)

```css
--bg:     #0a0e2a        /* sheet/page background */
--card:   #ffffff        /* all chart/KPI card backgrounds - WHITE, OPAQUE */
--accent: #3b82f6        /* blue, primary interactive color */
--muted:  #6b7280        /* secondary text, labels */
--axis:   #9ca3af        /* axis tick labels, tertiary text */
--line:   #e5e7eb        /* dividers, gridlines, borders */
--zebra:  #f9fafb        /* table alternating row tint */
--text:   #111827        /* primary body text, values */
--radius: 14px           /* card border-radius */
--shadow: 0 2px 12px rgba(0,0,0,0.08)   /* card shadow */
```

---

## Background
Sheet background: `radial-gradient(ellipse at 30% 50%, #0d2060, #0a0e2a, #050816)`
The wallpaper image (assets/wallpaper.jpg) IS this gradient as a JPG.
Use wallpaper.jpg as `background-image` on the page, full-screen fixed.
Add a dark overlay: `linear-gradient(180deg, rgba(5,10,24,0.2) 0%, rgba(5,10,24,0.55) 100%)`

---

## Typography
Font: **Inter** (Google Fonts, weights 400/500/600/700)
Import: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`

| Role | Size | Weight | Color |
|---|---|---|---|
| Card title / object header | 13px | 600 | `--text` #111827 |
| KPI label | 11px | 600 | `--muted` #6b7280 |
| KPI value | 2rem (32px) | 700 | `--text` #111827 |
| Table header | 11px | 600 | `--muted` #6b7280 |
| Table cell | 13px | 400 | `--text` #111827 |
| Axis labels | 11px | 400/600 | `--axis` #9ca3af |
| Filter label | 11px | 600 uppercase | `--muted` #6b7280 |
| Screen title (top bar) | 16px | 700 | white |

---

## Cards (ALL chart and KPI objects)

```css
background:    #ffffff          /* --card, always white opaque - NOT glass */
border-radius: 14px             /* --radius */
box-shadow:    0 2px 12px rgba(0,0,0,0.08)   /* --shadow */
border:        none
overflow:      hidden
padding:       20px 22px        /* KPI cards */
               14px 18px        /* chart card header */
```

**CRITICAL: Cards are white and opaque. No glassmorphism. No backdrop-filter.
The dark wallpaper background creates contrast behind white cards.**

---

## Colors

| Token | Hex | Usage |
|---|---|---|
| Primary accent | `#3b82f6` | Buttons, selected state, chart primary color, filter active |
| Secondary accent | `#1d4ed8` | Darker blue for hover states |
| Text primary | `#111827` | All body text and KPI values |
| Text muted | `#6b7280` | Labels, headers, secondary text |
| Text axis | `#9ca3af` | Axis tick labels |
| Line / border | `#e5e7eb` | Dividers, table borders, gridlines |
| Zebra | `#f9fafb` | Table even rows |
| Background | `#0a0e2a` | Page / sheet |
| Row hover | `#eff6ff` | Table row hover |
| Selection | `#dbeafe` bg / `#1e40af` text | Selected listbox item |

### Chart data color palette (from theme.json `dataColors.colors`)
```
#3b82f6   blue       (primary, bar/line default)
#10b981   emerald    (second series, success)
#f59e0b   amber      (third series, warnings)
#ef4444   red        (fourth series, errors/bugs)
#8b5cf6   violet
#06b6d4   cyan
#f97316   orange
#84cc16   lime
```

### Severity palette (Bugs screen)
```
Critical  #ef4444   (red, same as dataColors[3])
High      #f59e0b   (amber)
Medium    #f59e0b   (amber - use lighter shade or #fbbf24)
Low       #10b981   (emerald)
```

### Status/result pills
```css
.pill-blue   { background: #dbeafe; color: #1d4ed8; }
.pill-yellow { background: #fef9c3; color: #854d0e; }
.pill-red    { background: #fee2e2; color: #dc2626; }
.pill-green  { background: #dcfce7; color: #16a34a; }
```

---

## Layout (1920x1080 Qlik canvas → 1440px mockup baseline)

```
┌──────────┬─────────────────────────────────┬──────────────┐
│  Navbar  │       Chart Workspace            │ Filter Pane  │
│  ~4.5%   │       ~81.8%                     │   ~13.8%     │
│  ~86px   │       ~1178px                    │   ~198px     │
└──────────┴─────────────────────────────────┴──────────────┘
```

### Navbar (left sidebar)
- Width: ~86px fixed
- Background: `#0f1a2e` (deep navy, solid - NOT transparent)
- Logo: top center, 40px
- Nav icons: Lucide PNGs (or inline SVG), 2 states:
  - Default: `#14253D` icon color, no bar
  - Selected: `#0f7af8` icon color + 3px right-edge bar `#0f7af8`
- Icon tap area: 44px height, full width
- Hover: `background-color: rgba(15,122,248,0.08)` pill, `border-radius: 8px`
- Nav order (top to bottom): LayoutDashboard, GitPullRequest, Wrench, Rocket, Bug, RotateCcw

### Filter pane (right sidebar)
- Width: ~198px fixed
- Background: white card, same `--card` style
- Contains: Year, Quarter, Iteration, Mador, Team filters (screens 1-3)
- Filter label: 11px 600 uppercase `--muted`
- Filter control: border `1px solid #cfd8e4`, border-radius 10px
- Selected: `background: #3b82f6; color: #ffffff`

### Chart workspace (center)
- Fills remaining space
- Padding: 20px
- Gap between cards: 16px
- Cards fill the workspace in a CSS grid / flex layout

---

## Chart styling (from theme.json object specs)

### Bar chart
- Axis label: 11px Inter `#9ca3af`
- Gridline: stroke `#1e2a4a`, 1px (very subtle dark line on dark bg — in mockup use `#e5e7eb` on white cards)
- Legend: 11px `#6b7280`
- Bar color default: `#3b82f6`

### Line chart
- Axis label: 11px Inter `#9ca3af`
- Gridline: stroke `#1e2a4a` / `#e5e7eb` in mockup
- Point radius: 3, stroke `#3b82f6`
- Line color: `#3b82f6`

### Table
- Header: 11px 600 `#6b7280`, background `#f9fafb`
- Cell: 13px `#111827`, padding 9px 14px
- Border: `1px solid #e5e7eb`
- Zebra even: `#f9fafb`
- Hover: `#eff6ff`

---

## Selections bar
- Background: `#1e2a4a`
- Border-bottom: `1px solid #2d3f6b`
- Selection chip: `background #3b82f6`, border-radius 6px, white text, 12px 600

---

## Scrollbars
- Width: 6px
- Thumb: `#cbd5e1`, border-radius 99px
- Thumb hover: `#94a3b8`
