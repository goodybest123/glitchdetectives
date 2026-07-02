/**
 * WaveDivider — decorative SVG wave used between landing-page sections to
 * blend one background colour into the next. Renders a single path from
 * `fromColor` (top) to `toColor` (bottom).
 */
export function WaveDivider({
  fromColor,
  toColor,
  flip = false,
}: {
  fromColor: string;
  toColor: string;
  flip?: boolean;
}) {
  return (
    <div className="relative w-full leading-[0]" style={{ backgroundColor: fromColor }}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={`block w-full h-[60px] sm:h-[80px] ${flip ? "rotate-180" : ""}`}
        aria-hidden
      >
        <path
          d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
