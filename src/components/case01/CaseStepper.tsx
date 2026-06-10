export type Stage = "investigate" | "detect" | "repair" | "explain" | "solved";

const STEPS: { id: Exclude<Stage, "solved">; label: string; desc: string }[] = [
  { id: "investigate", label: "Investigate", desc: "Scan the completed solution." },
  { id: "detect", label: "Detect", desc: "Find where the logic broke." },
  { id: "repair", label: "Repair", desc: "Fix the mistake." },
  { id: "explain", label: "Explain", desc: "Teach ZED-4 why it was wrong." },
];

import { SpeakButton } from "./SpeakButton";

export function CaseStepper({ stage }: { stage: Stage }) {
  const activeIndex =
    stage === "solved" ? STEPS.length : STEPS.findIndex((s) => s.id === stage);
  const current =
    stage === "solved"
      ? { label: "Solved", desc: "Case closed — great work, Detective!" }
      : STEPS[activeIndex] ?? STEPS[0];

  return (
    <>
    <div className="mb-2 flex items-center justify-center gap-2 text-xs text-neutral-500">
      <span><span className="font-bold text-neutral-700">{current.label}:</span> {current.desc}</span>
      <SpeakButton text={`${current.label}. ${current.desc}`} />
    </div>
    <ol className="mb-8 grid grid-cols-4 gap-2 sm:gap-4" aria-label="Case progress">

      {STEPS.map((step, i) => {
        const state =
          i < activeIndex ? "complete" : i === activeIndex ? "active" : "upcoming";
        const circleClass =
          state === "complete"
            ? "bg-[#10b981] text-white border-[#10b981]"
            : state === "active"
            ? "bg-[#ffde59] text-[#1e293b] border-[#1e293b] ring-4 ring-[#fff4cc]"
            : "bg-white text-neutral-400 border-neutral-200";
        const labelClass =
          state === "upcoming"
            ? "text-neutral-400"
            : state === "active"
            ? "text-neutral-900 font-bold"
            : "text-neutral-500";
        return (
          <li key={step.id} className="flex flex-col items-center text-center">
            <div className="flex w-full items-center">
              <div
                className={`hidden sm:block h-0.5 flex-1 ${
                  i === 0 ? "opacity-0" : i <= activeIndex ? "bg-[#10b981]" : "bg-neutral-200"
                }`}
              />
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${circleClass}`}
                aria-current={state === "active" ? "step" : undefined}
              >
                {state === "complete" ? (
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 10l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span>{String(i + 1).padStart(2, "0")}</span>
                )}
              </div>
              <div
                className={`hidden sm:block h-0.5 flex-1 ${
                  i === STEPS.length - 1 ? "opacity-0" : i < activeIndex ? "bg-[#10b981]" : "bg-neutral-200"
                }`}
              />
            </div>
            <div className={`mt-2 text-xs sm:text-sm tracking-wide uppercase ${labelClass}`}>
              {step.label}
            </div>
            <div
              className={`mt-0.5 hidden sm:block text-[11px] leading-tight ${
                state === "upcoming" ? "text-neutral-300" : "text-neutral-500"
              }`}
            >
              {step.desc}
            </div>
          </li>
        );
      })}
    </ol>
    </>
  );
}

