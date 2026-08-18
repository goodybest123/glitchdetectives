/**
 * `/printables/fractions-l1/preview` — buyer-facing page preview. Shows
 * sample pages rendered from the Foundations Collection workbook PDF.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";
import { PagePreviewGallery } from "@/components/printables/PagePreviewGallery";
import {
  COLLECTION_PDF_URL,
  COLLECTION_SUBTITLE,
  COLLECTION_TITLE,
  PREVIEW_PAGES,
  WHATS_INSIDE,
} from "@/components/printables/collection";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-bg-mint)";
const MUTED = "color-mix(in oklab, var(--color-brand-blue) 72%, transparent)";

export const Route = createFileRoute("/printables/fractions-l1/preview")({
  head: () => ({
    meta: [
      { title: "Preview the Fractions Foundations Workbook — Glitch Detectives" },
      {
        name: "description",
        content:
          "Flip through sample pages of the Glitch Detectives Fractions Foundations Collection before you download the free 21-page Levels 1 & 2 workbook.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Preview the Fractions Foundations Workbook" },
      {
        property: "og:description",
        content:
          "See real pages from the free Glitch Detectives fractions workbook — investigate, detect, repair, explain.",
      },
    ],
  }),
  component: PreviewPage,
});

function PreviewPage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <section style={{ background: MINT }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
            <Link
              to="/printables/fractions-l1"
              className="flex w-fit items-center gap-2 text-sm font-semibold mb-8 hover:opacity-80"
              style={{ color: BLUE }}
            >
              <ArrowLeft className="w-4 h-4" /> Back to workbook
            </Link>

            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: YELLOW, color: BLUE }}
            >
              Page preview
            </span>
            <h1
              className="heading-black uppercase text-3xl sm:text-4xl lg:text-5xl mt-5"
              style={{ color: BLUE }}
            >
              {COLLECTION_TITLE}
            </h1>
            <p className="mt-3 text-lg font-semibold" style={{ color: MUTED }}>
              {COLLECTION_SUBTITLE}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: MUTED }}>
              Here are the first {PREVIEW_PAGES.length} pages exactly as they print. Tap any page to
              zoom in.
            </p>

            <div className="mt-10">
              <PagePreviewGallery />
            </div>

            <div className="mt-12 rounded-3xl bg-white border border-black/5 p-7 sm:p-10 shadow-sm">
              <h2 className="heading-black uppercase text-2xl sm:text-3xl" style={{ color: BLUE }}>
                That&apos;s the sample — the full 21-page collection is free
              </h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-8">
                {WHATS_INSIDE.map((block) => (
                  <div key={block.title}>
                    <h3
                      className="text-base font-black uppercase tracking-tight"
                      style={{ color: BLUE }}
                    >
                      {block.title}
                    </h3>
                    <ul
                      className="mt-3 space-y-1.5 text-sm leading-relaxed"
                      style={{ color: MUTED }}
                    >
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
              <a
                href={COLLECTION_PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform"
                style={{ background: BLUE, color: "white" }}
              >
                <Download className="w-4 h-4" /> Download the free workbook
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
