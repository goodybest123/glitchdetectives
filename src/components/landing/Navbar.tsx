/**
 * Landing-page top navbar. Anchors to on-page sections (`#how-it-works`,
 * `#worlds`, etc.) plus a "Try for free" CTA that jumps to `/play`.
 */
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

const SECTION_LINKS = [
  { hash: "home", label: "Home" },
  { hash: "how-it-works", label: "How It Works" },
  { hash: "worlds", label: "Worlds" },
] as const;

const linkClass =
  "text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-blue)]/80 hover:text-[var(--color-brand-blue)] transition-colors";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-black/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link to="/" hash="home" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-[var(--color-brand-yellow)] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5 text-[var(--color-brand-blue)]" strokeWidth={3} />
          </div>
          <div className="leading-none">
            <div className="text-[var(--color-brand-blue)] text-xl font-black tracking-tight">GLITCH</div>
            <div className="text-[var(--color-brand-blue)] text-[10px] font-semibold tracking-[0.35em]">DETECTIVES</div>
          </div>
        </Link>
        <ul className="hidden md:flex items-center gap-8">
          {SECTION_LINKS.map((l) => (
            <li key={l.hash}>
              <Link to="/" hash={l.hash} className={linkClass}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/" hash="printables" className={linkClass}>
              Printables
            </Link>
          </li>

        </ul>
        <Link
          to="/play"
          className="px-5 py-2.5 rounded-full bg-[var(--color-brand-yellow)] text-[var(--color-brand-blue)] text-sm font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-sm"
        >
          Try for Free
        </Link>
      </nav>
    </header>
  );
}
