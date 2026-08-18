/**
 * Site-wide top navbar. Appears on every company page (home, about, products,
 * contact) and links to real routes. The "Try for Free" CTA goes to the game.
 */
import { Link } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

const ROUTE_LINKS = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About" },
  { to: "/products" as const, label: "Products" },
  { to: "/printables" as const, label: "Printables" },
  { to: "/contact" as const, label: "Contact" },
] as const;

const linkClass =
  "text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-blue)]/80 hover:text-[var(--color-brand-blue)] transition-colors";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-black/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-[var(--color-brand-yellow)] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5 text-[var(--color-brand-blue)]" strokeWidth={3} />
          </div>
          <div className="leading-none">
            <div className="text-[var(--color-brand-blue)] text-xl font-black tracking-tight">
              GLITCH
            </div>
            <div className="text-[var(--color-brand-blue)] text-[10px] font-semibold tracking-[0.35em]">
              DETECTIVES
            </div>
          </div>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {ROUTE_LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={linkClass}
                activeProps={{ className: `${linkClass} text-[var(--color-brand-blue)]` }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link
            to="/play"
            className="px-5 py-2.5 rounded-full bg-[var(--color-brand-yellow)] text-[var(--color-brand-blue)] text-sm font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-sm"
          >
            Try for Free
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-xl text-[var(--color-brand-blue)] hover:bg-black/5"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-b border-black/5 px-4 sm:px-6 py-4">
          <ul className="space-y-3">
            {ROUTE_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="block text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-blue)]/80 hover:text-[var(--color-brand-blue)]"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/play"
                className="inline-block px-5 py-2.5 rounded-full bg-[var(--color-brand-yellow)] text-[var(--color-brand-blue)] text-sm font-bold uppercase tracking-wider"
                onClick={() => setOpen(false)}
              >
                Try for Free
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
