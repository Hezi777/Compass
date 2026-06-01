import { SlidersHorizontal, ChevronDown } from 'lucide-react';

type Filter = { label: string; value?: string };

export default function FilterPane({ filters }: { filters: Filter[] }) {
  return (
    <aside className="flex h-full w-[196px] shrink-0 flex-col overflow-hidden rounded-[18px] bg-white px-[18px] py-4 shadow-card">
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#14253D]">
          <SlidersHorizontal size={15} className="text-white" />
        </span>
        <h2 className="text-[15px] font-bold text-ink">Filters</h2>
      </div>

      <div className="flex flex-1 flex-col justify-start gap-[13px] overflow-hidden">
        {filters.map((f) => (
          <div key={f.label} className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-muted">
              {f.label}
            </label>
            <button
              type="button"
              className="flex items-center justify-between gap-2 border-b border-line pb-1 text-left text-[12px] text-ink/80 transition-colors hover:border-accent"
            >
              <span className={`truncate ${f.value ? 'text-ink' : 'text-axis'}`}>
                {f.value ?? 'All'}
              </span>
              <ChevronDown size={13} className="shrink-0 text-axis" />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
