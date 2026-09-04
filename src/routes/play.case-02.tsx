/**
 * `/play/case-02` — LEVEL 02: Naming the Pieces.
 *
 * Four complete investigations built on the shared case engine
 * (`src/components/investigation`), which is the Level 01 architecture
 * extracted so every level behaves identically:
 * CASE BRIEF → INVESTIGATE → DETECT → REPAIR → EXPLAIN → CASE CLOSED.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { InvestigationCase } from "@/components/investigation/InvestigationCase";
import { LevelCasePicker } from "@/components/investigation/LevelCasePicker";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { SoundToggle } from "@/components/shared/SoundToggle";
import { ReadPageButton } from "@/components/shared/ReadPageButton";
import { useCaseProgress } from "@/hooks/useProgress";
import { LEVEL_02_CASES, LEVEL_02_ORDER, type Level02CaseId } from "@/components/level02/cases";

export const Route = createFileRoute("/play/case-02")({
  head: () => ({
    meta: [
      { title: "Level 02: Naming the Pieces — Glitch Detectives" },
      {
        name: "description",
        content:
          "Four hands-on investigations where a young detective works out what the top and bottom numbers of a fraction really count.",
      },
      { property: "og:title", content: "Level 02: Naming the Pieces — Glitch Detectives" },
      {
        property: "og:description",
        content:
          "Investigate ZED-4's mixed-up fractions, repair the models, and explain what each number does.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LevelTwoPage,
});

function LevelTwoPage() {
  const [activeCase, setActiveCase] = useState<Level02CaseId | null>(null);
  const { solved, markSolved } = useCaseProgress("case-02", LEVEL_02_ORDER);
  const levelComplete = LEVEL_02_ORDER.every((id) => solved[id]);

  if (!activeCase) {
    return (
      <PageShell title="Level 02: Naming the Pieces">
        <div className="space-y-5">
          {levelComplete && <LevelClosed />}
          <LevelCasePicker
            levelNumber="02"
            levelTitle="Naming the Pieces"
            concept="What the top and bottom numbers really count"
            cases={LEVEL_02_ORDER.map((id) => LEVEL_02_CASES[id])}
            solved={solved}
            idFor={(definition) =>
              LEVEL_02_ORDER.find((id) => LEVEL_02_CASES[id].caseId === definition.caseId) ?? ""
            }
            onPick={(id) => setActiveCase(id as Level02CaseId)}
          />
        </div>
      </PageShell>
    );
  }

  const definition = LEVEL_02_CASES[activeCase];
  return (
    <PageShell title={`Level 02 · ${definition.title}`}>
      <InvestigationCase
        key={activeCase}
        definition={definition}
        onSolved={() => markSolved(activeCase)}
        onBackToPicker={() => setActiveCase(null)}
      />
    </PageShell>
  );
}

/** Shown once all four investigations in the level are closed. */
function LevelClosed() {
  const idea = "A fraction tells us how many equal parts we are considering out of the equal parts that make up the whole.";
  return (
    <section className="rounded-3xl border-2 border-success bg-card p-6 shadow-sm">
      <p className="label-eyebrow text-muted-foreground">LEVEL CLOSED</p>
      <div className="mt-1 flex items-start justify-between gap-3">
        <h2 className="text-2xl font-black text-foreground sm:text-3xl">
          Your detective work uncovered something important.
        </h2>
        <SpeakButton text={`Level closed. Your detective work uncovered something important. ${idea}`} size="md" />
      </div>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{idea}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to="/play/report"
          className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-primary-foreground"
        >
          VIEW DETECTIVE'S REPORT
        </Link>
        <Link
          to="/play/case-03"
          className="rounded-xl border-2 border-border px-5 py-3 text-sm font-black text-foreground"
        >
          CONTINUE TO NEXT LEVEL
        </Link>
      </div>
    </section>
  );
}

function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3 lg:px-10">
          <Link
            to="/play"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
          >
            ← Back
          </Link>
          <h1 className="truncate px-2 text-sm font-bold tracking-tight text-foreground sm:text-base">
            {title}
          </h1>
          <div className="flex w-[80px] items-center justify-end sm:w-[120px]">
            <SoundToggle />
          </div>
        </div>
      </header>
      <div data-readable className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-5 lg:px-10">
        <div className="mb-3 flex justify-end">
          <ReadPageButton />
        </div>
        {children}
      </div>
    </main>
  );
}
