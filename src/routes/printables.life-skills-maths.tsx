import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";
import lifeSkillsCover from "@/assets/landing/print-realworld.jpg";

const BLUE = "var(--color-brand-blue)";
const MINT = "var(--color-bg-mint)";
const MUTED = "color-mix(in oklab, var(--color-brand-blue) 70%, transparent)";

const WEEKLY_THEMES = [
  { week: "Week 1", title: "Budgeting", detail: "Money sense" },
  { week: "Week 2", title: "Cooking", detail: "Measurements" },
  { week: "Week 3", title: "Time planning", detail: "Daily routines" },
  { week: "Week 4", title: "Shopping", detail: "Comparisons and choices" },
];

export const Route = createFileRoute("/printables/life-skills-maths")({
  head: () => ({
    meta: [
      { title: "Life Skills Maths — Glitch Detectives" },
      {
        name: "description",
        content:
          "A printable pack for ages 5–8 that helps children learn maths through real-life experiences.",
      },
    ],
  }),
  component: LifeSkillsMathsPage,
});

function LifeSkillsMathsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section style={{ background: MINT }}>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <Link
            to="/printables"
            className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-semibold hover:opacity-80"
            style={{ color: BLUE }}
          >
            <ArrowLeft className="h-4 w-4" /> Back to printables
          </Link>

          <div className="grid overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm md:grid-cols-2">
            <img
              src={lifeSkillsCover}
              alt="Child measuring ingredients while cooking in a home kitchen"
              className="h-full min-h-72 w-full object-cover"
            />
            <div className="flex flex-col items-start justify-center p-6 sm:p-10">
              <span className="label-eyebrow" style={{ color: BLUE }}>
                Printable pack · Ages 5–8
              </span>
              <h1
                className="heading-black mt-3 text-3xl uppercase sm:text-4xl"
                style={{ color: BLUE }}
              >
                Life Skills Maths
              </h1>
              <p className="mt-4 text-base leading-relaxed" style={{ color: MUTED }}>
                A printable pack designed to help children learn maths through real-life
                experiences.
              </p>
              <a
                href="https://selar.com/lifeskillsmaths"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: BLUE }}
              >
                <Download className="h-4 w-4" />
                Download the printable
              </a>
            </div>
          </div>

          <section className="mt-12">
            <h2
              className="text-center text-xl font-black uppercase tracking-wide"
              style={{ color: BLUE }}
            >
              Real-life maths, week by week
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {WEEKLY_THEMES.map((theme) => (
                <li key={theme.week} className="rounded-2xl border border-black/5 bg-white p-5">
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
          </section>

          <div className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-base leading-relaxed" style={{ color: MUTED }}>
              Maths isn’t just about numbers on a worksheet. It’s about helping children develop the
              critical thinking skills to recognise when and how maths is used in everyday life.
            </p>
            <p className="mt-5 text-lg font-bold leading-relaxed" style={{ color: BLUE }}>
              Short, flexible activities. No pressure. No overwhelm. Just maths that makes sense.
            </p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: MUTED }}>
              Especially helpful for homeschoolers and neurodivergent learners who benefit from
              calm, meaningful, and practical learning.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
