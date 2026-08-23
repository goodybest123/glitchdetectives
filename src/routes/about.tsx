import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Eye,
  Hand,
  Heart,
  Layers,
  Lightbulb,
  MessageSquare,
  Quote,
  Search,
  Shield,
  Sparkles,
  Zap,
  Wrench,
  MessageCircle,
} from "lucide-react";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-brand-mint)";
const BG_LIGHT = "var(--color-bg-light)";
const BG_MINT = "var(--color-bg-mint)";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Glitch Detectives" },
      {
        name: "description",
        content:
          "Glitch Detectives is a neuroinclusive, reasoning-first K-6 maths platform. We teach children to question answers, verify AI outputs, and explain their thinking — without timers or pressure.",
      },
      { property: "og:title", content: "About — Glitch Detectives" },
      {
        property: "og:description",
        content:
          "We build playful, neuroinclusive learning tools where children hunt errors, question AI answers, and explain their thinking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Mission */}
        <section
          className="relative overflow-hidden dots-bg"
          style={{ backgroundColor: BLUE, color: "white" }}
        >
          <div
            className="pointer-events-none absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full blur-3xl opacity-30"
            style={{ background: MINT }}
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full blur-3xl opacity-25"
            style={{ background: YELLOW }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center">
            <span className="label-eyebrow" style={{ color: YELLOW }}>
              Our Mission
            </span>
            <h1 className="heading-black text-4xl sm:text-5xl lg:text-6xl uppercase mt-4">
              Raise children who question answers
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              In a world where AI can generate answers instantly, the most valuable skill is knowing
              how to evaluate, verify, and reason. Glitch Detectives exists to build that skill —
              one mission at a time.
            </p>
          </div>
        </section>

        {/* Problem */}
        <section style={{ backgroundColor: BG_LIGHT }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
            <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] max-w-3xl">
              Instant answers are not learning
            </h2>
            <div className="grid lg:grid-cols-2 gap-12 mt-12 items-start">
              <div>
                <p className="text-lg text-[var(--color-brand-blue)]/80 leading-relaxed">
                  Getting the right answer is great, but knowing why it's right — and when a
                  confident-looking answer is actually wrong — is even better. The most important
                  skills a child can learn today are how to spot mistakes, fix them, and explain why
                  AI outputs can't always be trusted.
                </p>
                <blockquote
                  className="mt-8 rounded-2xl border-l-4 p-6 italic text-[var(--color-brand-blue)] font-medium"
                  style={{ background: BG_MINT, borderColor: YELLOW }}
                >
                  "The child who can explain <strong>why</strong> an answer is wrong, including a
                  wrong answer from a robot, learns ten times more than the child who only finds the
                  right one."
                </blockquote>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "Memorisation without understanding",
                    body: "Kids learn the steps but can't explain why they work.",
                  },
                  {
                    title: "Blind trust in AI-generated answers",
                    body: "AI sounds confident even when it is wrong. Children need to verify, not just accept.",
                  },
                  {
                    title: "Blank-page anxiety & fear of mistakes",
                    body: "Starting from scratch can feel overwhelming. Mistakes should feel like clues, not failures.",
                  },
                ].map((w) => (
                  <div
                    key={w.title}
                    className="flex gap-4 p-5 rounded-2xl bg-white border border-black/5 hover:scale-[1.02] transition-transform"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold uppercase tracking-wide text-[var(--color-brand-blue)]">
                        {w.title}
                      </h3>
                      <p className="text-[var(--color-brand-blue)]/70 mt-1 text-sm leading-relaxed">
                        {w.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white">
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

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  n: "01",
                  t: "Investigate",
                  d: "Read the AI's answer carefully. Look at the shapes, numbers, and clues.",
                  icon: Search,
                  bg: MINT,
                },
                {
                  n: "02",
                  t: "Detect",
                  d: "Spot the glitch. Where exactly did the robot go wrong?",
                  icon: Zap,
                  bg: YELLOW,
                },
                {
                  n: "03",
                  t: "Repair",
                  d: "Fix the mistake. Cut the shape, regroup the digits, rebuild the logic.",
                  icon: Wrench,
                  bg: MINT,
                },
                {
                  n: "04",
                  t: "Explain",
                  d: "Teach the AI why. Reason aloud — that's where real understanding lives.",
                  icon: MessageCircle,
                  bg: YELLOW,
                },
              ].map((s) => (
                <div
                  key={s.n}
                  className="relative bg-white rounded-[30px] p-6 border border-black/5 hover:scale-105 transition-transform shadow-sm"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: s.bg }}
                  >
                    <s.icon className="w-6 h-6 text-[var(--color-brand-blue)]" strokeWidth={2.4} />
                  </div>
                  <div className="text-xs font-mono font-bold tracking-widest text-[var(--color-brand-blue)]/50">
                    {s.n} / {s.t.toUpperCase()}
                  </div>
                  <h3 className="mt-2 text-xl font-black text-[var(--color-brand-blue)]">{s.t}</h3>
                  <p className="mt-2 text-sm text-[var(--color-brand-blue)]/70 leading-relaxed">
                    {s.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Role Reversal */}
        <section style={{ backgroundColor: "#FFFBE5" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center">
              <Bot className="w-9 h-9 text-[var(--color-brand-blue)]" />
            </div>
            <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] mt-8">
              AI Role-Reversal Experiences
            </h2>
            <p className="mt-5 max-w-2xl mx-auto text-[var(--color-brand-blue)]/75 text-lg leading-relaxed">
              Kids don't just solve problems. They <strong>teach</strong> the robot and{" "}
              <strong>fix</strong> its logic — flipping the script on AI-era learning.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mt-14">
              {[
                {
                  t: "Teaching Strengthens",
                  d: "When kids explain to the AI, their own understanding deepens.",
                  icon: Lightbulb,
                  bg: YELLOW,
                },
                {
                  t: "Explanation Reveals",
                  d: "Reasoning aloud surfaces misconceptions adults can spot and support.",
                  icon: MessageSquare,
                  bg: MINT,
                },
                {
                  t: "Question Outputs",
                  d: "Children learn to challenge confident-sounding answers — including AI's.",
                  icon: Search,
                  bg: YELLOW,
                },
              ].map((c) => (
                <div
                  key={c.t}
                  className="bg-white rounded-3xl p-7 text-left border border-black/5 hover:scale-105 transition-transform shadow-sm"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: c.bg }}
                  >
                    <c.icon className="w-5 h-5 text-[var(--color-brand-blue)]" />
                  </div>
                  <h3 className="font-black text-lg uppercase text-[var(--color-brand-blue)]">
                    {c.t}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-brand-blue)]/70 leading-relaxed">
                    {c.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inclusive */}
        <section className="dots-bg" style={{ backgroundColor: BLUE, color: "white" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="label-eyebrow" style={{ color: YELLOW }}>
                Inclusive by Design
              </span>
              <h2 className="heading-black uppercase text-3xl sm:text-5xl mt-3">
                Designed for All Minds
              </h2>
              <p className="mt-4 text-white/75">
                Our platform is intentionally designed to support different learning styles, calm
                learning, and flexible thinking. We reduce blank-page anxiety by giving every child a
                clear starting point, visible structure, and permission to take their time.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  t: "Low-Pressure Learning",
                  d: "No timers, no scoreboards. Thinking takes the time it takes.",
                  icon: Heart,
                },
                {
                  t: "Reasoning Over Speed",
                  d: "We reward how you think, not how fast you click.",
                  icon: Brain,
                },
                {
                  t: "Visual Supports",
                  d: "Every concept has a shape, a colour, and a structure to see.",
                  icon: Eye,
                },
                {
                  t: "Calm Interactions",
                  d: "Soft motion, muted sound, gentle feedback. No overstimulation.",
                  icon: Sparkles,
                },
                {
                  t: "Predictable Layouts",
                  d: "The same trustworthy structure across every world.",
                  icon: Layers,
                },
                {
                  t: "Multiple Ways to Express",
                  d: "Tap, drag, draw, or speak your reasoning aloud.",
                  icon: Hand,
                },
                {
                  t: "No Blank-Page Fear",
                  d: "Every mission starts with a clear prompt, so children never face an empty screen or worksheet alone.",
                  icon: MessageCircle,
                },
              ].map((c) => (
                <div
                  key={c.t}
                  className="rounded-3xl p-6 border border-white/15 bg-white/5 hover:scale-105 transition-transform"
                >
                  <div
                    className="w-12 h-12 rounded-2xl border border-white/20 flex items-center justify-center mb-4"
                    style={{ background: "rgba(255,222,89,0.12)" }}
                  >
                    <c.icon className="w-5 h-5" style={{ color: YELLOW }} />
                  </div>
                  <h3 className="font-black uppercase tracking-wide">{c.t}</h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
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
                    <h3 className="font-black uppercase tracking-wide text-[var(--color-brand-blue)] mb-3">
                      Core Skills
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Critical thinking",
                        "Step-by-step reasoning",
                        "Mathematical vocabulary",
                        "Confidence with mistakes",
                      ].map((s) => (
                        <li
                          key={s}
                          className="flex items-start gap-2 text-[var(--color-brand-blue)]/80"
                        >
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />{" "}
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-wide text-[var(--color-brand-blue)] mb-3">
                      AI-Era Skills
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Evaluating AI outputs",
                        "Spotting confident wrong answers",
                        "Asking better questions",
                        "Verifying instead of trusting",
                      ].map((s) => (
                        <li
                          key={s}
                          className="flex items-start gap-2 text-[var(--color-brand-blue)]/80"
                        >
                          <Sparkles className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />{" "}
                          <span>{s}</span>
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
                  { I: Shield, c: YELLOW, off: "-translate-y-2" },
                  { I: MessageCircle, c: MINT, off: "translate-y-6" },
                ].map(({ I, c, off }, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-[36px] flex items-center justify-center hover:scale-105 transition-transform ${off}`}
                    style={{ background: c }}
                  >
                    <I className="w-16 h-16 text-[var(--color-brand-blue)]" strokeWidth={1.8} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ backgroundColor: BG_MINT }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="label-eyebrow text-lg">Voices</span>
              <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] mt-3">
                Trusted by Learners
              </h2>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Maya R.",
                  role: "Parent of a Grade 1 learner",
                  quote:
                    "She actually wants to explain her thinking now. It's like the experience gave her permission to be slow and curious.",
                },
                {
                  name: "Daniel K.",
                  role: "Homeschool Dad",
                  quote:
                    "The role-reversal moment — when my son teaches the robot — is where I've seen the biggest breakthroughs.",
                },
                {
                  name: "Priya S.",
                  role: "Math Tutor",
                  quote:
                    "Finally a platform that doesn't reward speed. My neurodivergent students feel safe making mistakes here.",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="relative bg-white rounded-3xl p-7 border border-black/5 hover:scale-105 transition-transform shadow-sm"
                >
                  <Quote
                    className="absolute top-5 left-5 w-12 h-12"
                    style={{ color: YELLOW }}
                    fill={YELLOW}
                  />
                  <p className="relative text-[var(--color-brand-blue)] text-base leading-relaxed mt-12 italic">
                    "{t.quote}"
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-black text-[var(--color-brand-blue)]"
                      style={{ background: MINT }}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-[var(--color-brand-blue)] text-sm">
                        {t.name}
                      </div>
                      <div className="text-xs text-[var(--color-brand-blue)]/60 uppercase tracking-wider">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ backgroundColor: YELLOW }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center">
            <h2 className="heading-black uppercase text-4xl sm:text-6xl text-[var(--color-brand-blue)]">
              Ready to see the platform?
            </h2>
            <p className="mt-5 text-[var(--color-brand-blue)]/80 text-lg max-w-2xl mx-auto">
              Step into a world where children investigate, repair, and teach their way to
              mathematical mastery.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                to="/products"
                className="px-7 py-4 rounded-full font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 bg-[var(--color-brand-blue)] text-white hover:scale-105 transition-transform"
              >
                View Products <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="px-7 py-4 rounded-full font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 bg-white text-[var(--color-brand-blue)] hover:scale-105 transition-transform"
              >
                Contact Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
