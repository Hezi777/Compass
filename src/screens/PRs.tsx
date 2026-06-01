import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GitPullRequest, GitPullRequestArrow, Clock } from 'lucide-react';
import AppShell from '../components/AppShell';
import KpiCard from '../components/KpiCard';
import { ChartCard } from '../components/Card';
import ChartTooltip from '../components/ChartTooltip';
import Donut from '../components/Donut';
import DetailsTable, { type Column, StatusPill } from '../components/DetailsTable';
import { COLORS } from '../lib/theme';

const FILTERS = [
  { label: 'PR Year', value: '2025' },
  { label: 'PR Quarter' },
  { label: 'PR Iteration' },
  { label: 'Project' },
  { label: 'Status' },
];


const avgClosure = [
  { name: '2023', value: 712 },
  { name: '2024', value: 624 },
  { name: '2025', value: 538 },
  { name: '2026', value: 421 },
];

const durations = [
  12.4, 12.1, 11.9, 11.7, 11.5, 11.3, 11.1, 10.9, 10.7, 10.5, 10.3, 10.1, 9.9,
  9.7, 9.5, 9.3, 9.1, 8.9, 8.7, 8.5, 8.3, 8.1, 7.9, 7.6,
].map((v, i) => ({ name: `PR-${2980 - i}`, value: Math.round(v * 1000) }));

const statusDist = [
  { name: 'completed', value: 2118, color: COLORS.accent },
  { name: 'active', value: 154, color: COLORS.success },
  { name: 'abandoned', value: 96, color: COLORS.error },
];

const PR_STATUS_COLOR: Record<string, string> = {
  completed: COLORS.accent,
  active: COLORS.success,
  abandoned: COLORS.error,
};

type PR = {
  id: string;
  repo: string;
  title: string;
  status: 'completed' | 'active' | 'abandoned';
  created: string;
  closed: string;
  author: string;
  iteration: string;
};

const prs: PR[] = [
  { id: 'PR-2980', repo: 'api-backend', title: 'Add OAuth2 login flow', status: 'active', created: '2025-12-05', closed: '—', author: 'Amit Cohen', iteration: 'Sprint 26.2' },
  { id: 'PR-2979', repo: 'web-frontend', title: 'Fix pagination bug', status: 'completed', created: '2025-12-04', closed: '2025-12-06', author: 'Sara Levi', iteration: 'Sprint 26.2' },
  { id: 'PR-2967', repo: 'search-svc', title: 'Refactor search service', status: 'completed', created: '2025-11-28', closed: '2025-12-01', author: 'Yossi Ben', iteration: 'Sprint 26.1' },
  { id: 'PR-2951', repo: 'reports-api', title: 'Add PDF export endpoint', status: 'active', created: '2025-11-22', closed: '—', author: 'Noa Klein', iteration: 'Sprint 26.1' },
  { id: 'PR-2934', repo: 'infra', title: 'Update CI config', status: 'abandoned', created: '2025-11-15', closed: '2025-11-19', author: 'Tamar Gal', iteration: 'Sprint 25.3' },
  { id: 'PR-2922', repo: 'web-frontend', title: 'Upgrade dependencies', status: 'completed', created: '2025-11-10', closed: '2025-11-12', author: 'David Mor', iteration: 'Sprint 25.3' },
];

const columns: Column<PR>[] = [
  { key: 'id', header: 'PR ID', render: (r) => <span className="tnum font-medium text-accent">{r.id}</span> },
  { key: 'repo', header: 'Repo', render: (r) => <span className="text-muted">{r.repo}</span> },
  { key: 'title', header: 'Title', className: 'max-w-[220px] truncate' },
  { key: 'status', header: 'Status', render: (r) => <StatusPill label={r.status} color={PR_STATUS_COLOR[r.status]} /> },
  { key: 'created', header: 'Created Date', render: (r) => <span className="tnum text-muted">{r.created}</span> },
  { key: 'closed', header: 'Closed Date', render: (r) => <span className="tnum text-muted">{r.closed}</span> },
  { key: 'author', header: 'Created By' },
  { key: 'iteration', header: 'Iteration', render: (r) => <span className="text-muted">{r.iteration}</span> },
];

const axisProps = {
  tick: { fontSize: 11, fill: COLORS.axis },
  axisLine: { stroke: COLORS.line },
  tickLine: false,
} as const;

export default function PRs() {
  return (
    <AppShell sheetName="Pull Requests" filters={FILTERS}>
      <div className="grid h-full grid-rows-[auto_minmax(0,1.25fr)_minmax(0,1fr)] gap-[10px]">
        <div className="grid grid-cols-3 gap-[10px]">
          <KpiCard index={0} label="Total Pull Requests" value="2.37k" Icon={GitPullRequest} />
          <KpiCard index={1} label="Total Open PRs" value="154" Icon={GitPullRequestArrow} valueColor={COLORS.accent} />
          <KpiCard index={2} label="Average PRs Closure Time" value="538 Hours" Icon={Clock} />
        </div>

        <div className="grid min-h-0 grid-cols-3 gap-[10px]">
          <ChartCard index={3} title="Average Pull Request's Closure Time">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgClosure} margin={{ top: 22, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid vertical={false} stroke={COLORS.line} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(59,130,246,0.06)' }} content={<ChartTooltip unit=" h" />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={COLORS.accent} maxBarSize={70}>
                  <LabelList dataKey="value" position="top" className="tnum" fill={COLORS.ink} fontSize={11} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard index={4} title="Specific Pull Request Duration (Hours)" subtitle="Scroll or move mini chart to move">
            <div className="h-full overflow-x-auto pb-1">
              <div style={{ width: durations.length * 32, height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={durations} margin={{ top: 20, right: 4, left: 4, bottom: 18 }}>
                    <CartesianGrid vertical={false} stroke={COLORS.line} />
                    <XAxis dataKey="name" {...axisProps} angle={-35} textAnchor="end" interval={0} height={34} fontSize={9} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: 'rgba(59,130,246,0.06)' }} content={<ChartTooltip valueFormatter={kfmt} />} />
                    <Bar dataKey="value" radius={[3, 3, 0, 0]} fill={COLORS.accent} maxBarSize={20}>
                      <LabelList dataKey="value" position="top" formatter={kfmt} className="tnum" fill={COLORS.ink} fontSize={9} fontWeight={600} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartCard>

          <ChartCard index={5} title="Status Distribution">
            <Donut data={statusDist} centerLabel="2.37k" centerSub="PRs" />
          </ChartCard>
        </div>

        <DetailsTable index={6} title="Pull Requests Details" columns={columns} rows={prs} />
      </div>
    </AppShell>
  );
}

function kfmt(v: number | string): string {
  const n = typeof v === 'number' ? v : Number(v);
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
