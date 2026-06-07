import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/play")({
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

const PENDING_CASES: PendingCase[] = [
  { id: "02", title: "Case 02: Naming the Pieces" },
  { id: "03", title: "Case 03: The Shape Shifters" },
  { id: "04", title: "Case 04: The Scale Weigh-In" },
  { id: "05", title: "Case 05: Combining Matches" },
  { id: "06", title: "Case 06: The Mismatched Puzzle" },
];

function PlayPage() {
  const [revealedId, setRevealedId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
        <header className="mb-12 sm:mb-16">
          <Link
            to="/"
            className="label-eyebrow text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            ← Back to Explore Detective Worlds
          </Link>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 leading-[0.95]">
            Fraction Factory:
            <br />
            <span className="text-neutral-700">Active Cases</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-neutral-500">
            Choose your investigation. Take your time — there are no timers
            and no scores here.
          </p>
        </header>

        <section
          aria-label="Case files"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Active case */}
          <article className="group relative flex flex-col rounded-3xl bg-white p-7 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] ring-1 ring-neutral-100 transition-shadow hover:shadow-[0_12px_40px_-12px_rgba(15,23,42,0.25)] min-h-[280px]">
            <span className="inline-flex w-fit items-center rounded-full bg-[#ffde59] px-3 py-1 text-[11px] font-bold tracking-wider text-neutral-900">
              ACTIVE CASE
            </span>
            <div className="mt-6 flex-1">
              <h2 className="text-2xl font-bold leading-snug text-neutral-900">
                Case 01: Parts of a Whole
              </h2>
              <p className="mt-2 text-base text-neutral-500">
                Are the slices fair?
              </p>
            </div>
            <button
              type="button"
              className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-bold tracking-wider text-neutral-900 transition-transform hover:translate-x-1"
            >
              INVESTIGATE
              <span aria-hidden>→</span>
            </button>
          </article>

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
                    onClick={() =>
                      setRevealedId(isRevealed ? null : c.id)
                    }
                    aria-label={`${c.title} — locked. Coming soon.`}
                    className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  >
                    <Lock
                      className="h-8 w-8 text-neutral-400"
                      strokeWidth={1.75}
                    />
                    {isRevealed && (
                      <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-semibold tracking-wider text-white">
                        COMING SOON
                      </span>
                    )}
                  </button>
                </div>

                <h2 className="text-lg font-bold leading-snug text-neutral-700">
                  {c.title}
                </h2>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
