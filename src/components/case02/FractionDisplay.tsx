import { useState } from "react";
import type { GlitchPart } from "./cases";

type Props = {
  numerator: number;
  denominator: number;
  highlight: "none" | GlitchPart;
  onClickPart?: (part: GlitchPart) => void;
  interactive?: boolean;
  size?: "md" | "lg";
  /** When provided in interactive mode, only this part will fire onClickPart;
   *  other parts shake to signal "try again". */
  glitchTarget?: GlitchPart;
};

export function FractionDisplay({
  numerator,
  denominator,
  highlight,
  onClickPart,
  interactive = false,
  size = "lg",
  glitchTarget,
}: Props) {
  const [wrongPart, setWrongPart] = useState<GlitchPart | null>(null);
  const [wrongKey, setWrongKey] = useState(0);

  const sizeClass = size === "lg" ? "text-7xl sm:text-8xl" : "text-5xl";

  const handle = (part: GlitchPart) => {
    if (!interactive) return;
    if (glitchTarget && part !== glitchTarget) {
      setWrongPart(part);
      setWrongKey((k) => k + 1);
      return;
    }
    onClickPart?.(part);
  };

  // Style classes for each part
  const partClass = (part: GlitchPart) => {
    const isWrongShake = wrongPart === part;
    const shake = isWrongShake ? "animate-[glitch-shake_320ms_ease-in-out]" : "";

    if (interactive) {
      // Equal tappable affordance on every part during Detect
      return `cursor-pointer rounded-xl px-3 py-1 transition-colors bg-[#fffbeb] ring-2 ring-[#fde68a] hover:bg-[#fef9c3] animate-[tappable-pulse_1.6s_ease-in-out_infinite] ${shake}`;
    }
    // Non-interactive: show confirming highlight on the correct part
    const isHighlighted = highlight === part || highlight === "fraction";
    return `cursor-default rounded-xl px-3 py-1 transition-colors ${
      isHighlighted
        ? "bg-[#fef9c3] ring-4 ring-[#fde68a] animate-[pulse-once_700ms_ease-out]"
        : "bg-transparent"
    } ${shake}`;
  };

  const barClass = () => {
    if (interactive && glitchTarget === "fraction") {
      const shake = wrongPart === "fraction" ? "animate-[glitch-shake_320ms_ease-in-out]" : "";
      return `my-1 h-2 w-24 rounded-full bg-[#facc15] cursor-pointer ${shake}`;
    }
    if (interactive) {
      // Bar not the target — clicking it counts as wrong
      const shake = wrongPart === "fraction" ? "animate-[glitch-shake_320ms_ease-in-out]" : "";
      return `my-1 h-1.5 w-20 rounded-full bg-neutral-900 cursor-pointer ${shake}`;
    }
    return `my-1 h-1.5 w-20 rounded-full ${
      highlight === "fraction" ? "bg-[#facc15]" : "bg-neutral-900"
    }`;
  };

  return (
    <div
      key={wrongKey /* re-mount of shake animation when wrongPart re-triggered */}
      className={`flex flex-col items-center font-black leading-none tracking-tight text-neutral-900 ${sizeClass}`}
      aria-label={`Fraction ${numerator} over ${denominator}`}
    >
      <button
        type="button"
        onClick={() => handle("numerator")}
        disabled={!interactive}
        className={partClass("numerator")}
      >
        {numerator}
      </button>
      <button
        type="button"
        onClick={() => handle("fraction")}
        disabled={!interactive}
        aria-label="Fraction bar"
        className={barClass()}
      />
      <button
        type="button"
        onClick={() => handle("denominator")}
        disabled={!interactive}
        className={partClass("denominator")}
      >
        {denominator}
      </button>
    </div>
  );
}
