export function WaveDivider({
  fromColor,
  toColor,
  flip = false,
  accentColor = "#FFDE59",
}: {
  fromColor: string;
  toColor: string;
  flip?: boolean;
  accentColor?: string;
}) {
  return (
    <div className="relative w-full leading-[0]" style={{ backgroundColor: fromColor }}>
      <svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className={`block w-full h-[100px] sm:h-[140px] ${flip ? "rotate-180" : ""}`}
        aria-hidden
      >
        {/* Filled wave for the next section */}
        <path
          d="M0,70 C240,140 480,10 720,60 C960,110 1200,20 1440,80 L1440,140 L0,140 Z"
          fill={toColor}
        />
        {/* Bold accent stroke tracing the wave crest for visibility */}
        <path
          d="M0,70 C240,140 480,10 720,60 C960,110 1200,20 1440,80"
          fill="none"
          stroke={accentColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
