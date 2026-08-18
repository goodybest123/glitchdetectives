/**
 * VerdictButtons — the first decision in every case: "Is there a glitch?
 * Yes / No". Wrong picks shake (via `shakeKey`) and increment
 * `wrongCount`; the correct pick advances the stage to Detect.
 */
import { useEffect, useState } from "react";
import { SpeakButton } from "@/components/case01/SpeakButton";

type Props = {
  onGlitch: () => void;
  onNoGlitch: () => void;
  shakeKey?: number;
  wrongCount?: number;
  disabled?: boolean;
};

const PROMPT = "Your verdict, Detective. Is ZED-4's logic glitched, or is it correct?";

/**
 * Two big kid-friendly buttons. The child gives a verdict BEFORE clicking the
 * glitch spot on the visual. Tapping "No glitch" is wrong — buttons shake.
 * Tapping "There IS a glitch" calls onGlitch (the route then unlocks the
 * visual so the child can click exactly where the glitch is).
 */
export function VerdictButtons({
  onGlitch,
  onNoGlitch,
  shakeKey = 0,
  wrongCount = 0,
  disabled,
}: Props) {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (shakeKey === 0) return;
    setShake(true);
    const t = setTimeout(() => setShake(false), 600);
    return () => clearTimeout(t);
  }, [shakeKey]);

  return (
    <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-5">
      <div className="mb-3 flex items-start gap-2">
        <p className="flex-1 text-sm font-semibold text-neutral-700">{PROMPT}</p>
        <SpeakButton text={PROMPT} />
      </div>

      <div
        className={`flex flex-col gap-3 sm:flex-row sm:justify-center ${
          shake ? "animate-[verdict-shake_500ms_ease-in-out]" : ""
        }`}
      >
        <style>{`
          @keyframes verdict-shake {
            0%, 100% { transform: translateX(0); }
            15% { transform: translateX(-8px); }
            30% { transform: translateX(8px); }
            45% { transform: translateX(-6px); }
            60% { transform: translateX(6px); }
            75% { transform: translateX(-3px); }
            90% { transform: translateX(3px); }
          }
        `}</style>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onGlitch}
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#dc2626] px-6 py-3 text-sm font-bold tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#b91c1c] disabled:bg-neutral-300 disabled:hover:translate-y-0"
          >
            <span aria-hidden>⚠️</span>
            THERE IS A GLITCH
          </button>
          <SpeakButton text="There is a glitch" />
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onNoGlitch}
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#10b981] px-6 py-3 text-sm font-bold tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#059669] disabled:bg-neutral-300 disabled:hover:translate-y-0"
          >
            <span aria-hidden>✅</span>
            NO GLITCH
          </button>
          <SpeakButton text="No glitch" />
        </div>
      </div>

      {wrongCount > 0 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <p className="text-center text-xs font-medium text-[#b91c1c]">
            Look again, Detective — something doesn't add up.
          </p>
          <SpeakButton text="Look again, Detective — something doesn't add up." />
        </div>
      )}
    </div>
  );
}
