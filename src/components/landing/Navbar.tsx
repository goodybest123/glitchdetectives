/**
 * Site-wide top navbar. Appears on every platform page (home, about, products,
 * contact) and links to real routes. The "Try for Free" CTA goes to the Detective Worlds.
 */
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoUrl from "@/assets/GOODNESS GLITCH (1).png";

const ROUTE_LINKS = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About" },
  { to: "/products" as const, label: "Products" },
  { to: "/printables" as const, label: "Printables" },
  { to: "/blog" as const, label: "Blog" },
  { to: "/contact" as const, label: "Contact" },
] as const;

const linkClass =
  "text-xs font-semibold uppercase tracking-wider text-white/75 hover:text-[var(--color-brand-yellow)] transition-colors";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[var(--color-brand-blue)]/95 text-white backdrop-blur">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <Link
          to="/"
          className="group flex shrink-0 items-center"
          aria-label="Glitch Detectives home"
        >
          <img
            src={logoUrl}
            alt="Glitch Detectives"
            width={810}
            height={680}
            className="h-11 sm:h-16 w-auto object-contain transition-transform group-hover:scale-[1.03]"
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-5 xl:gap-7">
          {ROUTE_LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`${linkClass} py-2`}
                activeProps={{
                  className: `${linkClass} py-2 text-[var(--color-brand-yellow)]`,
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Link
            to="/play"
            className="rounded-full bg-[var(--color-brand-yellow)] px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[var(--color-brand-blue)] shadow-sm transition-transform hover:scale-105 xl:px-5"
          >
            Try for Free
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 text-white hover:bg-white/10 active:bg-white/15"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-b border-white/10 bg-[var(--color-brand-blue)] px-4 py-3 shadow-lg sm:px-6">
          <ul className="space-y-1">
            {ROUTE_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="block rounded-xl px-3 py-2.5 text-sm font-bold uppercase tracking-wider text-white/80 transition-colors hover:bg-white/10 hover:text-[var(--color-brand-yellow)] active:bg-white/15"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                to="/play"
                className="block w-full rounded-full bg-[var(--color-brand-yellow)] px-5 py-3 text-center text-sm font-bold uppercase tracking-wider text-[var(--color-brand-blue)] shadow-sm active:scale-[0.98]"
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
