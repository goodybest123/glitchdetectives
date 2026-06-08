import type { VisualProps } from "./cases";

export function MetalBeamsSVG({ solved, middleSlot }: VisualProps) {
  const maxW = 380;
  const leftW = maxW * (3 / 4);
  const rightW = maxW * (3 / 8);
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[420px] py-4">
        {/* Grid background, fades in when solved */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.25) 1px, transparent 1px)",
            backgroundSize: `${maxW / 8}px 100%`,
            backgroundPosition: "20px 0",
            opacity: solved ? 1 : 0,
            transition: "opacity 700ms ease",
          }}
          aria-hidden
        />
        <div className="relative flex flex-col items-start gap-5 px-5">
          <Beam label="3/4" width={leftW} />
          <Beam label="3/8" width={rightW} />
        </div>
      </div>
      <div className="mt-4 w-full max-w-[460px]">{middleSlot}</div>
    </div>
  );
}

function Beam({ label, width }: { label: string; width: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 rounded-md"
        style={{
          width,
          background:
            "linear-gradient(180deg, #cbd5e1 0%, #94a3b8 45%, #64748b 100%)",
          boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.4)",
        }}
      />
      <span className="text-xl font-black text-neutral-900">{label}</span>
    </div>
  );
}
