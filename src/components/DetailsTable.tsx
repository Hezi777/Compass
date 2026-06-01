import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card } from './Card';

export type Column<Row> = {
  key: string;
  header: string;
  /** tailwind width / alignment classes for the cell */
  className?: string;
  render?: (row: Row) => ReactNode;
};

export function StatusPill({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] capitalize text-ink">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

export default function DetailsTable<Row extends Record<string, unknown>>({
  title,
  columns,
  rows,
  index = 0,
}: {
  title: string;
  columns: Column<Row>[];
  rows: Row[];
  index?: number;
}) {
  return (
    <Card index={index} className="flex h-full flex-col">
      <div className="px-[16px] pb-1.5 pt-[10px]">
        <h3 className="text-[13px] font-semibold text-ink">{title}</h3>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10">
            <tr className="border-y border-line bg-zebra">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`bg-zebra px-[14px] py-[7px] text-[11px] font-semibold text-muted ${c.className ?? ''}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    {c.header}
                    <Search size={11} className="text-[#c2cad8]" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className="border-b border-line transition-colors odd:bg-white even:bg-zebra hover:!bg-[#eff6ff]"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-[14px] py-[7px] text-[13px] text-ink ${c.className ?? ''}`}
                  >
                    {c.render ? c.render(row) : String(row[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
