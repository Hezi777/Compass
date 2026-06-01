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
  { label: 'Environment', value: 'Prod' },
  { label: 'Deployment Status' },
  { label: 'Operation Status' },
  { label: 'Triggered By' },
];


const overTime = [
  { name: '2023', value: 624 },
  { name: '2024', value: 968 },
  { name: '2025', value: 1342 },
  { name: '2026', value: 1508 },
];

const cdDuration = [
  { name: 'release-web', value: 18.4 },
  { name: 'release-api', value: 16.1 },
  { name: 'release-search', value: 13.7 },
  { name: 'release-reports', value: 11.2 },
  { name: 'release-identity', value: 9.5 },
  { name: 'release-infra', value: 7.8 },
  { name: 'release-mobile', value: 6.1 },
  { name: 'release-gateway', value: 4.6 },
  { name: 'release-notifier', value: 3.2 },
  { name: 'release-cron', value: 1.8 },
];

const opStatus = [
  { name: 'Approved', value: 2384, color: STATUS_COLORS.succeeded },
  { name: 'PhaseFailed', value: 412, color: STATUS_COLORS.failed },
  { name: 'Canceled', value: 168, color: STATUS_COLORS.canceled },
];

const OP_COLOR: Record<string, string> = {
  Approved: STATUS_COLORS.succeeded,
  PhaseFailed: STATUS_COLORS.failed,
  Canceled: STATUS_COLORS.canceled,
};

type Deployment = {
  id: string;
  env: string;
  triggeredBy: string;
  requestedFor: string;
  reason: string;
  status: string;
  op: 'Approved' | 'PhaseFailed' | 'Canceled';
  start: string;
  duration: number;
  wait: number;
};

const deployments: Deployment[] = [
  { id: 'D-5521', env: 'Prod', triggeredBy: 'Amit Cohen', requestedFor: 'Sara Levi', reason: 'automated', status: 'succeeded', op: 'Approved', start: '2025-12-05 09:02', duration: 8.4, wait: 3.8 },
  { id: 'D-5520', env: 'Stage', triggeredBy: 'Yossi Ben', requestedFor: 'Noa Klein', reason: 'manual', status: 'failed', op: 'PhaseFailed', start: '2025-12-05 08:11', duration: 12.1, wait: 5.2 },
  { id: 'D-5514', env: 'Prod', triggeredBy: 'Tamar Gal', requestedFor: 'David Mor', reason: 'automated', status: 'succeeded', op: 'Approved', start: '2025-12-04 22:40', duration: 7.6, wait: 2.9 },
  { id: 'D-5509', env: 'Dev', triggeredBy: 'David Mor', requestedFor: 'Amit Cohen', reason: 'scheduled', status: 'canceled', op: 'Canceled', start: '2025-12-04 18:25', duration: 0.0, wait: 1.1 },
  { id: 'D-5503', env: 'Prod', triggeredBy: 'Sara Levi', requestedFor: 'Yossi Ben', reason: 'automated', status: 'succeeded', op: 'Approved', start: '2025-12-04 14:03', duration: 9.2, wait: 4.4 },
  { id: 'D-5498', env: 'Stage', triggeredBy: 'Noa Klein', requestedFor: 'Tamar Gal', reason: 'manual', status: 'succeeded', op: 'Approved', start: '2025-12-03 11:50', duration: 6.7, wait: 3.1 },
];

const columns: Column<Deployment>[] = [
  { key: 'id', header: 'Deployment ID', render: (r) => <span className="tnum font-medium text-accent">{r.id}</span> },
  { key: 'env', header: 'Environment' },
  { key: 'triggeredBy', header: 'Triggered By' },
  { key: 'requestedFor', header: 'Requested For' },
  { key: 'reason', header: 'Reason', render: (r) => <span className="text-muted">{r.reason}</span> },
  { key: 'status', header: 'Deployment Status', render: (r) => <span className="capitalize text-muted">{r.status}</span> },
  { key: 'op', header: 'Operation Status', render: (r) => <StatusPill label={r.op} color={OP_COLOR[r.op]} /> },
  { key: 'start', header: 'Start Date', render: (r) => <span className="tnum text-muted">{r.start}</span> },
  { key: 'duration', header: 'Duration (Mins)', render: (r) => <span className="tnum font-semibold">{r.duration.toFixed(1)}</span> },
  { key: 'wait', header: 'Approval Wait (Mins)', render: (r) => <span className="tnum text-muted">{r.wait.toFixed(1)}</span> },
];

const axisProps = {
  tick: { fontSize: 11, fill: COLORS.axis },
  axisLine: { stroke: COLORS.line },
  tickLine: false,
} as const;

export default function Releases() {
  return (
    <AppShell sheetName="Releases" filters={FILTERS}>
      <div className="grid h-full grid-rows-[auto_minmax(0,1.25fr)_minmax(0,1fr)] gap-[10px]">
        <div className="grid grid-cols-4 gap-[10px]">
          <KpiCard index={0} label="Avg Deployment Duration" value="8.4 Mins" Icon={Clock} />
          <KpiCard index={1} label="Avg Approval Wait" value="3.8 Mins" Icon={Clock} />
          <KpiCard index={2} label="Deployment Success Rate %" value="78.3%" Icon={CheckCircle} valueColor={STATUS_COLORS.succeeded} />
          <KpiCard index={3} label="Failed Deployments" value="218" Icon={XCircle} valueColor={STATUS_COLORS.failed} />
        </div>

        <div className="grid min-h-0 grid-cols-3 gap-[10px]">
          <ChartCard index={4} title="Deployments Over Time">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overTime} margin={{ top: 22, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid vertical={false} stroke={COLORS.line} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(59,130,246,0.06)' }} content={<ChartTooltip valueFormatter={nfmt} />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={COLORS.accent} maxBarSize={70}>
                  <LabelList dataKey="value" position="top" formatter={nfmt} className="tnum" fill={COLORS.ink} fontSize={11} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard index={5} title="Average CD Pipeline Duration (Mins)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cdDuration} margin={{ top: 22, right: 8, left: 4, bottom: 30 }}>
                <CartesianGrid vertical={false} stroke={COLORS.line} />
                <XAxis dataKey="name" {...axisProps} angle={-35} textAnchor="end" interval={0} height={52} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(59,130,246,0.06)' }} content={<ChartTooltip unit=" m" />} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} fill={COLORS.accent} maxBarSize={32}>
                  <LabelList dataKey="value" position="top" className="tnum" fill={COLORS.ink} fontSize={10} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard index={6} title="CD Deployment Operation Status">
            <Donut data={opStatus} centerLabel="2.96k" centerSub="Deployments" />
          </ChartCard>
        </div>

        <DetailsTable index={7} title="Deployment Detail" columns={columns} rows={deployments} />
      </div>
    </AppShell>
  );
}

function nfmt(v: number | string): string {
  const n = typeof v === 'number' ? v : Number(v);
  return n.toLocaleString();
}
