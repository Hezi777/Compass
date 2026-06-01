import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import ChartTooltip from './ChartTooltip';

export type DonutSlice = { name: string; value: number; color: string };

export default function Donut({
  data,
  centerLabel,
  centerSub,
}: {
  data: DonutSlice[];
  centerLabel?: string;
  centerSub?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex h-full items-center gap-3 px-2">
      <div className="relative h-full w-[58%] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="88%"
              paddingAngle={1.5}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {centerLabel && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="tnum text-[20px] font-bold leading-none text-ink">
              {centerLabel}
            </span>
            {centerSub && (
              <span className="mt-1 text-[11px] text-muted">{centerSub}</span>
            )}
          </div>
        )}
      </div>

      {/* legend */}
      <ul className="flex min-w-0 flex-col gap-1.5">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2 text-[12px]">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: d.color }}
            />
            <span className="truncate capitalize text-muted">{d.name}</span>
            <span className="tnum ml-auto shrink-0 font-semibold text-ink">
              {((d.value / total) * 100).toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
