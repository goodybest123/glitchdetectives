/**
 * `/printables/fractions-bundle/preview` — sample pages from the paid fraction bundle.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PagePreviewGallery } from "@/components/printables/PagePreviewGallery";
import {
  FRACTIONS_BUNDLE_LAUNCH_PRICE,
  FRACTIONS_BUNDLE_ORIGINAL_PRICE,
  FRACTIONS_BUNDLE_PREVIEW_PAGES,
  FRACTIONS_BUNDLE_TITLE,
  FRACTIONS_BUNDLE_URL,
} from "@/components/printables/fractionBundle";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-bg-mint)";
const MUTED = "color-mix(in oklab, var(--color-brand-blue) 72%, transparent)";

export const Route = createFileRoute("/printables/fractions-bundle/preview")({
  head: () => ({
    meta: [
      { title: `Preview the ${FRACTIONS_BUNDLE_TITLE} — Glitch Detectives` },
      {
        name: "description",
        content:
          "Preview sample pages from the 133-page Glitch Detectives Fractions Bundle for parents and children.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: `Preview the ${FRACTIONS_BUNDLE_TITLE}` },
      {
        property: "og:description",
        content: "Explore sample pages from the Fraction Parent Companion and Volume 1 workbook.",
      },
    ],
  }),
  component: FractionsBundlePreviewPage,
});

function FractionsBundlePreviewPage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <section style={{ background: MINT }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
            <Link
              to="/printables/fractions/bundle"
              className="flex w-fit items-center gap-2 text-sm font-semibold mb-8 hover:opacity-80"
              style={{ color: BLUE }}
            >
              <ArrowLeft className="w-4 h-4" /> Back to bundle
            </Link>

            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: YELLOW, color: BLUE }}
            >
              Bundle page preview
            </span>
            <h1
              className="heading-black uppercase text-3xl sm:text-4xl lg:text-5xl mt-5"
              style={{ color: BLUE }}
            >
              {FRACTIONS_BUNDLE_TITLE}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: MUTED }}>
              Preview sample pages from the Fraction Parent Companion and Volume 1 workbook. Tap a
              page to zoom in.
            </p>

            <div className="mt-10">
              <PagePreviewGallery pages={FRACTIONS_BUNDLE_PREVIEW_PAGES} showPageNumbers={false} />
            </div>

            <div className="mt-12 rounded-3xl bg-white border border-black/5 p-7 sm:p-10 shadow-sm">
              <h2 className="heading-black uppercase text-2xl sm:text-3xl" style={{ color: BLUE }}>
                Get the complete 133-page bundle
              </h2>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-base font-semibold line-through" style={{ color: MUTED }}>
                  {FRACTIONS_BUNDLE_ORIGINAL_PRICE}
                </span>
                <span className="text-2xl font-black" style={{ color: BLUE }}>
                  {FRACTIONS_BUNDLE_LAUNCH_PRICE}
                </span>
                <span className="text-sm font-semibold" style={{ color: MUTED }}>
                  launch price
                </span>
              </div>
              <a
                href={FRACTIONS_BUNDLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform"
                style={{ background: BLUE, color: "white" }}
              >
                Get it now <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
