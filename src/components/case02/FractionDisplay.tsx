import type { GlitchPart } from "./cases";

type Props = {
  numerator: number;
  denominator: number;
  highlight: "none" | GlitchPart;
  onClickPart?: (part: GlitchPart) => void;
  interactive?: boolean;
  size?: "md" | "lg";
};

export function FractionDisplay({
  numerator,
  denominator,
  highlight,
  onClickPart,
  interactive = false,
  size = "lg",
}: Props) {
  const numClass = numberClass(highlight === "numerator" || highlight === "fraction");
  const denClass = numberClass(highlight === "denominator" || highlight === "fraction");
  const sizeClass = size === "lg" ? "text-7xl sm:text-8xl" : "text-5xl";

  const handle = (part: GlitchPart) => {
    if (!interactive || !onClickPart) return;
    onClickPart(part);
  };

  const cursor = interactive ? "cursor-pointer" : "cursor-default";

  return (
    <div
      className={`flex flex-col items-center font-black leading-none tracking-tight text-neutral-900 ${sizeClass}`}
      aria-label={`Fraction ${numerator} over ${denominator}`}
    >
      <button
        type="button"
        onClick={() => handle("numerator")}
        disabled={!interactive}
        className={`${numClass} ${cursor} rounded-xl px-3 py-1 transition-colors`}
      >
        {numerator}
      </button>
      <div
        className={`my-1 h-1.5 w-20 rounded-full ${
          highlight === "fraction" ? "bg-[#facc15]" : "bg-neutral-900"
        } ${interactive ? "cursor-pointer" : ""}`}
        onClick={() => handle("fraction")}
      />
      <button
        type="button"
        onClick={() => handle("denominator")}
        disabled={!interactive}
        className={`${denClass} ${cursor} rounded-xl px-3 py-1 transition-colors`}
      >
        {denominator}
      </button>
    </div>
  );
}

function numberClass(active: boolean) {
  return active
    ? "bg-[#fef9c3] ring-4 ring-[#fde68a] animate-[pulse-once_700ms_ease-out]"
    : "bg-transparent";
}
