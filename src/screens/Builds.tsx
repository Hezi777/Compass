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
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import AppShell from '../components/AppShell';
import KpiCard from '../components/KpiCard';
import { ChartCard } from '../components/Card';
import ChartTooltip from '../components/ChartTooltip';
import Donut from '../components/Donut';
import DetailsTable, { type Column, StatusPill } from '../components/DetailsTable';
import { COLORS, STATUS_COLORS } from '../lib/theme';

const FILTERS = [
  { label: 'Year', value: '2025' },
  { label: 'Quarter' },
  { label: 'Iteration' },
  { label: 'Project' },
  { label: 'Build ID' },
  { label: 'Status' },
];


const avgBuildTime = [
  { name: '2023', value: 512 },
  { name: '2024', value: 489 },
  { name: '2025', value: 463 },
  { name: '2026', value: 438 },
];

const slowest = [
  { name: 'web-frontend-ci', value: 432 },
  { name: 'api-backend-ci', value: 408 },
  { name: 'search-svc-ci', value: 386 },
  { name: 'reports-api-ci', value: 357 },
  { name: 'identity-ci', value: 331 },
  { name: 'infra-ci', value: 298 },
  { name: 'mobile-sdk-ci', value: 264 },
  { name: 'analytics-ci', value: 221 },
  { name: 'gateway-ci', value: 187 },
  { name: 'notifier-ci', value: 152 },
];

const statusDist = [
  { name: 'succeeded', value: 1720, color: STATUS_COLORS.succeeded },
  { name: 'failed', value: 574, color: STATUS_COLORS.failed },
  { name: 'Partially Succeeded', value: 196, color: STATUS_COLORS.partiallySucceeded },
  { name: 'canceled', value: 118, color: STATUS_COLORS.canceled },
];

const BUILD_RESULT_COLOR: Record<string, string> = {
  succeeded: STATUS_COLORS.succeeded,
  failed: STATUS_COLORS.failed,
  canceled: STATUS_COLORS.canceled,
  partiallySucceeded: STATUS_COLORS.partiallySucceeded,
};

type Build = {
  id: string;
  name: string;
  triggeredBy: string;
  reason: string;
  start: string;
  end: string;
  minutes: number;
  status: string;
  result: 'succeeded' | 'failed' | 'canceled' | 'partiallySucceeded';
};

const builds: Build[] = [
  { id: '88241', name: 'web-frontend-ci', triggeredBy: 'Amit Cohen', reason: 'individualCI', start: '2025-12-05 08:12', end: '2025-12-05 08:54', minutes: 42, status: 'completed', result: 'succeeded' },
  { id: '88240', name: 'api-backend-ci', triggeredBy: 'Sara Levi', reason: 'pullRequest', start: '2025-12-05 07:40', end: '2025-12-05 08:35', minutes: 55, status: 'completed', result: 'failed' },
  { id: '88239', name: 'search-svc-ci', triggeredBy: 'Yossi Ben', reason: 'batchedCI', start: '2025-12-05 06:55', end: '2025-12-05 07:33', minutes: 38, status: 'completed', result: 'succeeded' },
  { id: '88231', name: 'reports-api-ci', triggeredBy: 'Noa Klein', reason: 'manual', start: '2025-12-04 22:10', end: '2025-12-04 23:01', minutes: 51, status: 'completed', result: 'partiallySucceeded' },
  { id: '88224', name: 'identity-ci', triggeredBy: 'Tamar Gal', reason: 'schedule', start: '2025-12-04 02:00', end: '2025-12-04 02:39', minutes: 39, status: 'completed', result: 'succeeded' },
  { id: '88219', name: 'infra-ci', triggeredBy: 'David Mor', reason: 'individualCI', start: '2025-12-03 14:25', end: '2025-12-03 14:47', minutes: 22, status: 'canceled', result: 'canceled' },
];

const columns: Column<Build>[] = [
  { key: 'id', header: 'Build ID', render: (r) => <span className="tnum font-medium text-accent">{r.id}</span> },
  { key: 'name', header: 'Name', className: 'max-w-[150px] truncate' },
  { key: 'triggeredBy', header: 'Triggered By' },
  { key: 'reason', header: 'Reason', render: (r) => <span className="text-muted">{r.reason}</span> },
  { key: 'start', header: 'Start Date', render: (r) => <span className="tnum text-muted">{r.start}</span> },
  { key: 'end', header: 'End Date', render: (r) => <span className="tnum text-muted">{r.end}</span> },
  { key: 'minutes', header: 'Build Time (Mins)', render: (r) => <span className="tnum font-semibold">{r.minutes}</span> },
  { key: 'status', header: 'Status', render: (r) => <span className="capitalize text-muted">{r.status}</span> },
  { key: 'result', header: 'Result', render: (r) => <StatusPill label={r.result} color={BUILD_RESULT_COLOR[r.result]} /> },
];

const axisProps = {
  tick: { fontSize: 11, fill: COLORS.axis },
  axisLine: { stroke: COLORS.line },
  tickLine: false,
} as const;

export default function Builds() {
  return (
    <AppShell sheetName="Builds" filters={FILTERS}>
      <div className="grid h-full grid-rows-[auto_minmax(0,1.25fr)_minmax(0,1fr)] gap-[10px]">
        <div className="grid grid-cols-3 gap-[10px]">
          <KpiCard index={0} label="Avg Pipeline Build Time" value="463 Mins" Icon={Clock} />
          <KpiCard index={1} label="% Successful Builds" value="68%" Icon={CheckCircle} valueColor={STATUS_COLORS.succeeded} />
          <KpiCard index={2} label="% Failed Builds" value="23%" Icon={XCircle} valueColor={STATUS_COLORS.failed} />
        </div>

        <div className="grid min-h-0 grid-cols-3 gap-[10px]">
          <ChartCard index={3} title="Average CI Pipeline Build Time (Mins)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgBuildTime} margin={{ top: 22, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid vertical={false} stroke={COLORS.line} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(59,130,246,0.06)' }} content={<ChartTooltip unit=" m" />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={COLORS.accent} maxBarSize={70}>
                  <LabelList dataKey="value" position="top" className="tnum" fill={COLORS.ink} fontSize={11} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard index={4} title="Top 10 Slowest Pipelines (Mins)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slowest} margin={{ top: 22, right: 8, left: 60, bottom: 30 }}>
                <CartesianGrid vertical={false} stroke={COLORS.line} />
                <XAxis dataKey="name" {...axisProps} angle={-35} textAnchor="end" interval={0} height={52} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(59,130,246,0.06)' }} content={<ChartTooltip unit=" m" />} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} fill={COLORS.accent} maxBarSize={34}>
                  <LabelList dataKey="value" position="top" className="tnum" fill={COLORS.ink} fontSize={10} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard index={5} title="Status Distribution">
            <Donut data={statusDist} centerLabel="2.61k" centerSub="Builds" />
          </ChartCard>
        </div>

        <DetailsTable index={6} title="Pipeline Details" columns={columns} rows={builds} />
      </div>
    </AppShell>
  );
}
