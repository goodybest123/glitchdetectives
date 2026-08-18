/**
 * `/printables/fractions-l1` — detail page for the Fractions Foundations
 * Collection (Levels 1 & 2 missions combined). Copy comes from the shared
 * `collection` module; sample pages live at `/printables/fractions-l1/preview`.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, ExternalLink, Images, Search } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/sections";
import {
  COLLECTION_BADGES,
  COLLECTION_INTRO,
  COLLECTION_PDF_URL,
  COLLECTION_PITCH,
  COLLECTION_PITCH_HEADING,
  COLLECTION_SUBTITLE,
  COLLECTION_TITLE,
  WHATS_INSIDE,
  WHATS_INSIDE_INTRO,
} from "@/components/printables/collection";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-bg-mint)";
const MUTED = "color-mix(in oklab, var(--color-brand-blue) 72%, transparent)";

export const Route = createFileRoute("/printables/fractions-l1")({
  head: () => ({
    meta: [
      { title: "Fractions Foundations Collection — Glitch Detectives Printables" },
      {
        name: "description",
        content:
          "Free 21-page Glitch Detectives fractions workbook combining Levels 1 and 2: equal parts, halves, quarters, numerators, denominators, equivalence and the number line for Grades 1–2.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Fractions Foundations Collection — Glitch Detectives" },
      {
        property: "og:description",
        content:
          "Children become Lead Detectives who investigate mistakes, repair misconceptions and explain their fraction thinking. Free instant download.",
      },
    ],
  }),
  component: FractionsCollectionPage,
});

function FractionsCollectionPage() {
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
                  Levels 1 &amp; 2
                </span>
                <div className="flex-1 flex items-center justify-center">
                  <Search className="w-14 h-14" style={{ color: YELLOW }} strokeWidth={2} />
                </div>
                <div className="text-white">
                  <div className="text-[10px] font-mono tracking-[0.3em] opacity-70">FRACTIONS</div>
                  <div className="text-2xl font-black uppercase leading-none mt-1">
                    Foundations
                  </div>
                </div>
              </div>

              <div>
                <h1
                  className="heading-black uppercase text-4xl sm:text-5xl"
                  style={{ color: BLUE }}
                >
                  {COLLECTION_TITLE}
                </h1>
                <p className="mt-3 text-lg font-semibold" style={{ color: MUTED }}>
                  {COLLECTION_SUBTITLE}
                </p>
                <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: MUTED }}>
                  {COLLECTION_INTRO}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {COLLECTION_BADGES.map((b) => (
                    <span
                      key={b}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white"
                      style={{ color: BLUE }}
                    >
                      {b}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={COLLECTION_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:scale-105 transition-transform"
                    style={{ background: BLUE, color: "white" }}
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                  <Link
                    to="/printables/fractions-l1/preview"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase tracking-wider text-xs border hover:opacity-80 transition-opacity"
                    style={{ borderColor: BLUE, color: BLUE }}
                  >
                    <Images className="w-4 h-4" /> Preview pages
                  </Link>
                  <a
                    href={COLLECTION_PDF_URL}
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

            <div className="mt-14 rounded-3xl bg-white border border-black/5 p-7 sm:p-10 shadow-sm">
              <h2 className="heading-black uppercase text-2xl sm:text-3xl" style={{ color: BLUE }}>
                {COLLECTION_PITCH_HEADING}
              </h2>
              {COLLECTION_PITCH.map((p) => (
                <p key={p} className="mt-4 text-base leading-relaxed" style={{ color: MUTED }}>
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-8 rounded-3xl bg-white border border-black/5 p-7 sm:p-10 shadow-sm">
              <h2 className="heading-black uppercase text-2xl sm:text-3xl" style={{ color: BLUE }}>
                What&apos;s Inside
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: MUTED }}>
                {WHATS_INSIDE_INTRO}
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-8">
                {WHATS_INSIDE.map((block) => (
                  <div key={block.title}>
                    <h3
                      className="text-base font-black uppercase tracking-tight"
                      style={{ color: BLUE }}
                    >
                      {block.title}
                    </h3>
                    <p className="mt-2 text-sm" style={{ color: MUTED }}>
                      {block.lead}
                    </p>
                    <ul className="mt-3 space-y-1.5 text-sm leading-relaxed" style={{ color: MUTED }}>
                      {block.items.map((i) => (
                        <li key={i} className="flex gap-2">
                          <span aria-hidden style={{ color: YELLOW }}>
                            ●
                          </span>
                          {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
