import type { ReactNode } from 'react';

export function Card({
  children,
  className = '',
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <div
      className={`animate-card overflow-hidden rounded-card bg-white shadow-card ${className}`}
      style={{ ['--i' as string]: index }}
    >
      {children}
    </div>
  );
}

/** Chart card: white card with a header (title + optional right slot) and body. */
export function ChartCard({
  title,
  subtitle,
  right,
  children,
  className = '',
  index = 0,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <Card index={index} className={`flex h-full flex-col ${className}`}>
      <div className="flex items-start justify-between gap-3 px-[16px] pb-1 pt-[11px]">
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-semibold leading-tight text-ink">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-[11px] text-axis">{subtitle}</p>
          )}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
      <div className="min-h-0 flex-1 px-[8px] pb-2">{children}</div>
    </Card>
  );
}
