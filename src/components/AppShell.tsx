import type { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import Sidebar from './Sidebar';
import FilterPane from './FilterPane';
import wallpaper from '../assets/wallpaper.jpg';

type Filter = { label: string; value?: string };

export default function AppShell({
  sheetName,
  filters,
  children,
}: {
  sheetName: string;
  filters: Filter[];
  children: ReactNode;
}) {
  return (
    <div
      className="flex h-screen w-full flex-col overflow-hidden bg-[#0a0e2a] bg-cover bg-center p-[12px]"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      {/* full-width header — sits above the sidebar, content and filters */}
      <div className="mb-[12px] flex shrink-0 items-center justify-between px-1">
        <h1 className="text-[18px] font-bold tracking-tight text-white">
          {sheetName}
        </h1>
        <div className="flex items-center gap-2 text-[12px] text-white/55">
          <span>Updated 2 hours ago</span>
          <RefreshCw size={14} className="text-white/55" />
        </div>
      </div>

      {/* sidebar · content · filters — all aligned beneath the header */}
      <div className="flex min-h-0 flex-1 gap-[12px]">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
        <FilterPane filters={filters} />
      </div>
    </div>
  );
}
