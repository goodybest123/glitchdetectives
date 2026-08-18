import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Lock, Play, FileText, Users, BookOpen } from "lucide-react";
import heroRobot from "@/assets/landing/hero-robot.png";
import imgFractions from "@/assets/landing/world-fractions.jpg";
import imgDecimals from "@/assets/landing/world-decimals.jpg";
import imgPlaceValue from "@/assets/landing/world-placevalue.jpg";
import imgGeometry from "@/assets/landing/world-geometry.jpg";
import imgAlgebra from "@/assets/landing/world-algebra.jpg";
import imgAiLogic from "@/assets/landing/world-ailogic.jpg";
import imgWorksheets from "@/assets/landing/print-worksheets.jpg";
import imgTactile from "@/assets/landing/print-tactile.jpg";
import imgRealworld from "@/assets/landing/print-realworld.jpg";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-brand-mint)";
const BG_MINT = "var(--color-bg-mint)";
const BG_LIGHT = "var(--color-bg-light)";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Glitch Detectives" },
      {
        name: "description",
        content:
          "Explore the Glitch Detectives platform: a playful K-6 reasoning game and screen-free printable workbook collections.",
      },
      { property: "og:title", content: "Products — Glitch Detectives" },
      {
        property: "og:description",
        content:
          "AI role-reversal games and printable workbooks that teach children to investigate, repair, and explain mathematical thinking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
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
              <span className="label-eyebrow" style={{ color: YELLOW }}>
                Products
              </span>
              <h1 className="heading-black text-4xl sm:text-5xl lg:text-6xl uppercase mt-4">
                Play, Print, and Reason
              </h1>
              <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-xl">
                Glitch Detectives combines an interactive AI role-reversal game with screen-free
                printable workbooks. Both follow the same reasoning-first loop: investigate, detect,
                repair, explain.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/play"
                  className="px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform"
                  style={{ background: MINT, color: BLUE }}
                >
                  <Play className="w-4 h-4" /> Try the Game Free
                </Link>
                <Link
                  to="/printables"
                  className="px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform"
                  style={{ background: YELLOW, color: BLUE }}
                >
                  <FileText className="w-4 h-4" /> Browse Printables
                </Link>
              </div>
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

        {/* Game Platform */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="label-eyebrow text-lg">The Game</span>
              <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] mt-3">
                Interactive Detective Worlds
              </h2>
              <p className="mt-4 text-[var(--color-brand-blue)]/70">
                Each world is a self-contained reasoning playground for a different maths concept.
                Children investigate an AI's mistakes, repair them, and explain the fix in their own
                words.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Fraction Factory",
                  subtitle: "Repair mis-cut shapes and teach ZED-4 about equal parts.",
                  img: imgFractions,
                  active: true,
                  href: "/play" as const,
                },
                {
                  title: "Decimal District",
                  subtitle: "Investigate place value glitches in the decimal city.",
                  img: imgDecimals,
                  active: false,
                },
                {
                  title: "Place Value Pavilion",
                  subtitle: "Stack and regroup ones, tens, hundreds.",
                  img: imgPlaceValue,
                  active: false,
                },
                {
                  title: "Geometry Lab",
                  subtitle: "Test shape properties, angles, and symmetry.",
                  img: imgGeometry,
                  active: false,
                },
                {
                  title: "Algebra Archives",
                  subtitle: "Unlock the meaning behind variables.",
                  img: imgAlgebra,
                  active: false,
                },
                {
                  title: "AI Logic Lab",
                  subtitle: "Probe how the AI thinks — and where it fails.",
                  img: imgAiLogic,
                  active: false,
                },
              ].map((w) => {
                const Card = (
                  <div className="group relative rounded-3xl overflow-hidden border border-black/5 bg-[var(--color-bg-light)] hover:scale-[1.03] transition-transform shadow-sm">
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
                      {w.active ? (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[var(--color-brand-yellow)] text-[var(--color-brand-blue)] text-xs font-bold uppercase tracking-widest">
                          Active Mission
                        </span>
                      ) : (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 text-[var(--color-brand-blue)] text-xs font-bold uppercase tracking-widest">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-black text-[var(--color-brand-blue)]">
                        {w.title}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--color-brand-blue)]/70 leading-relaxed">
                        {w.subtitle}
                      </p>
                      {w.active && (
                        <div className="mt-5 inline-flex items-center gap-2 font-bold uppercase tracking-wider text-sm text-[var(--color-brand-blue)] group-hover:gap-3 transition-all">
                          Enter World <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                );
                return w.active && w.href ? (
                  <Link key={w.title} to={w.href}>
                    {Card}
                  </Link>
                ) : (
                  <div key={w.title}>{Card}</div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Printables */}
        <section style={{ backgroundColor: BG_MINT }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="label-eyebrow text-lg">Off-Screen</span>
              <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] mt-3">
                No screen? No problem.
              </h2>
              <p className="mt-5 text-[var(--color-brand-blue)]/80 text-base sm:text-lg leading-relaxed">
                Children can still experience the full Glitch Detectives reasoning journey through
                calm, hands-on printable activities designed for families and classrooms who prefer
                low-screen or screen-free learning.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  t: "Glitch Detective Worksheets",
                  d: "Find hidden errors in mathematical equations.",
                  img: imgWorksheets,
                  href: "/printables" as const,
                },
                {
                  t: "Tactile Activities",
                  d: "Hands-on learning through cutting and gluing.",
                  img: imgTactile,
                },
                {
                  t: "Real-World Challenges",
                  d: "Applying math reasoning in real world scenarios.",
                  img: imgRealworld,
                },
              ].map((it) => {
                const inner = (
                  <>
                    <img
                      src={it.img}
                      alt={it.t}
                      width={768}
                      height={768}
                      loading="lazy"
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-5">
                      <h3 className="font-black uppercase text-[var(--color-brand-blue)] text-sm tracking-wide">
                        {it.t}
                      </h3>
                      <p className="mt-2 text-[var(--color-brand-blue)]/70 text-sm leading-relaxed">
                        {it.d}
                      </p>
                    </div>
                  </>
                );
                const className =
                  "block bg-white rounded-3xl overflow-hidden border border-black/5 hover:scale-105 transition-transform shadow-sm";
                return it.href ? (
                  <Link key={it.t} to={it.href} className={className}>
                    {inner}
                  </Link>
                ) : (
                  <div key={it.t} className={className}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* For audiences */}
        <section style={{ backgroundColor: BG_LIGHT }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="label-eyebrow text-lg">For Everyone</span>
              <h2 className="heading-black uppercase text-3xl sm:text-5xl text-[var(--color-brand-blue)] mt-3">
                Built for families and classrooms
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: MINT }}
                >
                  <Users className="w-6 h-6 text-[var(--color-brand-blue)]" />
                </div>
                <h3 className="heading-black uppercase text-2xl text-[var(--color-brand-blue)]">
                  For Parents
                </h3>
                <p className="mt-3 text-[var(--color-brand-blue)]/70 leading-relaxed">
                  Turn homework friction into curiosity. Children explain their thinking, spot AI
                  errors, and build confidence without pressure or timers.
                </p>
                <ul className="mt-5 space-y-2">
                  {["No sign-up required", "Progress saved locally", "Voice or text input"].map(
                    (s) => (
                      <li
                        key={s}
                        className="flex items-center gap-2 text-sm text-[var(--color-brand-blue)]/80"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {s}
                      </li>
                    ),
                  )}
                </ul>
                <Link
                  to="/play"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--color-brand-blue)] text-white text-sm font-bold uppercase tracking-wider hover:scale-105 transition-transform"
                >
                  Try It Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: YELLOW }}
                >
                  <BookOpen className="w-6 h-6 text-[var(--color-brand-blue)]" />
                </div>
                <h3 className="heading-black uppercase text-2xl text-[var(--color-brand-blue)]">
                  For Educators
                </h3>
                <p className="mt-3 text-[var(--color-brand-blue)]/70 leading-relaxed">
                  Get qualitative insights into how students think. The Cognitive Insights report
                  surfaces reasoning patterns, vocabulary, and misconceptions.
                </p>
                <ul className="mt-5 space-y-2">
                  {["Classroom-safe content", "Printable extensions", "AI-literacy aligned"].map(
                    (s) => (
                      <li
                        key={s}
                        className="flex items-center gap-2 text-sm text-[var(--color-brand-blue)]/80"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {s}
                      </li>
                    ),
                  )}
                </ul>
                <Link
                  to="/contact"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--color-brand-yellow)] text-[var(--color-brand-blue)] text-sm font-bold uppercase tracking-wider hover:scale-105 transition-transform"
                >
                  Contact Sales <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
