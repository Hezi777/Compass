import { RefreshCw } from 'lucide-react';

/** Slim custom top bar: screen title left, freshness + refresh right. */
export default function TopBar({ title }: { title: string }) {
  return (
    <header className="flex h-[44px] shrink-0 items-center justify-between border-b border-[#e3e7ee] bg-white px-5">
      <h1 className="text-[16px] font-bold text-ink">{title}</h1>
      <div className="flex items-center gap-2 text-[12px] text-axis">
        <span>Updated 2 hours ago</span>
        <button
          type="button"
          aria-label="Refresh"
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#8b97ab] hover:bg-[#f1f4f9] hover:text-accent"
        >
          <RefreshCw size={15} />
        </button>
      </div>
    </header>
  );
}
