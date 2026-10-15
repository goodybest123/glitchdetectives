import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CircleDot,
  Clock,
  Layers,
  Lock,
  Package,
  PieChart,
  Plus,
  Shapes,
  type LucideIcon,
} from "lucide-react";
import fractionsL1Cover from "@/assets/fractions-level-1-cover.png";
import {
  FRACTIONS_BUNDLE_LAUNCH_PRICE,
  FRACTIONS_BUNDLE_ORIGINAL_PRICE,
  FRACTIONS_BUNDLE_TITLE,
  FRACTIONS_BUNDLE_URL,
} from "./fractionBundle";
import {
  COLLECTION_BADGES,
  COLLECTION_INTRO,
  COLLECTION_PDF_URL,
  COLLECTION_PITCH,
  COLLECTION_PITCH_HEADING,
  WHATS_INSIDE,
  WHATS_INSIDE_INTRO,
} from "./collection";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MUTED = "color-mix(in oklab, var(--color-brand-blue) 70%, transparent)";

type TabKey = "All" | "Fractions" | "Addition" | "Geometry" | "Decimals" | "Place Value";

type Category = {
  title: Exclude<TabKey, "All">;
  desc: string;
  count: string;
  bg: string;
  icon: LucideIcon;
  live?: boolean;
};

const CATEGORIES: Category[] = [
  {
    title: "Fractions",
    desc: "Equal parts, halves, quarters, and equivalence.",
    count: "8 printables",
    bg: "#e8f9f5",
    icon: PieChart,
    live: true,
  },
  {
    title: "Addition",
    desc: "Number bonds, regrouping, and gentle word problems.",
    count: "Coming soon",
    bg: "#fff4d6",
    icon: Plus,
  },
  {
    title: "Geometry",
    desc: "Shapes, symmetry, angles, and spatial reasoning.",
    count: "Coming soon",
    bg: "#ece8ff",
    icon: Shapes,
  },
  {
    title: "Decimals",
    desc: "Tenths, hundredths, and place value across the dot.",
    count: "Coming soon",
    bg: "#e3f1ff",
    icon: CircleDot,
  },
  {
    title: "Place Value",
    desc: "Ones, tens, hundreds — building and breaking numbers.",
    count: "Coming soon",
    bg: "#ffe8ee",
    icon: Layers,
  },
];

const TABS: TabKey[] = ["All", "Fractions", "Addition", "Geometry", "Decimals", "Place Value"];

export function CategoryGrid() {
  const [active, setActive] = useState<TabKey>("All");

  const visibleCategories =
    active === "All" ? CATEGORIES : CATEGORIES.filter((c) => c.title === active);

  const subtitle =
    active === "Fractions"
      ? "Explore the Glitch Detectives Fractions Bundle."
      : active === "All"
        ? "Each topic opens into a calm collection of detective-style sheets."
        : `Browse ${active.toLowerCase()} printables.`;

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-24">
        {active !== "All" && (
          <button
            type="button"
            onClick={() => setActive("All")}
            className="inline-flex items-center gap-2 text-sm font-semibold mb-8 hover:opacity-80"
            style={{ color: BLUE }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to all topics
          </button>
        )}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="label-eyebrow" style={{ color: BLUE }}>
            Browse by Topic
          </span>
          <h2 className="heading-black uppercase text-3xl sm:text-4xl mt-3" style={{ color: BLUE }}>
            Choose a maths world
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: MUTED }}>
            {subtitle}
          </p>
        </div>

        <FilterTabs active={active} onChange={setActive} />

        {active === "Fractions" ? (
          <FractionLearningPath />
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
            {visibleCategories.map((c) => (
              <li key={c.title}>
                <CategoryCard
                  category={c}
                  onActivate={c.live ? () => setActive(c.title) : undefined}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function FilterTabs({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Filter printables by topic"
      className="flex flex-wrap justify-center gap-2 mb-2"
    >
      {TABS.map((t) => {
        const isActive = t === active;
        return (
          <button
            key={t}
            role="tab"
            aria-pressed={isActive}
            onClick={() => onChange(t)}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors border"
            style={
              isActive
                ? { background: BLUE, color: "white", borderColor: BLUE }
                : {
                    background: "transparent",
                    color: MUTED,
                    borderColor: "color-mix(in oklab, var(--color-brand-blue) 15%, transparent)",
                  }
            }
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

function CategoryCard({
  category: c,
  onActivate,
}: {
  category: Category;
  onActivate?: () => void;
}) {
  const Icon = c.icon;
  const interactive = Boolean(onActivate);
  return (
    <div
      className={`group h-full rounded-3xl p-7 sm:p-8 border border-black/5 transition-transform ${
        interactive ? "hover:-translate-y-1 hover:shadow-md cursor-pointer" : "cursor-default"
      }`}
      style={{ background: c.bg }}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onActivate}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onActivate?.();
              }
            }
          : undefined
      }
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <Icon className="w-7 h-7" style={{ color: BLUE }} strokeWidth={2} />
      </div>
      <h3 className="mt-6 text-2xl font-black uppercase tracking-tight" style={{ color: BLUE }}>
        {c.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
        {c.desc}
      </p>
      <div className="mt-6">
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/80"
          style={{ color: BLUE }}
        >
          {c.live ? c.count : "Coming soon"}
        </span>
      </div>
    </div>
  );
}

/* ---------------- Fraction Learning Path ---------------- */

type FractionLevel = {
  n: number;
  /** Short label shown on the tile and above the title. */
  badge: string;
  title: string;
  desc: ReactNode;
  meta?: string[];
  locked: boolean;
  href?: string;
  /** Internal route with the buyer-facing page preview. */
  previewTo?: string;
  /** Internal product detail page. */
  detailsTo?: string;
  originalPrice?: string;
  salePrice?: string;
  cover?: string;
  /** If true, this item is a multi-resource bundle (styled distinctly). */
  bundle?: boolean;
  /** Sub-resources listed inside the bundle card. */
  includes?: { label: string; detail: string; previewImages?: string[] }[];
};

const FRACTION_LEVELS: FractionLevel[] = [
  {
    n: 0,
    badge: "Bundle · 133 Pages",
    title: FRACTIONS_BUNDLE_TITLE,
    desc: (
      <>
        <strong>The Fraction Parent Companion + Workbook: Volume 1</strong>
        <br />
        <em>Help your child understand fractions, not just memorise the rules.</em>
        <br />
        <br />
        What if your child could learn fractions by investigating mistakes, exploring visual examples, and explaining
        their thinking?
        <br />
        <br />
        The Glitch Detectives Fractions Bundle combines a practical parent guide with a mission-based workbook to help
        children in Grades 1–3 build a meaningful understanding of fractions, one concept at a time.
        <br />
        <br />
        Designed with a neuroinclusive, reasoning-first approach, these resources offer a different way to explore maths,
        whether you&apos;re homeschooling, supporting learning at home, or looking for something beyond traditional
        worksheets.
        <br />
        <br />
        <strong>What&apos;s Included?</strong>
        <br />
        <br />
        <strong>📘 The Fraction Parent Companion | 53 pages</strong>
        <br />
        Your guide to helping your child make sense of fractions. Explore clear explanations, common misconceptions,
        conversation prompts, and practical activities that help you support your child&apos;s thinking without simply
        giving away the answers.
        <br />
        <br />
        <strong>🕵🏽 Glitch Detectives Workbook: Volume 1 | 80 pages</strong>
        <br />
        A printable, mission-based workbook where children investigate fraction problems, detect mistakes, repair
        incorrect reasoning, and explain their thinking. Along the way, they&apos;ll meet ZED-4, our slightly unreliable
        maths robot, and help him work through his fraction glitches.
        <br />
        <br />
        <strong>What Will Your Child Explore?</strong>
        <br />
        • The whole, equal parts, halves, and quarters
        <br />
        • Naming and understanding fractions
        <br />
        • Equivalent fractions and simplifying fractions
        <br />
        • Fractions on a number line
        <br />
        • Comparing fractions
        <br />
        • Finding fractions of a group
        <br />
        <br />
        Concepts are introduced gradually, helping children build understanding before moving on to more complex ideas.
        <br />
        <br />
        <strong>Why Glitch Detectives?</strong>
        <br />
        <br />
        💙 <strong>Neuroinclusive learning:</strong> Visual explanations, guided prompts, and manageable learning steps
        give children different ways to approach maths.
        <br />
        <br />
        ✂️ <strong>Hands-on and real-world connections:</strong> Familiar situations, pictures, and practical activities
        help make abstract fraction ideas more concrete.
        <br />
        <br />
        🧠 <strong>Reasoning over memorisation:</strong> Children are encouraged to question, investigate, and explain
        why an answer makes sense.
        <br />
        <br />
        🔎 <strong>Room for different learners:</strong> The structured approach supports children who need more guidance
        while giving curious learners opportunities to examine mistakes and challenge their own reasoning.
        <br />
        <br />
        <strong>Who Is It For?</strong>
        <br />
        This bundle is designed for parents and homeschoolers supporting children in Grades 1–3 who are learning
        fractions and want to build stronger mathematical understanding.
        <br />
        <br />
        <strong>Your download includes:</strong>
        <br />
        • 1 Fraction Parent Companion PDF (53 pages)
        <br />
        • 1 Glitch Detectives Workbook: Volume 1 PDF (80 pages)
        <br />
        <br />
        <strong>
          Two resources. 133 pages of guided fraction learning. One goal: understanding before memorising.
        </strong>
        <br />
        <br />
        Help your child do more than find the answer. Help them understand why it works.
        <br />
        <br />
        Welcome to Glitch Detectives! 🕵🏽‍♀️
      </>
    ),
    meta: ["2-in-1", "133 Pages", "Printable"],
    locked: false,
    href: FRACTIONS_BUNDLE_URL,
    bundle: true,
    originalPrice: FRACTIONS_BUNDLE_ORIGINAL_PRICE,
    salePrice: FRACTIONS_BUNDLE_LAUNCH_PRICE,
    detailsTo: "/printables/fractions/bundle",
    previewTo: "/printables/fractions-bundle/preview",
    cover: "/printables/fractions-bundle/cover.png",
    includes: [
      { label: "📘 Fraction Parent Companion", detail: "53 pages", previewImages: ["/printables/fractions-bundle/page-1.png", "/printables/fractions-bundle/page-2.png"] },
      { label: "🕵🏽 Workbook: Volume 1", detail: "80 pages", previewImages: ["/printables/fractions-bundle/page-3.png", "/printables/fractions-bundle/page-4.png"] },
    ],
  },
  {
    n: 1,
    badge: "Levels 1 & 2",
    title: "Fractions — Foundations Collection",
    desc: (
      <>
        <strong>Includes Levels 1 &amp; 2 Missions.</strong>
        <br />
        {COLLECTION_INTRO}
        <br />
        <br />
        <strong>{COLLECTION_PITCH_HEADING}</strong>
        <br />
        {COLLECTION_PITCH[0]}
        <br />
        <br />
        {COLLECTION_PITCH[1]}
        <br />
        <br />
        {COLLECTION_PITCH[2]}
        <br />
        <br />
        <strong>What&apos;s Inside</strong>
        <br />
        {WHATS_INSIDE_INTRO}
        {WHATS_INSIDE.map((block) => (
          <span key={block.title} className="block mt-3">
            <strong>{block.title}</strong>
            <br />
            {block.lead}
            <br />
            {block.items.join(" · ")}
          </span>
        ))}
      </>
    ),
    meta: COLLECTION_BADGES,
    locked: false,
    href: COLLECTION_PDF_URL,
    previewTo: "/printables/fractions-l1/preview",
    cover: fractionsL1Cover,
  },
  {
    n: 3,
    badge: "Level 3",
    title: "Classified",
    desc: "Mission classified. Comparison and pathway cases unlock soon.",
    locked: true,
  },
];

function FractionLearningPath() {
  const bundles = FRACTION_LEVELS.filter((l) => l.bundle);

  return (
    <div className="mt-10 space-y-8">
      {bundles.map((lvl) => (
        <FractionLevelCard key={lvl.n} lvl={lvl} />
      ))}
    </div>
  );
}

function FractionLevelCard({ lvl }: { lvl: FractionLevel }) {
  const locked = lvl.locked;
  const isBundle = lvl.bundle;

  return (
    <div
      aria-disabled={locked || undefined}
      className={`h-full rounded-3xl border overflow-hidden flex flex-col transition-transform ${
        locked ? "cursor-default border-black/5 bg-white" : isBundle ? "border-2 bg-white" : "border-black/5 bg-white hover:-translate-y-1 hover:shadow-md"
      }`}
      style={isBundle && !locked ? { borderColor: YELLOW } : undefined}
    >
      {/* Illustrated tile */}
      <div
        className={`relative flex items-center justify-center overflow-hidden ${
          locked ? "grayscale opacity-70" : ""
        } ${isBundle ? "aspect-[16/7] sm:aspect-[3/1]" : "aspect-[4/3]"}`}
        style={{
          background: locked
            ? "#e7eaef"
            : isBundle
              ? `linear-gradient(135deg, var(--color-brand-blue) 0%, #2a3f6f 100%)`
              : "var(--color-bg-mint)",
        }}
      >
        {lvl.cover ? (
          <img
            src={lvl.cover}
            alt={`${lvl.title} workbook cover`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : isBundle ? (
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,222,89,0.15)", border: `2px dashed ${YELLOW}` }}
            >
              <Package className="w-10 h-10" style={{ color: YELLOW }} strokeWidth={1.8} />
            </div>
            <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">2-in-1 Bundle</span>
          </div>
        ) : (
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: locked ? "rgba(30,41,59,0.06)" : "rgba(255,222,89,0.18)",
              border: locked ? "2px dashed rgba(30,41,59,0.25)" : `2px dashed ${YELLOW}`,
            }}
          >
            <PieChart
              className="w-12 h-12"
              style={{ color: locked ? "#64748b" : BLUE }}
              strokeWidth={2}
            />
          </div>
        )}

        <span
          className="absolute top-4 left-4 label-eyebrow px-2 py-1 rounded-full"
          style={{
            background: locked ? "rgba(30,41,59,0.08)" : YELLOW,
            color: locked ? "#64748b" : BLUE,
          }}
        >
          {lvl.badge}
        </span>

        {locked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
              <Lock className="w-5 h-5" style={{ color: "#64748b" }} />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-7 flex flex-col flex-1">
        {isBundle && lvl.salePrice && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--color-bg-mint)] p-4">
            {lvl.originalPrice && (
              <span className="text-sm font-semibold line-through" style={{ color: MUTED }}>
                {lvl.originalPrice}
              </span>
            )}
            <span className="text-2xl font-black" style={{ color: BLUE }}>
              {lvl.salePrice}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
              Launch price
            </span>
          </div>
        )}
        <p className="label-eyebrow" style={{ color: locked ? "#94a3b8" : MUTED }}>
          {lvl.badge}
        </p>
        <h3
          className="text-2xl font-black uppercase tracking-tight mt-1"
          style={{ color: locked ? "#64748b" : BLUE }}
        >
          {lvl.title}
        </h3>
        <div
          className="mt-3 text-sm leading-relaxed flex-1 whitespace-pre-wrap"
          style={{ color: locked ? "#94a3b8" : MUTED }}
        >
          {lvl.desc}
        </div>

        {/* Bundle "includes" sub-resources */}
        {isBundle && lvl.includes && (
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            {lvl.includes.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl p-4 border overflow-hidden"
                style={{ borderColor: "color-mix(in oklab, var(--color-brand-blue) 12%, transparent)", background: "var(--color-bg-mint)" }}
              >
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: BLUE }} strokeWidth={2} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: BLUE }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: MUTED }}>{item.detail}</p>
                  </div>
                </div>
                {item.previewImages && item.previewImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {item.previewImages.map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt={`${item.label} sample page`}
                        loading="lazy"
                        className="w-full rounded-lg border border-black/5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!locked && lvl.meta && (
          <div className="mt-5 flex flex-wrap gap-2">
            {lvl.meta.map((m) => (
              <span
                key={m}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: "var(--color-bg-mint)", color: BLUE }}
              >
                {m}
              </span>
            ))}
          </div>
        )}
        <div className="mt-7 flex flex-wrap gap-3">
          {!locked && lvl.href && !isBundle && (
            <a
              href={lvl.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:scale-105 transition-transform"
              style={{ background: BLUE, color: "white" }}
            >
              VIEW AND DOWNLOAD CASE FILE <ArrowRight className="w-4 h-4" />
            </a>
          )}
          {!locked && lvl.previewTo && (
            <Link
              to={lvl.previewTo}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase tracking-wider text-xs border hover:opacity-80 transition-opacity"
              style={{ borderColor: BLUE, color: BLUE }}
            >
              Preview pages
            </Link>
          )}
          {!locked && lvl.detailsTo && (
            <Link
              to={lvl.detailsTo}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:scale-105 transition-transform"
              style={{ background: BLUE, color: "white" }}
            >
              VIEW PACK <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          {locked && (
            <span
              aria-disabled="true"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase tracking-wider text-xs cursor-not-allowed"
              style={{ background: "#e7eaef", color: "#64748b" }}
            >
              <Clock className="w-4 h-4" /> Mission in Progress
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
