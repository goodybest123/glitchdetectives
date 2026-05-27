import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, ExternalLink, Search, Sparkles } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/sections";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-bg-mint)";

export const Route = createFileRoute("/printables/fractions-l1")({
  head: () => ({
    meta: [
      { title: "Fractions Level 1 — Printables — Glitch Detectives" },
      { name: "description", content: "Twelve gentle pages of glitch-detective fraction missions for Grade 1. Spot unequal halves, repair mis-cut shapes, and talk through every fix." },
      { property: "og:title", content: "Fractions Level 1 — Glitch Detective Printables" },
      { property: "og:description", content: "Grade 1 fraction printables: calm, low-ink, neuro-inclusive reasoning activities." },
    ],
  }),
  component: FractionsL1Page,
});

function FractionsL1Page() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <section style={{ background: MINT }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
            <Link
              to="/printables"
              className="inline-flex items-center gap-2 text-sm font-semibold mb-10 hover:opacity-80"
              style={{ color: BLUE }}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Library
            </Link>

            <div className="grid lg:grid-cols-[260px_1fr] gap-12 items-start">
              <div
                className="relative w-[220px] sm:w-[260px] aspect-[3/4] rounded-2xl p-5 flex flex-col justify-between shadow-xl mx-auto lg:mx-0"
                style={{ background: BLUE, border: `6px solid ${YELLOW}` }}
              >
                <span
                  className="label-eyebrow px-2 py-1 rounded-full self-start"
                  style={{ background: YELLOW, color: BLUE }}
                >
                  F1
                </span>
                <div className="flex-1 flex items-center justify-center">
                  <Search className="w-14 h-14" style={{ color: YELLOW }} strokeWidth={2} />
                </div>
                <div className="text-white">
                  <div className="text-[10px] font-mono tracking-[0.3em] opacity-70">FRACTIONS</div>
                  <div className="text-2xl font-black uppercase leading-none mt-1">Level 1</div>
                </div>
              </div>

              <div>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                  style={{ background: YELLOW, color: BLUE }}
                >
                  <Sparkles className="w-3.5 h-3.5" /> New Release
                </span>
                <h1
                  className="heading-black uppercase text-4xl sm:text-5xl mt-5"
                  style={{ color: BLUE }}
                >
                  Fractions Level 1
                </h1>
                <p
                  className="mt-5 text-lg leading-relaxed"
                  style={{ color: "color-mix(in oklab, var(--color-brand-blue) 75%, transparent)" }}
                >
                  Twelve gentle pages of glitch-detective fraction missions for Grade 1. Spot
                  unequal halves, repair mis-cut shapes, and talk through every fix.
                </p>

                <div
                  className="mt-8 rounded-2xl bg-white border border-black/5 p-6"
                  style={{ color: BLUE }}
                >
                  <h2 className="font-black uppercase tracking-wide text-sm">Workbook preview</h2>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "color-mix(in oklab, var(--color-brand-blue) 70%, transparent)" }}
                  >
                    PDF preview and download arriving soon. We're putting the final ink-friendly
                    touches on every page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
