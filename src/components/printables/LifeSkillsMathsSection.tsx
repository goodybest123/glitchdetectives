import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import lifeSkillsCover from "@/assets/landing/print-realworld.jpg";

const BLUE = "var(--color-brand-blue)";
const MUTED = "color-mix(in oklab, var(--color-brand-blue) 70%, transparent)";

export function LifeSkillsMathsSection() {
  const weeklyThemes = [
    { week: "Week 1", title: "Budgeting", detail: "Money sense" },
    { week: "Week 2", title: "Cooking", detail: "Measurements" },
    { week: "Week 3", title: "Time planning", detail: "Daily routines" },
    { week: "Week 4", title: "Shopping", detail: "Comparisons and choices" },
  ];

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="label-eyebrow" style={{ color: BLUE }}>
            Everyday learning
          </span>
          <h2 className="heading-black uppercase text-3xl sm:text-4xl mt-3" style={{ color: BLUE }}>
            Life Skills Maths
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: MUTED }}>
            This is Life Skills Maths, a printable pack designed to help children learn maths
            through real-life experiences.
          </p>
          <p className="mt-5 text-sm font-bold uppercase tracking-wide" style={{ color: BLUE }}>
            Real-life maths, week by week
          </p>
        </div>

        <div className="mx-auto mb-10 grid max-w-4xl overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm md:grid-cols-2">
          <img
            src={lifeSkillsCover}
            alt="Child measuring ingredients while cooking in a home kitchen"
            className="h-full min-h-64 w-full object-cover"
            loading="lazy"
          />
          <div className="flex flex-col items-start justify-center p-6 sm:p-8">
            <span className="label-eyebrow" style={{ color: BLUE }}>
              Printable pack · Ages 5–8
            </span>
            <h3
              className="mt-3 text-2xl font-black uppercase tracking-tight"
              style={{ color: BLUE }}
            >
              Life Skills Maths
            </h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>
              Four weeks of practical maths activities for budgeting, cooking, time planning, and
              shopping.
            </p>
            <Link
              to="/printables/life-skills-maths"
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: BLUE }}
            >
              <ArrowRight className="h-4 w-4" />
              View pack
            </Link>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {weeklyThemes.map((theme) => (
            <li
              key={theme.week}
              className="rounded-2xl border border-black/5 p-5"
              style={{ background: "var(--color-bg-mint)" }}
            >
              <p className="label-eyebrow" style={{ color: BLUE }}>
                {theme.week}
              </p>
              <h3 className="mt-2 text-lg font-black" style={{ color: BLUE }}>
                {theme.title}
              </h3>
              <p className="mt-1 text-sm" style={{ color: MUTED }}>
                {theme.detail}
              </p>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-base leading-relaxed" style={{ color: MUTED }}>
            Maths isn’t just about numbers on a worksheet. It’s about helping children develop the
            critical thinking skills to recognise when and how maths is used in everyday life.
          </p>
          <p className="mt-5 text-base font-bold leading-relaxed" style={{ color: BLUE }}>
            Short, flexible activities. No pressure. No overwhelm. Just maths that makes sense.
          </p>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: MUTED }}>
            Especially helpful for homeschoolers and neurodivergent learners who benefit from calm,
            meaningful, and practical learning.
          </p>
          <span
            className="mt-6 inline-flex rounded-full px-4 py-2 text-sm font-bold"
            style={{ background: "var(--color-bg-mint)", color: BLUE }}
          >
            For children aged 5–8
          </span>
        </div>
      </div>
    </section>
  );
}
