import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Factory, Lock, Shield, Sparkles,
  Layers, Scissors, Ruler, Wrench, Calculator, FlaskConical,
} from "lucide-react";
import FractionFactoryLevel1 from "@/components/FractionFactoryLevel1";
import FractionFactoryLevel2 from "@/components/FractionFactoryLevel2";
import FractionFactoryLevel3 from "@/components/FractionFactoryLevel3";
import FractionFactoryLevel4 from "@/components/FractionFactoryLevel4";
import FractionFactoryLevel5 from "@/components/FractionFactoryLevel5";
import FractionFactoryLevel6 from "@/components/FractionFactoryLevel6";
import { useLevelProgress } from "@/lib/mission-progress";



export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Fraction Factory — Level Select" },
      { name: "description", content: "Central control hub for the Fraction Factory world." },
    ],
  }),
  component: Play,
});

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-brand-mint)";
const BG_LIGHT = "var(--color-bg-light)";

type Level = {
  n: number;
  grade: number;
  title: string;
  desc: string;
  focus: string;
  missions: number;
  done: number;
  unlocked: boolean;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
};

const LEVELS: Level[] = [
  { n: 1, grade: 1, title: "Fraction Foundations", desc: "Spot unequal parts, repair halves, build quarters, and master mixed shares.", focus: "Halves & quarters", missions: 4, done: 0, unlocked: true, Icon: Layers },
  { n: 2, grade: 2, title: "Fraction Discovery Zone", desc: "Children begin understanding how fractions are written and interpreted.", focus: "Numerators, denominators, unit fractions", missions: 4, done: 0, unlocked: false, Icon: Scissors },
  { n: 3, grade: 3, title: "Fraction Pathways & Equivalence City", desc: "Repair pathways, sync equivalence reactors, balance comparison scanners, and restore the identity vault.", focus: "Number lines · Equivalence · Comparison · Whole numbers", missions: 4, done: 0, unlocked: true, Icon: Ruler },
  { n: 4, grade: 4, title: "Fraction Repair Systems", desc: "Repair the merge stations, fix subtraction leaks, stabilise denominator cores, fire equivalence boosters, simplify, and master multi-step repairs.", focus: "Add · Subtract · Denominator stability · Equivalence · Simplify · Master repair", missions: 6, done: 0, unlocked: true, Icon: Wrench },
  { n: 5, grade: 5, title: "Fraction Power Grid", desc: "Synchronize the city's power stations, balance resource cores, fire scaling reactors, boost transport trains, distribute supplies, and reconnect the central command tower.", focus: "Add unlike · Subtract unlike · Multiply · Multiply by whole · Divide · Fractions as division", missions: 6, done: 0, unlocked: true, Icon: Calculator },
  { n: 6, grade: 6, title: "Fraction Nexus", desc: "Repair the Nexus Core. Divide fractions, master mixed numbers, and reconnect the fraction, decimal, and percentage languages.", focus: "Divide · Mixed numbers · Fractions ↔ Decimals ↔ Percentages · Multi-step reasoning", missions: 7, done: 0, unlocked: true, Icon: FlaskConical },
];

function Play() {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  if (activeLevel === 1) {
    return <FractionFactoryLevel1 onExitToHub={() => setActiveLevel(null)} />;
  }
  if (activeLevel === 2) {
    return <FractionFactoryLevel2 onExitToHub={() => setActiveLevel(null)} />;
  }
  if (activeLevel === 3) {
    return <FractionFactoryLevel3 onExitToHub={() => setActiveLevel(null)} />;
  }
  if (activeLevel === 4) {
    return <FractionFactoryLevel4 onExitToHub={() => setActiveLevel(null)} />;
  }
  if (activeLevel === 5) {
    return <FractionFactoryLevel5 onExitToHub={() => setActiveLevel(null)} />;
  }
  if (activeLevel === 6) {
    return <FractionFactoryLevel6 onExitToHub={() => setActiveLevel(null)} />;
  }
  return <LevelSelect onStart={(n) => setActiveLevel(n)} />;
}

function LevelSelect({ onStart }: { onStart: (n: number) => void }) {
  const level1 = useLevelProgress(1);
  const level2 = useLevelProgress(2);
  const level3 = useLevelProgress(3);
  const level4 = useLevelProgress(4);
  const level5 = useLevelProgress(5);
  const level6 = useLevelProgress(6);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const levels = LEVELS.map((l) => {
    if (!mounted) return l;
    if (l.n === 1) return { ...l, done: level1.completedCount };
    if (l.n === 2) return { ...l, done: level2.completedCount, unlocked: true };
    if (l.n === 3) return { ...l, done: level3.completedCount, unlocked: true };
    if (l.n === 4) return { ...l, done: level4.completedCount, unlocked: true };
    if (l.n === 5) return { ...l, done: level5.completedCount, unlocked: true };
    if (l.n === 6) return { ...l, done: level6.completedCount, unlocked: true };
    return l;
  });


  return (
    <main className="min-h-screen" style={{ background: BG_LIGHT }}>
      {/* Hero header */}
      <header
        className="relative overflow-hidden rounded-b-3xl"
        style={{ background: BLUE, color: "white" }}
      >
        <div className="pointer-events-none absolute -top-24 -left-16 w-80 h-80 rounded-full blur-3xl opacity-25" style={{ background: MINT }} />
        <div className="pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ background: YELLOW }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Link
              to="/"
              hash="worlds"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Map
            </Link>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: YELLOW, color: BLUE }}
            >
              <Shield className="w-3.5 h-3.5" /> Detective Access Granted
            </span>
          </div>

          <div className="flex flex-col items-center text-center mt-10">
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [6, 10, 6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{ background: YELLOW }}
            >
              <Factory className="w-10 h-10" style={{ color: BLUE }} />
            </motion.div>
            <h1 className="heading-black uppercase text-5xl sm:text-6xl mt-6">Fraction Factory</h1>
            <p className="label-eyebrow mt-3" style={{ color: MINT }}>Central Control Hub</p>
            <p className="text-sm text-white/70 mt-4 max-w-xl inline-flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4" style={{ color: YELLOW }} />
              Six levels of fraction missions. Repair the glitches, teach ZED-4.
            </p>
          </div>
        </div>
      </header>

      {/* Timeline */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {/* Vertical track */}
        <div
          aria-hidden
          className="absolute top-0 bottom-0 w-px left-6 md:left-1/2 md:-translate-x-1/2"
          style={{ background: "color-mix(in oklab, var(--color-brand-blue) 18%, transparent)" }}
        />

        <ul className="space-y-12 md:space-y-20">
          {levels.map((lvl, i) => {
            const reverse = i % 2 === 1;
            return (
              <li key={lvl.n} className="relative">
                {/* center node */}
                <div
                  className="absolute z-10 w-5 h-5 rounded-full ring-4 ring-[var(--color-bg-light)] left-6 md:left-1/2 md:-translate-x-1/2 top-6"
                  style={{ background: lvl.unlocked ? BLUE : "#cbd5e1" }}
                />
                <div className={`flex ${reverse ? "md:flex-row-reverse" : "md:flex-row"} flex-row pl-16 md:pl-0`}>
                  <LevelCard lvl={lvl} onStart={onStart} />
                  {/* spacer for the other side */}
                  <div className="hidden md:block md:w-[8%]" />
                  <div className="hidden md:block md:w-[46%]" />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

function LevelCard({ lvl, onStart }: { lvl: Level; onStart: (n: number) => void }) {
  const Icon = lvl.Icon;
  const unlocked = lvl.unlocked;
  return (
    <motion.div
      whileHover={unlocked ? { y: -4 } : undefined}
      className={`relative w-full md:w-[46%] bg-white rounded-2xl p-6 overflow-hidden border shadow-md transition-all ${
        unlocked
          ? "hover:shadow-xl"
          : "opacity-60 pointer-events-none"
      }`}
      style={{
        borderColor: unlocked ? YELLOW : "#e5e7eb",
      }}
    >
      {/* Decorative blurred circle */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl opacity-40"
        style={{ background: unlocked ? MINT : "#e5e7eb" }}
      />

      <div className="relative">
        {/* Top row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0"
            style={{ background: unlocked ? BLUE : "#94a3b8" }}
          >
            <Icon className={`w-6 h-6`} style={{ color: unlocked ? YELLOW : "white" }} />
          </div>
          {unlocked ? (
            <span className="label-eyebrow px-2.5 py-1 rounded-full" style={{ background: YELLOW, color: BLUE }}>
              In Progress
            </span>
          ) : (
            <span className="label-eyebrow px-2.5 py-1 rounded-full inline-flex items-center gap-1 bg-gray-200 text-gray-600">
              <Lock className="w-3 h-3" /> Locked
            </span>
          )}
          <span className="ml-auto text-xs font-mono text-gray-500">
            {lvl.done}/{lvl.missions} missions completed
          </span>
        </div>

        {/* Body */}
        <p className="label-eyebrow mt-5 text-gray-500">Level {lvl.n} • Grade {lvl.grade}</p>
        <h3 className="text-2xl font-bold mt-1" style={{ color: BLUE }}>{lvl.title}</h3>

        <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm text-gray-600 border border-gray-100">
          {lvl.desc}
        </div>

        <p className="mt-4 text-sm">
          <span className="font-semibold" style={{ color: BLUE }}>Focus Areas: </span>
          <span className="text-gray-600">{lvl.focus}</span>
        </p>

        {/* Bottom */}
        <div className="mt-6">
          {unlocked ? (
            <button
              onClick={() => onStart(lvl.n)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-transform hover:scale-[1.02]"
              style={{ background: BLUE, color: "white" }}
            >
              Enter Level <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-gray-200 text-gray-500 cursor-not-allowed"
            >
              <Lock className="w-4 h-4" /> Level Locked
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
