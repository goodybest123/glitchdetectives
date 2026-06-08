import { Link } from "@tanstack/react-router";
import { SpeakButton } from "./SpeakButton";

export type CaseMarks = {
  investigate: number;
  detect: number;
  repair: number;
  explain: number;
};

type Props = {
  studentQuotes: string[];
  turnCount: number;
  marks: CaseMarks;
  caseTitle?: string;
  conceptMastered?: string;
  onTryAnother?: () => void;
  nextCaseLabel?: string;
};

const MAX_PER_STEP = 5;

function remarkFor(total: number) {
  if (total >= 18) return "Outstanding detective work!";
  if (total >= 14) return "Great reasoning, Detective.";
  return "Nice work — you closed the case!";
}

export function DiagnosticReport({
  studentQuotes,
  turnCount,
  marks,
  caseTitle = "Case 01 · Fair Sharing",
  conceptMastered = "Fair Sharing — equal parts of one whole",
  onTryAnother,
  nextCaseLabel = "Case 02 — comparing fair shares.",
}: Props) {
  const total =
    marks.investigate + marks.detect + marks.repair + marks.explain;
  const maxTotal = MAX_PER_STEP * 4;
  const evidenceStatement =
    [...studentQuotes].sort((a, b) => b.length - a.length)[0] ?? "";

  const thanks =
    "Thank you for teaching me, Detective. You helped me learn what fair sharing really means.";

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <section
      id="diagnostic-report"
      className="mt-8 rounded-3xl bg-white p-6 sm:p-10 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-neutral-100 print:shadow-none print:ring-0"
    >
      <header className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-5">
        <div>
          <div className="text-xs font-bold tracking-[0.2em] text-[#10b981]">
            CASE CLOSED
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">
            Diagnostic Report
          </h2>
        </div>
        <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-bold text-[#166534]">
          {caseTitle}
        </span>
      </header>

      {/* Thank-you bubble */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#c8d9f0] bg-[#eaf2ff] p-4">
        <div className="flex-1 text-sm sm:text-base text-neutral-800">
          <span className="font-semibold text-neutral-900">ZED-4: </span>
          {thanks}
        </div>
        <SpeakButton text={`ZED-4 says: ${thanks}`} />
      </div>

      {/* Marks */}
      <div className="mt-6 rounded-2xl border border-neutral-100 bg-[#f8fafc] p-5">
        <div className="flex items-center justify-between border-b border-neutral-200/70 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Marks
          </div>
          <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-sm font-bold text-[#166534]">
            {total} / {maxTotal}
          </span>
        </div>
        <ul className="mt-4 space-y-2.5">
          <StepMark label="Investigate" score={marks.investigate} />
          <StepMark label="Detect" score={marks.detect} />
          <StepMark label="Repair" score={marks.repair} />
          <StepMark label="Explain" score={marks.explain} />
        </ul>
        <div className="mt-4 border-t border-neutral-200/70 pt-3 text-sm font-semibold text-neutral-700">
          {remarkFor(total)}
        </div>
      </div>



      {/* Concept mastered */}
      <div className="mt-6">
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Concept Mastered
        </div>
        <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-neutral-900">
          <CheckDot /> {conceptMastered}
        </div>
      </div>

      {/* Evidence */}
      <div className="mt-6">
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Evidence Collected
        </div>
        <ul className="mt-3 space-y-2 text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <CheckDot /> Spotted the glitch in ZED-4's pizza.
          </li>
          <li className="flex items-start gap-2">
            <CheckDot /> Repaired the slices so all parts were equal.
          </li>
          <li className="flex items-start gap-2">
            <CheckDot /> Explained the idea in their own words.
          </li>
        </ul>
        {evidenceStatement && (
          <blockquote className="mt-4 rounded-xl border-l-4 border-[#10b981] bg-[#f8fafc] px-4 py-3 text-sm italic text-neutral-700">
            "{evidenceStatement}"
          </blockquote>
        )}
      </div>

      {/* Conversation summary */}
      {studentQuotes.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Detective's Words ({turnCount} {turnCount === 1 ? "turn" : "turns"})
          </div>
          <ul className="mt-2 space-y-1 text-sm text-neutral-600">
            {studentQuotes.map((q, i) => (
              <li key={i} className="leading-snug">• {q}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Next */}
      <div className="mt-6 rounded-2xl bg-[#fff4cc] px-5 py-4 text-sm text-[#7c5e10]">
        <span className="font-bold">Next up: </span>
        Case 02 — comparing fair shares.
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-bold tracking-wider text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          PRINT REPORT
        </button>
        <Link
          to="/play"
          className="rounded-full bg-[#1f2937] px-4 py-2 text-xs font-bold tracking-wider text-white transition-colors hover:bg-black"
        >
          BACK TO CASES
        </Link>
      </div>
    </section>
  );
}

function CheckDot() {
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-white">
      <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M5 10l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function StepMark({ label, score }: { label: string; score: number }) {
  const clamped = Math.max(0, Math.min(MAX_PER_STEP, Math.round(score)));
  return (
    <li className="flex items-center justify-between gap-3 text-sm text-neutral-700">
      <span className="font-medium">{label}</span>
      <span className="flex items-center gap-3">
        <span className="flex gap-1" aria-label={`${clamped} out of ${MAX_PER_STEP}`}>
          {Array.from({ length: MAX_PER_STEP }).map((_, i) => (
            <span
              key={i}
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                i < clamped ? "bg-[#10b981]" : "bg-neutral-200"
              }`}
            />
          ))}
        </span>
        <span className="w-10 text-right font-semibold tabular-nums text-neutral-900">
          {clamped}/{MAX_PER_STEP}
        </span>
      </span>
    </li>
  );
}
