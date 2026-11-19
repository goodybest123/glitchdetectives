/**
 * `/play` — Active Cases dashboard.
 *
 * Cases 01–03 are public. Cases 04–06 are shown as locked.
 */
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Lock } from "lucide-react";
import { lockPlay } from "@/lib/gate.functions";
import { clearPlayToken } from "@/lib/playToken";

/**
 * Small "Lock HQ" control: clears the shared-passcode session so the next
 * visitor to `/play` has to enter the passcode again.
 */
function LockHqButton() {
  const router = useRouter();
  const lock = useServerFn(lockPlay);
  return (
    <button
      type="button"
      onClick={async () => {
        clearPlayToken();
        await lock({});
        await router.navigate({ to: "/unlock" });
      }}
      className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-bold tracking-wider text-neutral-500 transition hover:text-neutral-900"
    >
      🔒 LOCK HQ
    </button>
  );
}

export const Route = createFileRoute("/play/")({
  head: () => ({
    meta: [
      { title: "Fraction Factory: Active Cases" },
      {
        name: "description",
        content:
          "Enter the Glitch Detectives Detective Worlds. A calm, neuro-inclusive learning dashboard for the active fractions case — no timers, no scores.",
      },
    ],
  }),
  component: PlayPage,
});

type LockedCase = {
  number: number;
  title: string;
  topic: string;
};

const LOCKED_CASES: LockedCase[] = [
  {
    number: 4,
    title: "Case 04: The Scale Weigh-In",
    topic: "Comparing Fractions",
  },
  {
    number: 5,
    title: "Case 05: Combining Matches",
    topic: "Adding & Subtracting — Like Denominators",
  },
  {
    number: 6,
    title: "Case 06: The Mismatched Puzzle",
    topic: "Adding & Subtracting — Unlike Denominators",
  },
];

const ACTIVE_CASES: {
  to: "/play/case-01" | "/play/case-02" | "/play/case-03";
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
    subtitle: "When different fractions mean the same amount.",
    topic: "Equivalent Fractions",
  },
];

function PlayPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-10 sm:py-16">
        <header className="mb-8 sm:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              to="/products"
              className="label-eyebrow text-neutral-500 hover:text-neutral-900 transition-colors inline-flex items-center gap-1"
            >
              ← Back to Products
            </Link>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <LockHqButton />
              <Link
                to="/play/report"
                className="rounded-full bg-neutral-900 px-4 py-2 text-xs font-bold tracking-wider text-white transition hover:bg-black inline-flex items-center gap-1.5"
              >
                📋 VIEW DETECTIVE'S REPORT
              </Link>
            </div>
          </div>
          <h1 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 leading-[1.05] sm:leading-[0.95]">
            Fraction Factory:
            <br />
            <span className="text-neutral-700">Active Cases</span>
          </h1>
          <p className="mt-3 sm:mt-5 max-w-xl text-sm sm:text-base text-neutral-500 leading-relaxed">
            Cases 01–03 are open to everyone. More investigations are locked for now. Take your time
            — there are no timers and no scores here.
          </p>
        </header>

        <section
          aria-label="Case files"
          className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Active cases */}
          {ACTIVE_CASES.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="group relative flex flex-col rounded-3xl bg-white p-5 sm:p-7 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] ring-1 ring-neutral-100 transition-all hover:shadow-[0_12px_40px_-12px_rgba(15,23,42,0.25)] min-h-[220px] sm:min-h-[280px] text-left active:scale-[0.99]"
            >
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="inline-flex w-fit items-center rounded-full bg-[#ffde59] px-2.5 py-1 text-[10px] sm:text-[11px] font-bold tracking-wider text-neutral-900">
                  ACTIVE CASE
                </span>
                <span className="inline-flex w-fit items-center rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold tracking-wider text-white">
                  {a.topic}
                </span>
              </div>
              <div className="mt-4 sm:mt-6 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold leading-snug text-neutral-900">
                  {a.title}
                </h2>
                <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-neutral-500">{a.subtitle}</p>
              </div>
              <span className="mt-6 sm:mt-8 inline-flex w-fit items-center gap-2 text-xs sm:text-sm font-bold tracking-wider text-neutral-900 transition-transform group-hover:translate-x-1">
                INVESTIGATE
                <span aria-hidden>→</span>
              </span>
            </Link>
          ))}

          {LOCKED_CASES.map((lockedCase) => (
            <article
              key={lockedCase.number}
              aria-label={`${lockedCase.title}, locked`}
              className="relative flex min-h-[220px] flex-col rounded-3xl bg-neutral-100 p-5 text-left sm:min-h-[280px] sm:p-7"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex w-fit items-center rounded-full bg-neutral-400 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white sm:text-[11px]">
                  LOCKED
                </span>
                <span className="inline-flex w-fit items-center rounded-full bg-neutral-200 px-2.5 py-1 text-[10px] font-bold tracking-wider text-neutral-600 sm:text-[11px]">
                  {lockedCase.topic}
                </span>
              </div>
              <div className="flex flex-1 items-center justify-center py-5">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm sm:h-20 sm:w-20">
                  <Lock className="h-7 w-7 text-neutral-400 sm:h-8 sm:w-8" strokeWidth={1.75} />
                </span>
              </div>
              <h2 className="text-lg font-bold leading-snug text-neutral-700">
                {lockedCase.title}
              </h2>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Not available to the public yet
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
