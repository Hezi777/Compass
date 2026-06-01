import { NavLink, useMatch } from 'react-router-dom';
import {
  Home,
  GitPullRequest,
  Wrench,
  Rocket,
  Bug,
  RotateCcw,
  ChevronLeft,
} from 'lucide-react';
import logo from '../assets/logo.png';

const NAVY = '#14253D';
const BLUE = '#0f7af8';

type NavItem = {
  to: string;
  label: string;
  Icon: typeof Home;
};

const NAV: NavItem[] = [
  { to: '/overview', label: 'Overview', Icon: Home },
  { to: '/prs', label: 'Pull Requests', Icon: GitPullRequest },
  { to: '/builds', label: 'Builds', Icon: Wrench },
  { to: '/releases', label: 'Releases', Icon: Rocket },
  { to: '/bugs', label: 'Bugs', Icon: Bug },
  { to: '/retrospect', label: 'Retrospect', Icon: RotateCcw },
];

function NavItemRow({ to, label, Icon }: NavItem) {
  const active = !!useMatch(to);
  return (
    <li className="group relative flex w-full justify-center">
      <NavLink
        to={to}
        aria-label={label}
        className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors hover:bg-[#f4f6fa]"
      >
        <Icon size={22} strokeWidth={1.9} color={active ? BLUE : NAVY} />
      </NavLink>

      {/* selected: 3×28px rounded right-edge bar */}
      {active && (
        <span
          className="pointer-events-none absolute right-[1px] top-1/2 h-[28px] w-[3px] -translate-y-1/2 rounded-full"
          style={{ backgroundColor: BLUE }}
        />
      )}

      {/* tooltip */}
      <span className="pointer-events-none absolute left-[54px] top-1/2 z-20 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#0a0e2a] px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </li>
  );
}

export default function Sidebar() {
  return (
    <nav className="flex h-full w-[60px] shrink-0 flex-col items-center rounded-[18px] bg-white py-4 shadow-card">
      {/* logo — full png, no added outline */}
      <img src={logo} alt="Compass" className="h-10 w-10 shrink-0 object-contain" />

      <div className="my-3 h-px w-7 bg-line" />

      {/* nav icons — vertically centered in remaining space */}
      <ul className="flex w-full flex-1 flex-col items-center justify-center gap-1.5">
        {NAV.map((item) => (
          <NavItemRow key={item.to} {...item} />
        ))}
      </ul>

      {/* collapse chevron */}
      <button
        className="mt-2 flex h-7 w-7 items-center justify-center rounded-full text-[#9aa6bd] hover:bg-[#f1f5fb]"
        aria-label="Collapse"
        type="button"
      >
        <ChevronLeft size={16} />
      </button>
    </nav>
  );
}
