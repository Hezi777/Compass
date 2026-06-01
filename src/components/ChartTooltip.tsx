import type { TooltipProps } from 'recharts';

/** White card tooltip matching the design system. */
export default function ChartTooltip({
  active,
  payload,
  label,
  unit = '',
  valueFormatter,
}: TooltipProps<number, string> & {
  unit?: string;
  valueFormatter?: (v: number) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2 shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
      {label !== undefined && label !== '' && (
        <p className="mb-1 text-[11px] font-semibold text-muted">{label}</p>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-[12px]">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: p.color ?? '#3b82f6' }}
          />
          <span className="text-muted">{p.name}</span>
          <span className="tnum ml-auto font-semibold text-ink">
            {valueFormatter
              ? valueFormatter(p.value as number)
              : `${p.value}${unit}`}
          </span>
        </div>
      ))}
    </div>
  );
}
