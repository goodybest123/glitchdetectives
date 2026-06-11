import { SpeakButton } from "@/components/case01/SpeakButton";
import { SUB_CASE_ORDER, SUB_CASES, type SubCaseId } from "./cases";

type Props = {
  solved: Record<SubCaseId, boolean>;
  onPick: (id: SubCaseId) => void;
};

export function CasePicker({ solved, onPick }: Props) {
  return (
    <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-neutral-100">
      <div className="mb-6 text-center">
        <div className="text-xs font-bold tracking-[0.2em] text-[#10b981]">
          CASE FILE 02
        </div>
        <div className="mt-1 text-sm font-semibold text-neutral-700">
          Topic: Numerator & Denominator
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          Choose a case to investigate
        </h2>
        <div className="mt-2 flex items-center justify-center gap-2"><p className="text-sm text-neutral-500">Three number puzzles. Solve them in any order.</p><SpeakButton text={`Choose a case to investigate. Three number puzzles. Solve them in any order.`} /></div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SUB_CASE_ORDER.map((id, i) => {
          const c = SUB_CASES[id];
          const isSolved = solved[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onPick(id)}
              className="group relative flex flex-col items-start gap-3 rounded-2xl border-2 border-neutral-100 bg-[#fafbfc] p-5 text-left transition-all hover:-translate-y-1 hover:border-[#1e293b] hover:bg-white hover:shadow-lg"
            >
              {isSolved && (
                <span
                  aria-label="Solved"
                  className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#10b981] text-white shadow"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 10l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              <div className="text-4xl" aria-hidden>
                {c.emoji}
              </div>
              <div className="text-[11px] font-bold tracking-wider text-neutral-400">
                CASE 02.{String(i + 1).padStart(2, "0")}
              </div>
              <div className="text-lg font-bold text-neutral-900">{c.title}</div>
              <div className="text-sm text-neutral-500">{c.subtitle}</div>
              <span className="mt-2 text-xs font-bold tracking-wider text-[#1e293b] opacity-0 transition-opacity group-hover:opacity-100">
                {isSolved ? "REPLAY →" : "OPEN CASE →"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
