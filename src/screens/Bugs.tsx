import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Bug, Clock, AlertTriangle } from 'lucide-react';
import AppShell from '../components/AppShell';
import KpiCard from '../components/KpiCard';
import { ChartCard } from '../components/Card';
import ChartTooltip from '../components/ChartTooltip';
import DetailsTable, { type Column } from '../components/DetailsTable';
import { COLORS, SEVERITY_COLORS } from '../lib/theme';

const FILTERS = [
  { label: 'Year', value: '2025' },
  { label: 'Quarter' },
  { label: 'Iteration' },
  { label: 'Project' },
  { label: 'Area Path' },
  { label: 'State' },
  { label: 'Severity' },
];


const SEV_ORDER = ['Critical', 'High', 'Medium', 'Low'] as const;

// stacked by severity
const openClosed = [
  { name: 'Closed', Critical: 62, High: 148, Medium: 286, Low: 197 },
  { name: 'Open', Critical: 34, High: 71, Medium: 86, Low: 49 },
];

const avgClosure = [
  { name: '2023', value: 41 },
  { name: '2024', value: 34 },
  { name: '2025', value: 28 },
  { name: '2026', value: 19 },
];

const oldest = [
  { name: 'BUG-4012', value: 214, sev: 'Critical' },
  { name: 'BUG-3987', value: 198, sev: 'High' },
  { name: 'BUG-4120', value: 181, sev: 'Critical' },
  { name: 'BUG-3850', value: 167, sev: 'Medium' },
  { name: 'BUG-4055', value: 152, sev: 'High' },
  { name: 'BUG-3777', value: 138, sev: 'Low' },
  { name: 'BUG-4188', value: 121, sev: 'High' },
  { name: 'BUG-3902', value: 107, sev: 'Medium' },
  { name: 'BUG-4201', value: 94, sev: 'Critical' },
  { name: 'BUG-3699', value: 78, sev: 'Low' },
] as const;

type BugRow = {
  id: string;
  title: string;
  state: string;
  severity: keyof typeof SEVERITY_COLORS;
  created: string;
  project: string;
  age: number;
};

const bugs: BugRow[] = [
  { id: 'BUG-4012', title: 'Checkout fails on Safari 17', state: 'Active', severity: 'Critical', created: '2025-05-02', project: 'web-frontend', age: 214 },
  { id: 'BUG-3987', title: 'Search timeout under load', state: 'Active', severity: 'High', created: '2025-05-18', project: 'search-svc', age: 198 },
  { id: 'BUG-4120', title: 'Token refresh race condition', state: 'Committed', severity: 'Critical', created: '2025-06-01', project: 'identity', age: 181 },
  { id: 'BUG-3850', title: 'PDF export missing footer', state: 'Active', severity: 'Medium', created: '2025-06-20', project: 'reports-api', age: 167 },
  { id: 'BUG-4055', title: 'Webhook retries duplicated', state: 'New', severity: 'High', created: '2025-07-05', project: 'api-backend', age: 152 },
  { id: 'BUG-3777', title: 'Tooltip clipped on mobile', state: 'Active', severity: 'Low', created: '2025-07-21', project: 'web-frontend', age: 138 },
];

const columns: Column<BugRow>[] = [
  { key: 'id', header: 'Bug ID', render: (r) => <span className="tnum font-medium text-accent">{r.id}</span> },
  { key: 'title', header: 'Title', className: 'max-w-[260px] truncate' },
  { key: 'state', header: 'State' },
  {
    key: 'severity',
    header: 'Severity',
    render: (r) => (
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[r.severity] }} />
        {r.severity}
      </span>
    ),
  },
  { key: 'created', header: 'Created Date', render: (r) => <span className="tnum text-muted">{r.created}</span> },
  { key: 'project', header: 'Project', render: (r) => <span className="text-muted">{r.project}</span> },
  { key: 'age', header: 'Age', render: (r) => <span className="tnum font-semibold">{r.age} d</span> },
];

const axisProps = {
  tick: { fontSize: 11, fill: COLORS.axis },
  axisLine: { stroke: COLORS.line },
  tickLine: false,
} as const;

export default function Bugs() {
  return (
    <AppShell sheetName="Bugs" filters={FILTERS}>
      <div className="grid h-full grid-rows-[auto_minmax(0,1.25fr)_minmax(0,1fr)] gap-[10px]">
        <div className="grid grid-cols-3 gap-[10px]">
          <KpiCard index={0} label="Total Bugs" value="847" Icon={Bug} />
          <KpiCard index={1} label="Avg Age Open" value="286 Days" Icon={Clock} />
          <KpiCard index={2} label="Critical Bug Rate" value="11.8%" Icon={AlertTriangle} valueColor={SEVERITY_COLORS.Critical} />
        </div>

        <div className="grid min-h-0 grid-cols-3 gap-[10px]">
          {/* Open vs Closed Bugs — stacked by severity */}
          <ChartCard
            index={3}
            title="Open vs Closed Bugs"
            subtitle="By Severity"
            right={
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted">
                {SEV_ORDER.map((s) => (
                  <span key={s} className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: SEVERITY_COLORS[s] }} />
                    {s}
                  </span>
                ))}
              </div>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={openClosed} margin={{ top: 14, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid vertical={false} stroke={COLORS.line} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(59,130,246,0.06)' }} content={<ChartTooltip />} />
                {SEV_ORDER.map((s, i) => (
                  <Bar
                    key={s}
                    dataKey={s}
                    stackId="sev"
                    fill={SEVERITY_COLORS[s]}
                    maxBarSize={84}
                    radius={i === SEV_ORDER.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Average Bug Closure Time — bars + trend line */}
          <ChartCard index={4} title="Average Bug Closure Time" subtitle="In Days">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={avgClosure} margin={{ top: 22, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid vertical={false} stroke={COLORS.line} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(59,130,246,0.06)' }} content={<ChartTooltip unit=" d" />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={COLORS.accent} maxBarSize={70}>
                  <LabelList dataKey="value" position="top" className="tnum" fill={COLORS.ink} fontSize={11} fontWeight={600} />
                </Bar>
                <Line type="monotone" dataKey="value" stroke={COLORS.ink} strokeWidth={1.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top 10 Oldest Open Bugs — colored by severity */}
          <ChartCard index={5} title="Top 10 Oldest Open Bugs" subtitle="In Days">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={oldest as unknown as typeof avgClosure} margin={{ top: 22, right: 8, left: 4, bottom: 28 }}>
                <CartesianGrid vertical={false} stroke={COLORS.line} />
                <XAxis dataKey="name" {...axisProps} angle={-35} textAnchor="end" interval={0} height={48} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(59,130,246,0.06)' }} content={<ChartTooltip unit=" d" />} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={30}>
                  {oldest.map((d) => (
                    <Cell key={d.name} fill={SEVERITY_COLORS[d.sev as keyof typeof SEVERITY_COLORS]} />
                  ))}
                  <LabelList dataKey="value" position="top" className="tnum" fill={COLORS.ink} fontSize={10} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <DetailsTable index={6} title="Bug Details" columns={columns} rows={bugs} />
      </div>
    </AppShell>
  );
}
