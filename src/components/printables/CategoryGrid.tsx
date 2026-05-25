import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, CircleDot, Clock, Layers, Lock, PieChart, Plus, Shapes,
  type LucideIcon,
} from "lucide-react";

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
  { title: "Fractions", desc: "Equal parts, halves, quarters, and equivalence.", count: "8 printables", bg: "#e8f9f5", icon: PieChart, live: true },
  { title: "Addition", desc: "Number bonds, regrouping, and gentle word problems.", count: "Coming soon", bg: "#fff4d6", icon: Plus },
  { title: "Geometry", desc: "Shapes, symmetry, angles, and spatial reasoning.", count: "Coming soon", bg: "#ece8ff", icon: Shapes },
  { title: "Decimals", desc: "Tenths, hundredths, and place value across the dot.", count: "Coming soon", bg: "#e3f1ff", icon: CircleDot },
  { title: "Place Value", desc: "Ones, tens, hundreds — building and breaking numbers.", count: "Coming soon", bg: "#ffe8ee", icon: Layers },
];

const TABS: TabKey[] = ["All", "Fractions", "Addition", "Geometry", "Decimals", "Place Value"];

export function CategoryGrid() {
  const [active, setActive] = useState<TabKey>("All");

  const visibleCategories =
    active === "All" ? CATEGORIES : CATEGORIES.filter((c) => c.title === active);

  const subtitle =
    active === "Fractions"
      ? "Follow the fraction case files in order."
      : active === "All"
      ? "Each topic opens into a calm collection of detective-style sheets."
      : `Browse ${active.toLowerCase()} printables.`;

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="label-eyebrow" style={{ color: BLUE }}>Browse by Topic</span>
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
                : { background: "transparent", color: MUTED, borderColor: "color-mix(in oklab, var(--color-brand-blue) 15%, transparent)" }
            }
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

function CategoryCard({ category: c, onActivate }: { category: Category; onActivate?: () => void }) {
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
  n: 1 | 2 | 3;
  title: string;
  desc: string;
  meta?: string[];
  locked: boolean;
  href?: string;
};

const FRACTION_LEVELS: FractionLevel[] = [
  {
    n: 1,
    title: "Foundations",
    desc: "Investigate sharing mistakes — spot unequal halves, repair mis-cut shapes, and explain why fair means equal.",
    meta: ["Grade 1", "12 pages"],
    locked: false,
    href: "/printables/fractions-l1",
  },
  {
    n: 2,
    title: "Classified",
    desc: "Mission classified. Equivalence and number-line cases unlock soon.",
    locked: true,
  },
  {
    n: 3,
    title: "Classified",
    desc: "Mission classified. Comparison and pathway cases unlock soon.",
    locked: true,
  },
];

function FractionLearningPath() {
  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
      {FRACTION_LEVELS.map((lvl) => (
        <li key={lvl.n}>
          <FractionLevelCard lvl={lvl} />
        </li>
      ))}
    </ul>
  );
}

function FractionLevelCard({ lvl }: { lvl: FractionLevel }) {
  const locked = lvl.locked;

  return (
    <div
      aria-disabled={locked || undefined}
      className={`h-full rounded-3xl border border-black/5 bg-white overflow-hidden flex flex-col transition-transform ${
        locked ? "cursor-default" : "hover:-translate-y-1 hover:shadow-md"
      }`}
    >
      {/* Illustrated tile */}
      <div
        className={`relative aspect-[4/3] flex items-center justify-center ${
          locked ? "grayscale opacity-70" : ""
        }`}
        style={{
          background: locked ? "#e7eaef" : "var(--color-bg-mint)",
        }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: locked ? "rgba(30,41,59,0.06)" : "rgba(255,222,89,0.18)",
            border: locked
              ? "2px dashed rgba(30,41,59,0.25)"
              : `2px dashed ${YELLOW}`,
          }}
        >
          <PieChart
            className="w-12 h-12"
            style={{ color: locked ? "#64748b" : BLUE }}
            strokeWidth={2}
          />
        </div>

        <span
          className="absolute top-4 left-4 label-eyebrow px-2 py-1 rounded-full"
          style={{
            background: locked ? "rgba(30,41,59,0.08)" : YELLOW,
            color: locked ? "#64748b" : BLUE,
          }}
        >
          Level {lvl.n}
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
        <p className="label-eyebrow" style={{ color: locked ? "#94a3b8" : MUTED }}>
          Level {lvl.n}
        </p>
        <h3
          className="text-2xl font-black uppercase tracking-tight mt-1"
          style={{ color: locked ? "#64748b" : BLUE }}
        >
          {lvl.title}
        </h3>
        <p
          className="mt-3 text-sm leading-relaxed flex-1"
          style={{ color: locked ? "#94a3b8" : MUTED }}
        >
          {lvl.desc}
        </p>

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

        <div className="mt-7">
          {!locked && lvl.href ? (
            <Link
              to={lvl.href}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:scale-105 transition-transform"
              style={{ background: BLUE, color: "white" }}
            >
              View Case File <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
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
