import { Link } from "@tanstack/react-router";
import { ArrowRight, Search, Sparkles } from "lucide-react";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-brand-mint)";

export function SpotlightBanner() {
  return (
    <section style={{ background: "var(--color-bg-mint)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 lg:pb-24">
        <div
          className="relative bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden p-6 sm:p-10 lg:p-14"
        >
          <div className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 rounded-full blur-3xl opacity-50" style={{ background: MINT }} />

          <div className="relative grid lg:grid-cols-[minmax(0,260px)_1fr] gap-10 lg:gap-14 items-center">
            {/* Workbook cover placeholder */}
            <div className="mx-auto lg:mx-0">
              <div
                className="relative w-[220px] sm:w-[260px] aspect-[3/4] rounded-2xl p-5 flex flex-col justify-between shadow-xl"
                style={{ background: BLUE, border: `6px solid ${YELLOW}` }}
              >
                <div className="flex items-start justify-between">
                  <span
                    className="label-eyebrow px-2 py-1 rounded-full"
                    style={{ background: YELLOW, color: BLUE }}
                  >
                    F1
                  </span>
                  <Search className="w-5 h-5" style={{ color: MINT }} strokeWidth={2.5} />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,222,89,0.15)", border: `2px dashed ${YELLOW}` }}
                  >
                    <Search className="w-10 h-10" style={{ color: YELLOW }} strokeWidth={2.2} />
                  </div>
                </div>
                <div className="text-white">
                  <div className="text-[10px] font-mono tracking-[0.3em] opacity-70">FRACTIONS</div>
                  <div className="text-2xl font-black uppercase leading-none mt-1">Level 1</div>
                  <div className="text-[10px] font-mono tracking-[0.25em] opacity-60 mt-2">
                    GLITCH DETECTIVES
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{ background: YELLOW, color: BLUE }}
              >
                <Sparkles className="w-3.5 h-3.5" /> New Release
              </span>

              <h2
                className="heading-black uppercase text-3xl sm:text-4xl lg:text-5xl mt-5"
                style={{ color: BLUE }}
              >
                Fractions Level 1
              </h2>

              <p
                className="mt-4 text-base sm:text-lg leading-relaxed max-w-xl"
                style={{ color: "color-mix(in oklab, var(--color-brand-blue) 75%, transparent)" }}
              >
                Twelve gentle pages of glitch-detective fraction missions. Spot unequal halves,
                repair mis-cut shapes, and talk through every fix — together, away from the screen.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["Grade 1", "12 pages", "PDF · A4 + Letter", "Low-ink"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: "var(--color-bg-mint)", color: BLUE }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to="/printables/fractions-l1"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform shadow-sm"
                  style={{ background: BLUE, color: "white" }}
                >
                  Investigate Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
