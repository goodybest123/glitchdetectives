/**
 * `/printables/fractions/bundle` — product page for the Glitch Detectives Fractions Bundle.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, Images } from "lucide-react";
import {
  FRACTIONS_BUNDLE_LAUNCH_PRICE,
  FRACTIONS_BUNDLE_ORIGINAL_PRICE,
  FRACTIONS_BUNDLE_TITLE,
  FRACTIONS_BUNDLE_URL,
} from "@/components/printables/fractionBundle";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-bg-mint)";
const MUTED = "color-mix(in oklab, var(--color-brand-blue) 72%, transparent)";

const INCLUDED_RESOURCES = [
  {
    title: "The Fraction Parent Companion",
    pages: "53 pages",
    description:
      "A practical guide with clear explanations, common misconceptions, conversation prompts, and activities to help you support your child's thinking.",
  },
  {
    title: "Glitch Detectives Workbook: Volume 1",
    pages: "80 pages",
    description:
      "A printable, mission-based workbook where children investigate fraction problems, spot mistakes, repair incorrect reasoning, and explain their thinking.",
  },
];

const CONCEPTS = [
  "The whole and equal parts",
  "Halves and quarters",
  "Naming and understanding fractions",
  "Equivalent and simplifying fractions",
  "Fractions on a number line",
  "Comparing fractions",
  "Fractions of a group",
];

export const Route = createFileRoute("/printables/fractions/bundle")({
  head: () => ({
    meta: [
      { title: `${FRACTIONS_BUNDLE_TITLE} — Glitch Detectives` },
      {
        name: "description",
        content:
          "A 133-page printable fractions bundle for Grades 1–3, including a parent companion and a reasoning-first workbook.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: FRACTIONS_BUNDLE_TITLE },
      {
        property: "og:description",
        content:
          "Help children understand fractions with a practical parent guide and a mission-based detective workbook.",
      },
    ],
  }),
  component: FractionsBundlePage,
});

function FractionsBundlePage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <section style={{ background: MINT }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
            <Link
              to="/printables"
              className="inline-flex items-center gap-2 text-sm font-semibold mb-8 hover:opacity-80"
              style={{ color: BLUE }}
            >
              <ArrowLeft className="w-4 h-4" /> Back to printables
            </Link>

            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
              <img
                src="/printables/fractions-bundle/cover.png"
                alt={`${FRACTIONS_BUNDLE_TITLE} cover`}
                className="w-full max-w-xl mx-auto rounded-3xl shadow-xl"
                fetchPriority="high"
              />

              <div>
                <span
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                  style={{ background: YELLOW, color: BLUE }}
                >
                  2-in-1 bundle · 133 printable pages
                </span>
                <h1
                  className="heading-black uppercase text-3xl sm:text-4xl lg:text-5xl mt-5"
                  style={{ color: BLUE }}
                >
                  {FRACTIONS_BUNDLE_TITLE}
                </h1>
                <p className="mt-5 text-lg leading-relaxed" style={{ color: MUTED }}>
                  Help your child understand fractions, not just memorise the rules. This
                  neuroinclusive, reasoning-first bundle brings together a practical parent
                  companion and a mission-based workbook for children in Grades 1–3.
                </p>

                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-lg font-semibold line-through" style={{ color: MUTED }}>
                    {FRACTIONS_BUNDLE_ORIGINAL_PRICE}
                  </span>
                  <span className="text-3xl font-black" style={{ color: BLUE }}>
                    {FRACTIONS_BUNDLE_LAUNCH_PRICE}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: MUTED }}>
                    launch price
                  </span>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={FRACTIONS_BUNDLE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform"
                    style={{ background: BLUE, color: "white" }}
                  >
                    Get it now <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    to="/printables/fractions-bundle/preview"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm border hover:opacity-80 transition-opacity"
                    style={{ borderColor: BLUE, color: BLUE }}
                  >
                    <Images className="w-4 h-4" /> Preview pages
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <span className="label-eyebrow" style={{ color: BLUE }}>
                What&apos;s included
              </span>
              <h2
                className="heading-black uppercase text-3xl sm:text-4xl mt-3"
                style={{ color: BLUE }}
              >
                Two resources, one complete learning journey
              </h2>
            </div>

            <div className="mt-10 grid md:grid-cols-2 gap-6">
              {INCLUDED_RESOURCES.map((resource) => (
                <article
                  key={resource.title}
                  className="rounded-3xl border border-black/5 p-7 sm:p-8"
                  style={{ background: MINT }}
                >
                  <BookOpen className="w-7 h-7" style={{ color: BLUE }} />
                  <p className="mt-5 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
                    {resource.pages}
                  </p>
                  <h3 className="mt-2 text-xl font-black" style={{ color: BLUE }}>
                    {resource.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>
                    {resource.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-12 rounded-3xl bg-[var(--color-bg-mint)] p-7 sm:p-10">
              <h2 className="heading-black uppercase text-2xl sm:text-3xl" style={{ color: BLUE }}>
                Fraction concepts your child will explore
              </h2>
              <ul className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {CONCEPTS.map((concept) => (
                  <li key={concept} className="flex items-start gap-3 text-sm" style={{ color: MUTED }}>
                    <span aria-hidden style={{ color: YELLOW }}>
                      ●
                    </span>
                    {concept}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/printables/fractions-bundle/preview"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase tracking-wider text-xs border hover:opacity-80 transition-opacity"
                  style={{ borderColor: BLUE, color: BLUE }}
                >
                  <Images className="w-4 h-4" /> Preview sample pages
                </Link>
                <a
                  href={FRACTIONS_BUNDLE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:scale-105 transition-transform"
                  style={{ background: BLUE, color: "white" }}
                >
                  Get the bundle <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
