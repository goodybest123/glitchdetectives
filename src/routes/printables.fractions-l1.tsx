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
      { name: "description", content: "Download the Glitch Detectives Fractions Level 1 workbook: twelve gentle Grade 1 pages to spot unequal halves, repair mis-cut shapes, and explain why fair means equal." },
      { property: "og:title", content: "Fractions Level 1 — Glitch Detective Printables" },
      { property: "og:description", content: "Grade 1 fraction printables: calm, low-ink, neuro-inclusive reasoning activities. Available now." },
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

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="/printables/fractions-level-1-foundations.pdf"
                    download
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:scale-105 transition-transform"
                    style={{ background: BLUE, color: "white" }}
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                  <a
                    href="/printables/fractions-level-1-foundations.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase tracking-wider text-xs border hover:opacity-80 transition-opacity"
                    style={{ borderColor: BLUE, color: BLUE }}
                  >
                    <ExternalLink className="w-4 h-4" /> Open in new tab
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2
                className="heading-black uppercase text-2xl sm:text-3xl mb-5"
                style={{ color: BLUE }}
              >
                Workbook preview
              </h2>
              <div
                className="rounded-2xl overflow-hidden border border-black/10 bg-white shadow-lg"
                style={{ minHeight: "80vh" }}
              >
                <object
                  data="/printables/fractions-level-1-foundations.pdf#view=FitH"
                  type="application/pdf"
                  className="w-full"
                  style={{ height: "80vh" }}
                  aria-label="Fractions Level 1 workbook PDF preview"
                >
                  <iframe
                    src="/printables/fractions-level-1-foundations.pdf"
                    title="Fractions Level 1 workbook PDF preview"
                    className="w-full"
                    style={{ height: "80vh", border: 0 }}
                  />
                  <div className="p-8 text-center" style={{ color: BLUE }}>
                    <p className="text-base font-semibold">
                      Your browser can't preview PDFs inline.
                    </p>
                    <p
                      className="mt-2 text-sm"
                      style={{ color: "color-mix(in oklab, var(--color-brand-blue) 70%, transparent)" }}
                    >
                      Use the Download or Open in new tab buttons above to view the workbook.
                    </p>
                  </div>
                </object>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
