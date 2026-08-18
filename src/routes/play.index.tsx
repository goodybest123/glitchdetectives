/**
 * `/play` — Active Cases dashboard.
 *
 * Grid of six playable case files (case-01 .. case-06). `ACTIVE_CASES` is the
 * source of truth for which cases exist; `PENDING_CASES` is a stub array for
 * future "locked / coming soon" cards. A revealed pending card shows a small
 * "coming soon" pill via `revealedId` state.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/play/")({
  head: () => ({
    meta: [
      { title: "Fraction Factory: Active Cases" },
      {
        name: "description",
        content:
          "A calm, neuro-inclusive learning dashboard. Investigate the active fractions case — no timers, no scores.",
      },
    ],
  }),
  component: PlayPage,
});

type PendingCase = {
  id: string;
  title: string;
};

const PENDING_CASES: PendingCase[] = [];

const ACTIVE_CASES: {
  to:
    | "/play/case-01"
    | "/play/case-02"
    | "/play/case-03"
    | "/play/case-04"
    | "/play/case-05"
    | "/play/case-06";
  title: string;
  subtitle: string;
  topic: string;
}[] = [
  {
    to: "/play/case-01",
    title: "Case 01: Parts of a Whole",
    subtitle: "Are the slices fair?",
    topic: "Parts of a Whole — Fair Sharing",
  },
  {
    to: "/play/case-02",
    title: "Case 02: Naming the Pieces",
    subtitle: "Top number, bottom number.",
    topic: "Numerator & Denominator",
  },
  {
    to: "/play/case-03",
    title: "Case 03: The Shape Shifters",
    subtitle: "When more pieces means smaller pieces.",
    topic: "Equivalent Fractions",
  },
  {
    to: "/play/case-04",
    title: "Case 04: The Scale Weigh-In",
    subtitle: "Bigger bottom number means smaller pieces.",
    topic: "Comparing Fractions",
  },
  {
    to: "/play/case-05",
    title: "Case 05: Combining Matches",
    subtitle: "Add the tops — the bottom stays the same.",
    topic: "Adding & Subtracting — Like Denominators",
  },
  {
    to: "/play/case-06",
    title: "Case 06: The Mismatched Puzzle",
    subtitle: "When pieces don't match, slice before you add.",
    topic: "Adding & Subtracting — Unlike Denominators",
  },
];

function PlayPage() {
  const [revealedId, setRevealedId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
        <header className="mb-12 sm:mb-16">
          <div className="flex items-start justify-between gap-4">
            <Link
              to="/"
              hash="worlds"
              className="label-eyebrow text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              ← Back to Explore Detective Worlds
            </Link>
            <Link
              to="/play/report"
              className="rounded-full bg-neutral-900 px-4 py-2 text-xs font-bold tracking-wider text-white transition hover:bg-black"
            >
              📋 VIEW DETECTIVE'S REPORT
            </Link>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 leading-[0.95]">
            Fraction Factory:
            <br />
            <span className="text-neutral-700">Active Cases</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-neutral-500">
            Choose your investigation. Take your time — there are no timers and no scores here.
          </p>
        </header>

        <section
          aria-label="Case files"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Active cases */}
          {ACTIVE_CASES.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="group relative flex flex-col rounded-3xl bg-white p-7 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] ring-1 ring-neutral-100 transition-shadow hover:shadow-[0_12px_40px_-12px_rgba(15,23,42,0.25)] min-h-[280px] text-left"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex w-fit items-center rounded-full bg-[#ffde59] px-3 py-1 text-[11px] font-bold tracking-wider text-neutral-900">
                  ACTIVE CASE
                </span>
                <span className="inline-flex w-fit items-center rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-bold tracking-wider text-white">
                  {a.topic}
                </span>
              </div>
              <div className="mt-6 flex-1">
                <h2 className="text-2xl font-bold leading-snug text-neutral-900">{a.title}</h2>
                <p className="mt-2 text-base text-neutral-500">{a.subtitle}</p>
              </div>
              <span className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-bold tracking-wider text-neutral-900 transition-transform group-hover:translate-x-1">
                INVESTIGATE
                <span aria-hidden>→</span>
              </span>
            </Link>
          ))}

          {/* Pending cases */}
          {PENDING_CASES.map((c) => {
            const isRevealed = revealedId === c.id;
            return (
              <article
                key={c.id}
                className="relative flex flex-col rounded-3xl bg-neutral-100 p-7 min-h-[280px]"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-neutral-400 px-3 py-1 text-[11px] font-bold tracking-wider text-white">
                  CASE PENDING
                </span>

                <div className="flex flex-1 items-center justify-center py-6">
                  <button
                    type="button"
                    onClick={() => setRevealedId(isRevealed ? null : c.id)}
                    aria-label={`${c.title} — locked. Coming soon.`}
                    className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  >
                    <Lock className="h-8 w-8 text-neutral-400" strokeWidth={1.75} />
                    {isRevealed && (
                      <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-semibold tracking-wider text-white">
                        COMING SOON
                      </span>
                    )}
                  </button>
                </div>

                <h2 className="text-lg font-bold leading-snug text-neutral-700">{c.title}</h2>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
