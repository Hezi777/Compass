import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Gauge, Calendar, Clock, Briefcase, Coffee } from 'lucide-react';
import AppShell from '../components/AppShell';
import KpiCard from '../components/KpiCard';
import { ChartCard } from '../components/Card';
import ChartTooltip from '../components/ChartTooltip';
import Donut from '../components/Donut';
import DetailsTable, { type Column } from '../components/DetailsTable';
import { COLORS, CATEGORY_COLORS } from '../lib/theme';

const FILTERS = [
  { label: 'Year', value: '2025' },
  { label: 'Quarter' },
  { label: 'Iteration' },
  { label: 'Project' },
  { label: 'Area Path' },
  { label: 'Category' },
  { label: 'Tag' },
];


const taskStates = [
  { name: 'Done', value: 1240, color: '#1d4ed8' },
  { name: 'In Progress', value: 420, color: '#3b82f6' },
  { name: 'To-Do', value: 360, color: '#60a5fa' },
  { name: 'Design', value: 180, color: '#14b8a6' },
  { name: 'Proposed', value: 120, color: '#f59e0b' },
  { name: 'New', value: 95, color: '#94a3b8' },
];
const taskTotal = taskStates.reduce((s, d) => s + d.value, 0);

const categories = [
  { name: 'Tech Debt', value: 17.4, color: CATEGORY_COLORS['Tech Debt'] },
  { name: 'Product', value: 28.9, color: CATEGORY_COLORS.Product },
  { name: 'Maintenance', value: 38.1, color: CATEGORY_COLORS.Maintenance },
  { name: 'Innovation', value: 15.6, color: CATEGORY_COLORS.Innovation },
];

const byProject = [
  { name: 'Web Platform', Actual: 6420, Remaining: 1840 },
  { name: 'Mobile App', Actual: 4980, Remaining: 1260 },
  { name: 'Identity', Actual: 4310, Remaining: 980 },
  { name: 'Data Platform', Actual: 3720, Remaining: 1530 },
  { name: 'DevOps & Infra', Actual: 3180, Remaining: 640 },
  { name: 'Design System', Actual: 2640, Remaining: 1120 },
  { name: 'Payments', Actual: 1960, Remaining: 760 },
];

type Task = {
  id: string;
  title: string;
  state: string;
  project: string;
  created: string;
  estimate: number;
  completed: number;
  remaining: number;
};

const tasks: Task[] = [
  { id: 'T-22841', title: 'Build OAuth token service', state: 'Done', project: 'Identity', created: '2025-03-02', estimate: 40, completed: 38, remaining: 0 },
  { id: 'T-22890', title: 'Search index sharding', state: 'In Progress', project: 'Search', created: '2025-03-15', estimate: 32, completed: 21, remaining: 11 },
  { id: 'T-22912', title: 'PDF rendering pipeline', state: 'To-Do', project: 'Reports', created: '2025-03-28', estimate: 24, completed: 0, remaining: 24 },
  { id: 'T-22945', title: 'Migrate CI runners', state: 'Done', project: 'Infra', created: '2025-04-04', estimate: 16, completed: 16, remaining: 0 },
  { id: 'T-22978', title: 'Dashboard caching layer', state: 'In Progress', project: 'Analytics', created: '2025-04-19', estimate: 28, completed: 12, remaining: 16 },
  { id: 'T-23004', title: 'Push notification opt-in', state: 'Design', project: 'Mobile', created: '2025-05-01', estimate: 20, completed: 4, remaining: 16 },
];

const columns: Column<Task>[] = [
  { key: 'id', header: 'Task ID', render: (r) => <span className="tnum font-medium text-accent">{r.id}</span> },
  { key: 'title', header: 'Title', className: 'max-w-[240px] truncate' },
  { key: 'state', header: 'State' },
  { key: 'project', header: 'Project', render: (r) => <span className="text-muted">{r.project}</span> },
  { key: 'created', header: 'Created Date', render: (r) => <span className="tnum text-muted">{r.created}</span> },
  { key: 'estimate', header: 'Original Estimate', render: (r) => <span className="tnum">{r.estimate}</span> },
  { key: 'completed', header: 'Completed Work', render: (r) => <span className="tnum">{r.completed}</span> },
  { key: 'remaining', header: 'Remaining Work', render: (r) => <span className="tnum font-semibold">{r.remaining}</span> },
];

const axisProps = {
  tick: { fontSize: 11, fill: COLORS.axis },
  axisLine: { stroke: COLORS.line },
  tickLine: false,
} as const;

export default function Retrospect() {
  return (
    <AppShell sheetName="Retrospect" filters={FILTERS}>
      <div className="grid h-full grid-rows-[auto_minmax(0,1.25fr)_minmax(0,1fr)] gap-[10px]">
        {/* Row 1 — 5 KPIs */}
        <div className="grid grid-cols-5 gap-[10px]">
          <KpiCard index={0} label="Potential Hours" value="62.4k" Icon={Gauge} />
          <KpiCard index={1} label="Planned Hours" value="54.8k" Icon={Calendar} />
          <KpiCard index={2} label="Actual Hours" value="31.6k" Icon={Clock} />
          <KpiCard index={3} label="Management Hours" value="0" Icon={Briefcase} />
          <KpiCard index={4} label="Non Working Hours" value="1,184" Icon={Coffee} />
        </div>

        {/* Row 2 — donut (left) + two stacked charts (right) */}
        <div className="grid min-h-0 grid-cols-[320px_minmax(0,1fr)] gap-[10px]">
          <ChartCard index={5} title="Task State Distribution">
            <Donut data={taskStates} centerLabel={taskTotal.toLocaleString()} centerSub="Tasks" />
          </ChartCard>

          <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-[10px]">
            {/* Work Item Category Distribution — 100% stacked bar */}
            <ChartCard
              index={6}
              title="Work Item Category Distribution"
              right={
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted">
                  {categories.map((c) => (
                    <span key={c.name} className="flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </span>
                  ))}
                </div>
              }
            >
              <div className="flex h-9 w-full overflow-hidden rounded-md">
                {categories.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-center text-[11px] font-semibold text-white"
                    style={{ width: `${c.value}%`, backgroundColor: c.color }}
                    title={`${c.name} ${c.value}%`}
                  >
                    {c.value}%
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Remaining vs Actual Hours by Project — grouped bars */}
            <ChartCard
              index={7}
              title="Remaining vs Actual Hours"
              subtitle="By Project"
              right={
                <div className="flex items-center gap-3 text-[11px] text-muted">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLORS.accent }} />Actual Hours</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#1e3a8a' }} />Remaining Hours</span>
                </div>
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byProject} margin={{ top: 18, right: 12, left: 4, bottom: 28 }} barGap={2}>
                  <CartesianGrid vertical={false} stroke={COLORS.line} />
                  <XAxis dataKey="name" {...axisProps} angle={-30} textAnchor="end" interval={0} height={46} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'rgba(59,130,246,0.06)' }} content={<ChartTooltip valueFormatter={kfmt} />} />
                  <Bar dataKey="Actual" radius={[3, 3, 0, 0]} fill={COLORS.accent} maxBarSize={26} />
                  <Bar dataKey="Remaining" radius={[3, 3, 0, 0]} fill="#1e3a8a" maxBarSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Row 3 — table */}
        <DetailsTable index={8} title="Task Details" columns={columns} rows={tasks} />
      </div>
    </AppShell>
  );
}

function kfmt(v: number | string): string {
  const n = typeof v === 'number' ? v : Number(v);
  return n >= 1000 ? `${(n / 1000).toFixed(2)}k` : String(n);
}
