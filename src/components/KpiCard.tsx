import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';

export default function KpiCard({
  label,
  value,
  Icon,
  index = 0,
  valueColor = '#111827',
}: {
  label: string;
  value: string;
  Icon: LucideIcon;
  index?: number;
  valueColor?: string;
}) {
  return (
    <Card index={index} className="h-full border border-[#eaeef5]">
      <div className="flex h-full items-center justify-between px-[16px] py-[12px]">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[11px] font-semibold text-muted">
            {label}
          </span>
          <span
            className="tnum mt-1 text-[26px] font-bold leading-none"
            style={{ color: valueColor }}
          >
            {value}
          </span>
        </div>
        <Icon size={28} strokeWidth={1.75} className="shrink-0 text-accent" />
      </div>
    </Card>
  );
}
