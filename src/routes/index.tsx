import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Play,
  FileText,
  Brain,
  Shield,
  MessageCircle,
  Sparkles,
  Bot,
} from "lucide-react";
import heroRobot from "@/assets/landing/hero-robot.png";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-brand-mint)";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Glitch Detectives — Reasoning-First Maths for K-6" },
      {
        name: "description",
        content:
          "Glitch Detectives is a neuroinclusive, reasoning-first K-6 maths company. Children hunt errors in AI answers, explain why they are wrong, and build confidence in a world where not every answer can be trusted.",
      },
      { property: "og:title", content: "Glitch Detectives — Reasoning-First Maths for K-6" },
      {
        property: "og:description",
        content:
          "Don't solve. Investigate. Detect. Repair. A calm, neuroinclusive maths company that teaches children to question answers — especially AI-generated ones.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero */}
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
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex flex-wrap gap-2 mb-8">
                <span
                  className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                  style={{ background: MINT, color: BLUE }}
                >
                  K-6 Ecosystem
                </span>
                <span
                  className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
                  style={{ color: YELLOW, borderColor: "rgba(255,222,89,0.4)" }}
                >
                  Reasoning-First Maths Company
                </span>
              </div>

              <h1 className="heading-black text-5xl sm:text-6xl lg:text-7xl uppercase">
                Don't Solve.
                <br />
                <span style={{ color: YELLOW }}>Investigate.</span>
                <br />
                Detect. Repair.
              </h1>

              <div className="relative mt-10 rounded-3xl p-6 sm:p-7 border border-white/15 bg-white/5 backdrop-blur-md overflow-hidden">
                <div
                  className="absolute -top-px left-8 right-8 h-px"
                  style={{ background: YELLOW, boxShadow: `0 0 24px ${YELLOW}` }}
                />
              <p className="text-base sm:text-lg text-white/90 leading-relaxed">
                  <strong className="font-bold block mb-3 text-white">
                    Raise a child who questions answers — not just finds them.
                  </strong>
                  In a world where AI generates answers instantly, the most valuable skill is
                  knowing how to evaluate, verify, and reason. Glitch Detectives builds that skill
                  one mission at a time, with calm, neuroinclusive experiences designed for children
                  who think in different ways and at different speeds.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/play"
                  className="px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform"
                  style={{ background: MINT, color: BLUE }}
                >
                  Explore Worlds <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/printables"
                  className="px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform"
                  style={{ background: YELLOW, color: BLUE }}
                >
                  <FileText className="w-4 h-4" /> Explore Printables
                </Link>
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
              <div
                className="absolute w-[420px] h-[420px] rounded-full blur-3xl opacity-50"
                style={{ background: MINT }}
              />
              <div
                className="absolute w-[320px] h-[320px] rounded-full blur-3xl opacity-50 translate-x-20 translate-y-12"
                style={{ background: YELLOW }}
              />
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

        {/* Proof points */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="label-eyebrow text-lg">What We Build</span>
              <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] mt-3">
                Tools for the AI era
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  t: "AI Role-Reversal",
                  d: "Kids teach the robot, not the other way around.",
                  icon: Bot,
                },
                {
                  t: "Reasoning-First",
                  d: "Explain why, not just what. Understanding beats speed.",
                  icon: Brain,
                },
                {
                  t: "AI Error Hunting",
                  d: "Confident answers aren't always right. Learn to spot the glitch.",
                  icon: Shield,
                },
                {
                  t: "Neuroinclusive",
                  d: "No timers, no pressure. Thinking takes the time it takes.",
                  icon: MessageCircle,
                },
              ].map((c) => (
                <div
                  key={c.t}
                  className="rounded-3xl p-6 border border-black/5 bg-[var(--color-bg-light)] hover:scale-105 transition-transform"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: MINT }}
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

        {/* Products preview */}
        <section style={{ backgroundColor: "var(--color-bg-mint)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="label-eyebrow text-lg">Our Platform</span>
                <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] mt-3">
                  Detective Worlds and printables that teach the same thinking
                </h2>
                <p className="mt-5 text-[var(--color-brand-blue)]/80 text-lg leading-relaxed">
                  The same reasoning loop — investigate, detect, repair, explain — across
                  interactive Detective Worlds and screen-free printable workbooks.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Six Detective Worlds, one active fractions curriculum",
                    "Voice or text explanations, TTS on every line",
                    "No timers, no punishments, no sign-up required",
                    "Cognitive Insights report for adults",
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
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/products"
                    className="px-6 py-3 rounded-full bg-[var(--color-brand-blue)] text-white font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    See Products <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/printables"
                    className="px-6 py-3 rounded-full bg-white text-[var(--color-brand-blue)] font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 border border-black/5 hover:scale-105 transition-transform"
                  >
                    <FileText className="w-4 h-4" /> Printables
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[4/3] rounded-3xl bg-[var(--color-brand-blue)]/10 flex items-center justify-center">
                  <Play className="w-16 h-16 text-[var(--color-brand-blue)]/40" />
                </div>
                <div className="aspect-[4/3] rounded-3xl bg-[var(--color-brand-yellow)]/40 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-[var(--color-brand-blue)]/40" />
                </div>
                <div className="aspect-[4/3] rounded-3xl bg-[var(--color-brand-yellow)]/40 flex items-center justify-center">
                  <Brain className="w-16 h-16 text-[var(--color-brand-blue)]/40" />
                </div>
                <div className="aspect-[4/3] rounded-3xl bg-[var(--color-brand-blue)]/10 flex items-center justify-center">
                  <Shield className="w-16 h-16 text-[var(--color-brand-blue)]/40" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ backgroundColor: YELLOW }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center">
            <h2 className="heading-black uppercase text-4xl sm:text-6xl text-[var(--color-brand-blue)]">
              The future of reasoning-first learning
            </h2>
            <p className="mt-5 text-[var(--color-brand-blue)]/80 text-lg max-w-2xl mx-auto">
              Step into a world where children investigate, repair, and teach their way to
              mathematical mastery.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                to="/play"
                className="px-7 py-4 rounded-full font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 bg-[var(--color-brand-blue)] text-white hover:scale-105 transition-transform"
              >
                Enter Detective Worlds <ArrowRight className="w-4 h-4" />
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
