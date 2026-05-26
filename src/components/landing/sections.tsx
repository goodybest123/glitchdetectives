import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle, ArrowRight, Award, Brain, CheckCircle2, Eye, Hand,
  Heart, Layers, Lightbulb, Lock, MessageCircle, MessageSquare, Quote, Search,
  Shield, Sparkles, Wrench, Zap, Bot, Facebook, Twitter, Instagram, Youtube,
} from "lucide-react";
import heroRobot from "@/assets/landing/hero-robot.png";
import imgFractions from "@/assets/landing/world-fractions.jpg";
import imgDecimals from "@/assets/landing/world-decimals.jpg";
import imgPlaceValue from "@/assets/landing/world-placevalue.jpg";
import imgGeometry from "@/assets/landing/world-geometry.jpg";
import imgAlgebra from "@/assets/landing/world-algebra.jpg";
import imgAiLogic from "@/assets/landing/world-ailogic.jpg";
import imgWorksheets from "@/assets/landing/print-worksheets.jpg";
import imgTactile from "@/assets/landing/print-tactile.jpg";
import imgStories from "@/assets/landing/print-stories.jpg";
import imgRealworld from "@/assets/landing/print-realworld.jpg";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-brand-mint)";
const BG_LIGHT = "var(--color-bg-light)";
const BG_MINT = "var(--color-bg-mint)";

/* -------------------- HERO -------------------- */
export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden dots-bg"
      style={{ backgroundColor: BLUE, color: "white" }}
    >
      {/* glow blobs */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full blur-3xl opacity-30" style={{ background: MINT }} />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full blur-3xl opacity-25" style={{ background: YELLOW }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: MINT, color: BLUE }}>
              K-6 Ecosystem
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border" style={{ color: YELLOW, borderColor: "rgba(255,222,89,0.4)" }}>
              Reasoning-First Maths Platform
            </span>
          </div>

          <h1 className="heading-black text-5xl sm:text-6xl lg:text-7xl uppercase">
            Don't Solve.<br />
            <span style={{ color: YELLOW }}>Investigate.</span><br />
            Detect. Repair.
          </h1>

          <div className="relative mt-10 rounded-3xl p-6 sm:p-7 border border-white/15 bg-white/5 backdrop-blur-md overflow-hidden">
            <div className="absolute -top-px left-8 right-8 h-px" style={{ background: YELLOW, boxShadow: `0 0 24px ${YELLOW}` }} />
            <p className="text-base sm:text-lg text-white/90 leading-relaxed">
              <strong className="font-bold block mb-3 text-white">Raise a child who questions answers. Not just finds them.</strong>
              In a world where AI generates answers instantly, the most valuable skill is knowing how to evaluate, verify, and reason. Glitch Detectives builds that skill: one mission at a time.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#worlds" className="px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform" style={{ background: MINT, color: BLUE }}>
              Explore the Worlds <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#printables" className="px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform" style={{ background: YELLOW, color: BLUE }}>
              Explore the Printables <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            {["Reasoning First", "Built for Curious Minds", "AI-Era Learning"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: MINT }} /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute w-[420px] h-[420px] rounded-full blur-3xl opacity-50" style={{ background: MINT }} />
          <div className="absolute w-[320px] h-[320px] rounded-full blur-3xl opacity-50 translate-x-20 translate-y-12" style={{ background: YELLOW }} />
          <img
            src={heroRobot}
            alt="Detective robot mascot inspecting math glitches with a magnifying glass"
            width={520}
            height={520}
            className="relative w-[320px] sm:w-[440px] lg:w-[520px] drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------- PROBLEM -------------------- */
export function ProblemSection() {
  const warnings = [
    { title: "Memorisation without understanding", body: "Kids learn the steps but can't explain why they work." },
    { title: "Overreliance on answer-getting", body: "AI delivers answers instantly — but skips the reasoning." },
    { title: "Weak reasoning skills & fear of mistakes", body: "Mistakes become shameful instead of useful clues." },
  ];
  return (
    <section style={{ backgroundColor: BG_LIGHT }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] max-w-3xl">
          Instant answers are not learning
        </h2>
        <div className="grid lg:grid-cols-2 gap-12 mt-12 items-start">
          <div>
            <p className="text-lg text-[var(--color-brand-blue)]/80 leading-relaxed">
              Getting the right answer is great, but knowing why it's right is even better. The most important skills you can learn are how to spot mistakes, fix them, and teach someone else how you figured it out.
            </p>
            <blockquote
              className="mt-8 rounded-2xl border-l-4 p-6 italic text-[var(--color-brand-blue)] font-medium"
              style={{ background: BG_MINT, borderColor: YELLOW }}
            >
              "The child who can explain <strong>why</strong> an answer is wrong learns ten times more than the child who only finds the right one."
            </blockquote>
          </div>
          <div className="space-y-4">
            {warnings.map((w) => (
              <div key={w.title} className="flex gap-4 p-5 rounded-2xl bg-white border border-black/5 hover:scale-[1.02] transition-transform">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-wide text-[var(--color-brand-blue)]">{w.title}</h3>
                  <p className="text-[var(--color-brand-blue)]/70 mt-1 text-sm leading-relaxed">{w.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- HOW IT WORKS -------------------- */
export function HowItWorks() {
  const steps = [
    { n: "01", t: "Investigate", d: "Read the AI's answer carefully. Look at the shapes, numbers, and clues.", icon: Search, bg: MINT },
    { n: "02", t: "Detect", d: "Spot the glitch. Where exactly did the robot go wrong?", icon: Zap, bg: YELLOW },
    { n: "03", t: "Repair", d: "Fix the mistake. Cut the shape, regroup the digits, rebuild the logic.", icon: Wrench, bg: MINT },
    { n: "04", t: "Explain", d: "Teach the AI why. Reason aloud — that's where real understanding lives.", icon: MessageCircle, bg: YELLOW },
  ];
  return (
    <section id="how-it-works" style={{ backgroundColor: BG_LIGHT }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="label-eyebrow text-lg">The Loop</span>
          <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] mt-3">
            How Glitch Detectives Works
          </h2>
          <p className="mt-4 text-[var(--color-brand-blue)]/70">
            Four calm, repeatable steps that turn every mistake into a thinking moment.
          </p>
        </div>

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block absolute left-12 right-12 top-16 h-px bg-dashed" style={{ borderTop: `2px dashed ${BLUE}`, opacity: 0.15 }} />
          {steps.map((s) => (
            <div key={s.n} className="relative bg-white rounded-[30px] p-6 border border-black/5 hover:scale-105 transition-transform shadow-sm">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: s.bg }}>
                <s.icon className="w-6 h-6 text-[var(--color-brand-blue)]" strokeWidth={2.4} />
              </div>
              <div className="text-xs font-mono font-bold tracking-widest text-[var(--color-brand-blue)]/50">{s.n} / {s.t.toUpperCase()}</div>
              <h3 className="mt-2 text-xl font-black text-[var(--color-brand-blue)]">{s.t}</h3>
              <p className="mt-2 text-sm text-[var(--color-brand-blue)]/70 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- WORLDS -------------------- */
type World = { title: string; subtitle: string; img: string; active: boolean; href?: string };
const WORLDS: World[] = [
  { title: "Fraction Factory", subtitle: "Repair mis-cut shapes and teach ZED-4 about equal parts.", img: imgFractions, active: true, href: "/play" },
  { title: "Decimal District", subtitle: "Investigate place value glitches in the decimal city.", img: imgDecimals, active: false },
  { title: "Place Value Pavilion", subtitle: "Stack and regroup ones, tens, hundreds.", img: imgPlaceValue, active: false },
  { title: "Geometry Lab", subtitle: "Test shape properties, angles, and symmetry.", img: imgGeometry, active: false },
  { title: "Algebra Archives", subtitle: "Unlock the meaning behind variables.", img: imgAlgebra, active: false },
  { title: "AI Logic Lab", subtitle: "Probe how the AI thinks — and where it fails.", img: imgAiLogic, active: false },
];

export function WorldsSection() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? WORLDS : WORLDS.slice(0, 3);
  return (
    <section id="worlds" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="label-eyebrow text-lg">The Map</span>
          <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] mt-3">
            Explore Detective Worlds
          </h2>
          <p className="mt-4 text-[var(--color-brand-blue)]/70">
            Each world is a self-contained reasoning playground for a different maths concept.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((w) => {
            const Card = (
              <div className={`group relative rounded-3xl overflow-hidden border border-black/5 bg-[var(--color-bg-light)] hover:scale-[1.03] transition-transform shadow-sm ${!w.active ? "" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={w.img}
                    alt={w.title}
                    width={768}
                    height={576}
                    loading="lazy"
                    className={`w-full h-full object-cover ${!w.active ? "grayscale opacity-60" : ""}`}
                  />
                  {!w.active && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-[var(--color-brand-blue)]" />
                      </div>
                    </div>
                  )}
                  {w.active && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[var(--color-brand-yellow)] text-[var(--color-brand-blue)] text-xs font-bold uppercase tracking-widest">
                      Active Mission
                    </span>
                  )}
                  {!w.active && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 text-[var(--color-brand-blue)] text-xs font-bold uppercase tracking-widest">
                      Coming Soon
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-[var(--color-brand-blue)]">{w.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-brand-blue)]/70 leading-relaxed">{w.subtitle}</p>
                  {w.active && (
                    <div className="mt-5 inline-flex items-center gap-2 font-bold uppercase tracking-wider text-sm text-[var(--color-brand-blue)] group-hover:gap-3 transition-all">
                      Enter World <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
            return w.active && w.href ? (
              <Link key={w.title} to={w.href}>{Card}</Link>
            ) : (
              <div key={w.title}>{Card}</div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="px-6 py-3 rounded-full bg-[var(--color-brand-blue)] text-white font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform"
          >
            {showAll ? "Show Fewer Worlds" : "See More Worlds"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* -------------------- AI ROLE-REVERSAL -------------------- */
export function RoleReversal() {
  const cards = [
    { t: "Teaching Strengthens", d: "When kids explain to the AI, their own understanding deepens." },
    { t: "Explanation Reveals", d: "Reasoning aloud surfaces misconceptions adults can spot and support." },
    { t: "Question Outputs", d: "Children learn to challenge confident-sounding answers — including AI's." },
  ];
  return (
    <section style={{ backgroundColor: "#FFFBE5" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center">
          <Bot className="w-9 h-9 text-[var(--color-brand-blue)]" />
        </div>
        <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] mt-8">
          AI Role-Reversal Experiences
        </h2>
        <p className="mt-5 max-w-2xl mx-auto text-[var(--color-brand-blue)]/75 text-lg leading-relaxed">
          Kids don't just solve problems. They <strong>teach</strong> the robot and <strong>fix</strong> its logic — flipping
          the script on AI-era learning.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mt-14">
          {cards.map((c, i) => (
            <div key={c.t} className="bg-white rounded-3xl p-7 text-left border border-black/5 hover:scale-105 transition-transform shadow-sm">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: i % 2 ? MINT : YELLOW }}>
                {i === 0 ? <Lightbulb className="w-5 h-5 text-[var(--color-brand-blue)]" /> : i === 1 ? <MessageSquare className="w-5 h-5 text-[var(--color-brand-blue)]" /> : <Search className="w-5 h-5 text-[var(--color-brand-blue)]" />}
              </div>
              <h3 className="font-black text-lg uppercase text-[var(--color-brand-blue)]">{c.t}</h3>
              <p className="mt-2 text-sm text-[var(--color-brand-blue)]/70 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- PRINTABLES -------------------- */
export function Printables() {
  const items = [
    { t: "Glitch Detective Worksheets", d: "Find hidden errors in mathematical equations.", img: imgWorksheets, href: "/printables" as const },
    { t: "Tactile Activities", d: "Hands-on learning through cutting and gluing.", img: imgTactile },
    { t: "Story-Based Adventures", d: "Narrative missions that makes the math to make sense.", img: imgStories },
    { t: "Real-World Challenges", d: "Applying math reasoning in real world scenarios.", img: imgRealworld },
  ];
  return (
    <section id="printables" style={{ backgroundColor: BG_MINT }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="label-eyebrow text-lg">Off-Screen</span>
          <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] mt-3">
            No screen? No problem.
          </h2>
          <p className="mt-5 text-[var(--color-brand-blue)]/80 text-base sm:text-lg leading-relaxed">
            Children can still experience the full Glitch Detectives reasoning journey through calm, hands-on printable activities designed for families who prefer low-screen or screen-free learning.
          </p>
          <p className="mt-3 text-[var(--color-brand-blue)]/60 text-sm">
            Calm, tactile activities that extend the detective loop beyond the screen.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it) => {
            const inner = (
              <>
                <img src={it.img} alt={it.t} width={768} height={768} loading="lazy" className="w-full aspect-square object-cover" />
                <div className="p-5">
                  <h3 className="font-black uppercase text-[var(--color-brand-blue)] text-sm tracking-wide">{it.t}</h3>
                  <p className="mt-2 text-[var(--color-brand-blue)]/70 text-sm leading-relaxed">{it.d}</p>
                </div>
              </>
            );
            const className = "block bg-white rounded-3xl overflow-hidden border border-black/5 hover:scale-105 transition-transform shadow-sm";
            return it.href ? (
              <Link key={it.t} to={it.href} className={className}>{inner}</Link>
            ) : (
              <div key={it.t} className={className}>{inner}</div>
            );
          })}
        </div>


      </div>
    </section>
  );
}

/* -------------------- NEURODIVERGENT -------------------- */
export function Neurodivergent() {
  const cards = [
    { t: "Low-Pressure Learning", d: "No timers, no scoreboards. Thinking takes the time it takes.", icon: Heart },
    { t: "Reasoning Over Speed", d: "We reward how you think, not how fast you click.", icon: Brain },
    { t: "Visual Supports", d: "Every concept has a shape, a colour, and a structure to see.", icon: Eye },
    { t: "Calm Interactions", d: "Soft motion, muted sound, gentle feedback. No overstimulation.", icon: Sparkles },
    { t: "Predictable Layouts", d: "The same trustworthy structure across every world.", icon: Layers },
    { t: "Multiple Ways to Express", d: "Tap, drag, draw, or speak your reasoning aloud.", icon: Hand },
  ];
  return (
    <section className="dots-bg" style={{ backgroundColor: BLUE, color: "white" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="label-eyebrow" style={{ color: YELLOW }}>Inclusive by Design</span>
          <h2 className="heading-black uppercase text-3xl sm:text-5xl mt-3">Designed for All Minds</h2>
          <p className="mt-4 text-white/75">
            Our platform is intentionally designed to support different learning styles, calm learning,
            and flexible thinking.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c) => (
            <div key={c.t} className="rounded-3xl p-6 border border-white/15 bg-white/5 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-2xl border border-white/20 flex items-center justify-center mb-4" style={{ background: "rgba(255,222,89,0.12)" }}>
                <c.icon className="w-5 h-5" style={{ color: YELLOW }} />
              </div>
              <h3 className="font-black uppercase tracking-wide">{c.t}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- BENEFITS -------------------- */
export function Benefits() {
  const core = ["Critical thinking", "Step-by-step reasoning", "Mathematical vocabulary", "Confidence with mistakes"];
  const ai = ["Evaluating AI outputs", "Spotting confident wrong answers", "Asking better questions", "Verifying instead of trusting"];
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="label-eyebrow text-lg">Beyond the Answer</span>
            <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] mt-3">
              Skills that survive the AI era
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mt-10">
              <div>
                <h3 className="font-black uppercase tracking-wide text-[var(--color-brand-blue)] mb-3">Core Skills</h3>
                <ul className="space-y-2">
                  {core.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-[var(--color-brand-blue)]/80">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" /> <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-black uppercase tracking-wide text-[var(--color-brand-blue)] mb-3">AI-Era Skills</h3>
                <ul className="space-y-2">
                  {ai.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-[var(--color-brand-blue)]/80">
                      <Sparkles className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" /> <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-5">
            {[
              { I: Brain, c: MINT, off: "translate-y-6" },
              { I: Shield, c: YELLOW, off: "-translate-y-2" },
              { I: Award, c: YELLOW, off: "-translate-y-2" },
              { I: MessageCircle, c: MINT, off: "translate-y-6" },
            ].map(({ I, c, off }, i) => (
              <div key={i} className={`aspect-square rounded-[36px] flex items-center justify-center hover:scale-105 transition-transform ${off}`} style={{ background: c }}>
                <I className="w-16 h-16 text-[var(--color-brand-blue)]" strokeWidth={1.8} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- TESTIMONIALS -------------------- */
export function Testimonials() {
  const items = [
    { name: "Maya R.", role: "Parent of a Grade 1 learner", quote: "She actually wants to explain her thinking now. It's like the game gave her permission to be slow and curious." },
    { name: "Daniel K.", role: "Homeschool Dad", quote: "The role-reversal moment — when my son teaches the robot — is where I've seen the biggest breakthroughs." },
    { name: "Priya S.", role: "Math Tutor", quote: "Finally a platform that doesn't reward speed. My neurodivergent students feel safe making mistakes here." },
  ];
  return (
    <section style={{ backgroundColor: BG_MINT }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="label-eyebrow text-lg">Voices</span>
          <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] mt-3">Trusted by Learners</h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.name} className="relative bg-white rounded-3xl p-7 border border-black/5 hover:scale-105 transition-transform shadow-sm">
              <Quote className="absolute top-5 left-5 w-12 h-12" style={{ color: YELLOW }} fill={YELLOW} />
              <p className="relative text-[var(--color-brand-blue)] text-base leading-relaxed mt-12 italic">"{t.quote}"</p>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-[var(--color-brand-blue)]" style={{ background: MINT }}>
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-bold text-[var(--color-brand-blue)] text-sm">{t.name}</div>
                  <div className="text-xs text-[var(--color-brand-blue)]/60 uppercase tracking-wider">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- FINAL CTA -------------------- */
export function FinalCTA() {
  return (
    <section style={{ backgroundColor: YELLOW }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center">
        <h2 className="heading-black uppercase text-4xl sm:text-6xl text-[var(--color-brand-blue)]">
          The future of reasoning-first learning
        </h2>
        <p className="mt-5 text-[var(--color-brand-blue)]/80 text-lg max-w-2xl mx-auto">
          Step into a world where children investigate, repair, and teach their way to mathematical mastery.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/play" className="px-7 py-4 rounded-full font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 bg-[var(--color-brand-blue)] text-white hover:scale-105 transition-transform">
            Explore the Worlds <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#printables" className="px-7 py-4 rounded-full font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 bg-white text-[var(--color-brand-blue)] hover:scale-105 transition-transform">
            Explore the Printables <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------- FOOTER -------------------- */
export function Footer() {
  return (
    <footer style={{ backgroundColor: BLUE, color: "white" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[var(--color-brand-yellow)] flex items-center justify-center">
            <Search className="w-5 h-5 text-[var(--color-brand-blue)]" strokeWidth={3} />
          </div>
          <div className="leading-none">
            <div className="text-xl font-black tracking-tight">GLITCH</div>
            <div className="text-[10px] font-semibold tracking-[0.35em]">DETECTIVES</div>
          </div>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm uppercase tracking-wider font-semibold text-white/80">
          {["About Us", "Contact", "Terms", "Privacy"].map((l) => (
            <li key={l}><a href="#" className="hover:text-white">{l}</a></li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          {[Facebook, Twitter, Instagram, Youtube].map((Ic, i) => (
            <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Social link">
              <Ic className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 text-xs text-white/60 text-center">
          © {new Date().getFullYear()} Glitch Detectives. Built for curious minds.
        </div>
      </div>
    </footer>
  );
}
