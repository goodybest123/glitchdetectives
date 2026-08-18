import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";

const BLUE = "var(--color-brand-blue)";
const MINT = "var(--color-bg-mint)";

export function PrintablesHero() {
  return (
    <section style={{ background: MINT }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-20 lg:pt-12 lg:pb-28">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-8 hover:opacity-80"
          style={{ color: BLUE }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="text-center">
          <span className="label-eyebrow inline-flex items-center gap-2" style={{ color: BLUE }}>
            <BookOpen className="w-4 h-4" /> Printables Library
          </span>
          <h1
            className="heading-black uppercase text-4xl sm:text-5xl lg:text-6xl mt-5"
            style={{ color: BLUE }}
          >
            The Glitch Detective
            <br /> Printables Library
          </h1>
          <p
            className="mt-6 mx-auto max-w-2xl text-base sm:text-lg leading-relaxed"
            style={{ color: "color-mix(in oklab, var(--color-brand-blue) 75%, transparent)" }}
          >
            Calm, hands-on, off-screen reasoning activities. Print, sit down with a pencil, and
            investigate the maths together — no screens, no rush, no red pens.
          </p>
        </div>
      </div>
    </section>
  );
}
