import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Boxes, Trophy, ClipboardList, ClipboardCheck } from 'lucide-react';
import AppShell from '../components/AppShell';
import KpiCard from '../components/KpiCard';
import { ChartCard } from '../components/Card';
import Toggle from '../components/Toggle';
import ChartTooltip from '../components/ChartTooltip';
import DetailsTable, { type Column } from '../components/DetailsTable';
import { COLORS } from '../lib/theme';

const FILTERS = [
  { label: 'Year', value: '2025' },
  { label: 'Quarter' },
  { label: 'Iteration' },
  { label: 'Project', value: 'Web Platform' },
  { label: 'Area Path' },
];


const openClosed = [
  { name: 'Closed', value: 2140, fill: COLORS.accent },
  { name: 'Open', value: 1320, fill: COLORS.success },
];

const topOpen = {
  Features: [
    { name: 'F-1042', value: 188 },
    { name: 'F-0931', value: 176 },
    { name: 'F-1188', value: 165 },
    { name: 'F-0774', value: 154 },
    { name: 'F-1290', value: 142 },
    { name: 'F-0615', value: 131 },
    { name: 'F-1356', value: 120 },
    { name: 'F-0488', value: 109 },
    { name: 'F-1401', value: 98 },
    { name: 'F-0902', value: 72 },
  ],
  PBIs: [
    { name: 'PBI-3320', value: 112 },
    { name: 'PBI-2981', value: 104 },
    { name: 'PBI-3402', value: 97 },
    { name: 'PBI-2774', value: 89 },
    { name: 'PBI-3590', value: 81 },
    { name: 'PBI-3015', value: 73 },
    { name: 'PBI-3456', value: 66 },
    { name: 'PBI-2688', value: 58 },
    { name: 'PBI-3601', value: 49 },
    { name: 'PBI-2902', value: 31 },
  ],
};

const avgClosure = {
  Features: [
    { name: '2023', value: 58 },
    { name: '2024', value: 49 },
    { name: '2025', value: 41 },
    { name: '2026', value: 33 },
  ],
  PBIs: [
    { name: '2023', value: 12.4 },
    { name: '2024', value: 10.1 },
    { name: '2025', value: 8.3 },
    { name: '2026', value: 6.9 },
  ],
};

type WorkItem = {
  id: string;
  type: string;
  title: string;
  state: string;
  team: string;
  created: string;
  closed: string;
};

const workItems: WorkItem[] = [
  { id: '104821', type: 'Feature', title: 'Customer portal redesign', state: 'Active', team: 'Platform', created: '2025-01-14', closed: '—' },
  { id: '104822', type: 'Product Backlog Item', title: 'Fix search pagination', state: 'Closed', team: 'Search', created: '2025-02-03', closed: '2025-03-12' },
  { id: '104830', type: 'Task', title: 'Upgrade PostgreSQL 15→16', state: 'Done', team: 'Infra', created: '2025-02-19', closed: '2025-03-01' },
  { id: '104845', type: 'Bug', title: 'Null pointer on export', state: 'Closed', team: 'Reports', created: '2025-03-08', closed: '2025-03-15' },
  { id: '104860', type: 'Product Backlog Item', title: 'Add team-level metrics', state: 'Committed', team: 'Analytics', created: '2025-03-22', closed: '—' },
  { id: '104877', type: 'Feature', title: 'Multi-tenant auth layer', state: 'Active', team: 'Identity', created: '2025-04-02', closed: '—' },
];

const columns: Column<WorkItem>[] = [
  { key: 'id', header: 'Work Item ID', render: (r) => <span className="tnum font-medium text-accent">{r.id}</span> },
  { key: 'type', header: 'Type' },
  { key: 'title', header: 'Title', className: 'max-w-[260px] truncate' },
  { key: 'state', header: 'State' },
  { key: 'team', header: 'Team' },
  { key: 'created', header: 'Created', render: (r) => <span className="tnum text-muted">{r.created}</span> },
  { key: 'closed', header: 'Closed', render: (r) => <span className="tnum text-muted">{r.closed}</span> },
];

const axisProps = {
  tick: { fontSize: 11, fill: COLORS.axis },
  axisLine: { stroke: COLORS.line },
  tickLine: false,
} as const;

export default function Overview() {
  const [topMode, setTopMode] = useState<'Features' | 'PBIs'>('Features');
  const [avgMode, setAvgMode] = useState<'Features' | 'PBIs'>('Features');

  const topData = topOpen[topMode];
  const minIdx = topData.reduce((mi, d, i, a) => (d.value < a[mi].value ? i : mi), 0);

  return (
    <AppShell sheetName="Overview" filters={FILTERS}>
      <div className="grid h-full grid-rows-[auto_minmax(0,1.25fr)_minmax(0,1fr)] gap-[10px]">
        {/* Row 1 — KPIs */}
        <div className="grid grid-cols-4 gap-[10px]">
          <KpiCard index={0} label="Total Work Items" value="86.4k" Icon={Boxes} />
          <KpiCard index={1} label="Total Features" value="1.42k" Icon={Trophy} />
          <KpiCard index={2} label="Total PBIs" value="3.61k" Icon={ClipboardList} />
          <KpiCard index={3} label="Total Tasks" value="17.83k" Icon={ClipboardCheck} />
        </div>

        {/* Row 2 — three charts */}
        <div className="grid min-h-0 grid-cols-3 gap-[10px]">
          <ChartCard
            index={4}
            title="Open vs Closed PBIs"
            right={
              <div className="flex items-center gap-3 text-[11px] text-muted">
                <Legend color={COLORS.accent} label="Closed" />
                <Legend color={COLORS.success} label="Open" />
              </div>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={openClosed} margin={{ top: 22, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid vertical={false} stroke={COLORS.line} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(59,130,246,0.06)' }} content={<ChartTooltip valueFormatter={kfmt} />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={84}>
                  {openClosed.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                  <LabelList dataKey="value" position="top" formatter={kfmt} className="tnum" fill={COLORS.ink} fontSize={12} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            index={5}
            title="Top 10 Open (Days)"
            right={<Toggle options={['Features', 'PBIs'] as const} value={topMode} onChange={setTopMode} />}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topData} margin={{ top: 22, right: 8, left: 4, bottom: 18 }}>
                <CartesianGrid vertical={false} stroke={COLORS.line} />
                <XAxis dataKey="name" {...axisProps} angle={-35} textAnchor="end" interval={0} height={40} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(245,158,11,0.08)' }} content={<ChartTooltip unit=" d" />} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {topData.map((_, i) => (
                    <Cell key={i} fill={i === minIdx ? COLORS.error : COLORS.warning} />
                  ))}
                  <LabelList dataKey="value" position="top" className="tnum" fill={COLORS.ink} fontSize={10} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            index={6}
            title="Average Closure Time (Days)"
            right={<Toggle options={['Features', 'PBIs'] as const} value={avgMode} onChange={setAvgMode} />}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgClosure[avgMode]} margin={{ top: 22, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid vertical={false} stroke={COLORS.line} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(59,130,246,0.06)' }} content={<ChartTooltip unit=" d" />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={COLORS.accent} maxBarSize={70}>
                  <LabelList dataKey="value" position="top" className="tnum" fill={COLORS.ink} fontSize={11} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Row 3 — table */}
        <DetailsTable index={7} title="Work Item Details" columns={columns} rows={workItems} />
      </div>
    </AppShell>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function kfmt(v: number | string): string {
  const n = typeof v === 'number' ? v : Number(v);
  return n >= 1000 ? `${(n / 1000).toFixed(2)}k` : String(n);
}
