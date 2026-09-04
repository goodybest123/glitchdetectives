/**
 * `/play/report` — The Detective's Report (Reasoning Snapshot).
 *
 * This is NOT a quiz-results page and NOT a diagnosis. Everything shown here
 * is generated deterministically from evidence recorded during the
 * investigations (see `src/lib/reasoning`). Language stays observational
 * ("During these investigations…") and every claim is traceable to a case.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { SoundToggle } from "@/components/shared/SoundToggle";
import { ReadPageButton } from "@/components/shared/ReadPageButton";
import {
  LEVEL_LABELS,
  clearCaseResults,
  generateCumulativeSnapshot,
  useCaseResults,
  type DimensionEvaluation,
  type EvidenceLevel,
  type LevelSnapshot,
} from "@/lib/reasoning";

export const Route = createFileRoute("/play/report")({
  head: () => ({
    meta: [
      { title: "The Detective's Report — Glitch Detectives" },
      {
        name: "description",
        content:
          "A calm, evidence-based reasoning snapshot from your child's investigations — no scores, no grades, no diagnosis.",
      },
      { property: "og:title", content: "The Detective's Report — Glitch Detectives" },
      {
        property: "og:description",
        content:
          "See how your child noticed, checked, represented, revised, and explained during their investigations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const results = useCaseResults();
  const levels = useMemo(() => generateCumulativeSnapshot(results), [results]);
  const anyData = results.length > 0;

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card print:hidden">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/play" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            ← Back to cases
          </Link>
          <h1 className="truncate px-2 text-sm font-bold text-foreground sm:text-base">
            The Detective's Report
          </h1>
          <SoundToggle />
        </div>
      </header>

      <div data-readable className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-4 flex justify-end print:hidden">
          <ReadPageButton />
        </div>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="label-eyebrow text-primary">REASONING SNAPSHOT</p>
          <h2 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">
            What we observed during these investigations
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This report describes what your child did while investigating. It is not a test result,
            a score, or an assessment of ability. Everything below comes from the actions recorded
            in the cases they completed on this device.
          </p>
        </section>

        {!anyData && (
          <section className="mt-6 rounded-3xl border-2 border-dashed border-border bg-card p-6 text-center sm:p-10">
            <p className="text-lg font-black text-foreground">No investigations recorded yet.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Once your child completes a case, their reasoning evidence appears here. Nothing is
              guessed and nothing is filled in for them.
            </p>
            <Link
              to="/play"
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-xs font-black tracking-wider text-primary-foreground"
            >
              OPEN THE DETECTIVE WORLDS
            </Link>
          </section>
        )}

        {anyData &&
          levels
            .filter((level) => level.hasData)
            .map((level) => <LevelSection key={level.levelId} level={level} />)}

        {anyData && (
          <section className="mt-6 rounded-3xl border border-dashed border-border bg-card p-6">
            <p className="label-eyebrow text-muted-foreground">THE JOURNEY AHEAD</p>
            <p className="mt-2 text-sm text-muted-foreground">
              As more levels are investigated, this report grows into a picture of how your child's
              reasoning develops over time — across cases, not within a single one.
            </p>
          </section>
        )}

        <div className="mt-8 flex flex-wrap justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={() => typeof window !== "undefined" && window.print()}
            className="rounded-full border border-border px-5 py-3 text-xs font-black tracking-wider text-foreground"
          >
            PRINT REPORT
          </button>
          {anyData && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Clear all recorded evidence on this device?"))
                  clearCaseResults();
              }}
              className="rounded-full border border-border px-5 py-3 text-xs font-black tracking-wider text-muted-foreground"
            >
              CLEAR EVIDENCE
            </button>
          )}
          <Link
            to="/play"
            className="rounded-full bg-primary px-5 py-3 text-xs font-black tracking-wider text-primary-foreground"
          >
            BACK TO CASES
          </Link>
        </div>
      </div>
    </main>
  );
}

function LevelSection({ level }: { level: LevelSnapshot }) {
  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="label-eyebrow text-muted-foreground">
              LEVEL {level.levelId.replace("level-", "")} · {level.levelTitle.toUpperCase()}
            </p>
            <h3 className="mt-1 text-2xl font-black text-foreground">{level.levelTitle}</h3>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-foreground">
            {level.casesCompleted} of {level.casesInLevel} investigations
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{level.headline}</p>
        {!level.isComplete && (
          <p className="mt-3 rounded-xl bg-secondary p-3 text-xs font-semibold text-muted-foreground">
            This level is still in progress, so the picture below is partial. More investigations
            give a steadier read.
          </p>
        )}
      </div>

      {/* Reasoning profile */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="label-eyebrow text-primary">REASONING PROFILE</p>
        <h3 className="mt-1 text-xl font-black text-foreground">
          Five things detectives do with their thinking
        </h3>
        <div className="mt-5 grid gap-3">
          {level.dimensions.map((dimension) => (
            <DimensionRow key={dimension.dimension} dimension={dimension} />
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Levels describe what has been observed so far, not what your child can or cannot do. A
          single investigation is never enough to call something consistent.
        </p>
      </div>

      {/* Mathematical understanding */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="label-eyebrow text-primary">MATHEMATICAL UNDERSTANDING</p>
        <h3 className="mt-1 text-xl font-black text-foreground">{level.mathematics.concept}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {level.mathematics.statement}
        </p>
        {level.mathematics.canDo.length > 0 && (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {level.mathematics.canDo.map((item) => (
              <li
                key={item}
                className="rounded-xl bg-secondary px-3 py-2 text-sm font-semibold text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Evidence per case */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="label-eyebrow text-primary">EVIDENCE COLLECTED</p>
        <h3 className="mt-1 text-xl font-black text-foreground">Case by case</h3>
        <div className="mt-5 space-y-4">
          {level.cases.map((entry) => (
            <article key={entry.caseId} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-base font-black text-foreground">
                  Case {entry.number} — {entry.title}
                </h4>
                <span className="text-xs text-muted-foreground">{entry.date}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{entry.whatHappened}</p>
              <ul className="mt-3 space-y-1.5">
                {entry.whatTheyDid.map((did) => (
                  <li key={did} className="text-sm text-foreground">
                    • {did}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-semibold text-muted-foreground">{entry.support}</p>
            </article>
          ))}
        </div>
      </div>

      {/* Support and patterns */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="label-eyebrow text-primary">SUPPORT USED</p>
        <p className="mt-2 text-sm text-muted-foreground">{level.supportSummary}</p>
        {level.mayIndicate.length > 0 && (
          <>
            <p className="mt-4 text-sm font-black text-foreground">This may indicate…</p>
            <ul className="mt-2 space-y-1.5">
              {level.mayIndicate.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">
                  • {item}
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Using clues is a strategy, not a weakness. These notes describe patterns, not conclusions.
        </p>
      </div>

      {/* Next step */}
      <div className="rounded-3xl border-2 border-primary bg-card p-6 shadow-sm sm:p-8">
        <p className="label-eyebrow text-primary">ONE NEXT STEP</p>
        <h3 className="mt-1 text-xl font-black text-foreground">{level.nextStep.focus}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{level.nextStep.text}</p>
        <p className="mt-3 rounded-xl bg-secondary p-3 text-sm font-bold text-foreground">
          Try asking: {level.nextStep.ask}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{level.nextStep.avoid}</p>
      </div>

      {/* Try at home */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="label-eyebrow text-primary">TRY THIS AT HOME</p>
        <h3 className="mt-1 text-xl font-black text-foreground">{level.tryAtHome.title}</h3>
        <ol className="mt-3 space-y-2">
          {level.tryAtHome.steps.map((step, index) => (
            <li key={step} className="text-sm text-foreground">
              <span className="font-black">{index + 1}.</span> {step}
            </li>
          ))}
        </ol>
        <p className="mt-3 rounded-xl bg-secondary p-3 text-sm font-bold text-foreground">
          Ask: {level.tryAtHome.ask}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{level.tryAtHome.watchFor}</p>
      </div>
    </section>
  );
}

const LEVEL_STYLES: Record<EvidenceLevel, string> = {
  insufficient: "bg-muted text-muted-foreground",
  emerging: "bg-secondary text-foreground",
  developing: "bg-energy/20 text-foreground",
  consistent: "bg-success/20 text-foreground",
};

function DimensionRow({ dimension }: { dimension: DimensionEvaluation }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-black tracking-wider text-foreground">{dimension.label}</p>
          <p className="text-xs text-muted-foreground">{dimension.meaning}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${LEVEL_STYLES[dimension.level]}`}
        >
          {LEVEL_LABELS[dimension.level]}
        </span>
      </div>
      {dimension.evidence.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {dimension.evidence.map((line) => (
            <li key={line} className="text-xs text-muted-foreground">
              • {line}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          Not enough evidence collected yet for this one.
        </p>
      )}
      <p className="mt-2 text-[11px] text-muted-foreground">
        Seen in {dimension.supportingCases} of {dimension.totalCases} investigation
        {dimension.totalCases === 1 ? "" : "s"}.
      </p>
    </div>
  );
}
