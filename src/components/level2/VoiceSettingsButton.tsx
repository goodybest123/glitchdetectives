import { useEffect, useRef, useState } from "react";
import { Settings2, Volume2, VolumeX } from "lucide-react";
import { useVoiceSettings } from "@/lib/voice-settings";
import { speakText } from "@/lib/speech";

/**
 * Voice settings popover — global, persisted to localStorage.
 * Controls: mute, auto-speak, rate, volume, pitch + a "Test voice" button.
 */
export function VoiceSettingsButton() {
  const [s, set] = useVoiceSettings();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative flex items-center gap-1">
      <button
        type="button"
        onClick={() => set({ muted: !s.muted })}
        aria-label={s.muted ? "Unmute voice" : "Mute voice"}
        className="w-9 h-9 inline-flex items-center justify-center rounded-full text-cyan-100 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        {s.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Voice settings"
        aria-expanded={open}
        className="w-9 h-9 inline-flex items-center justify-center rounded-full text-cyan-100 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        <Settings2 className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 z-50 w-72 rounded-2xl border p-4 space-y-4 shadow-xl"
          style={{
            background: "rgba(8,22,48,0.96)",
            borderColor: "color-mix(in oklab, #5fd0ff 30%, transparent)",
            color: "#e6faff",
          }}
        >
          <p className="label-eyebrow text-cyan-300/80">Voice settings</p>

          <Row
            label="Auto-speak"
            hint="Read ZED-4's lines out loud automatically."
          >
            <Toggle
              checked={s.autoSpeak}
              onChange={(v) => set({ autoSpeak: v })}
              disabled={s.muted}
            />
          </Row>

          <Slider
            label="Speed"
            value={s.rate}
            min={0.5}
            max={1.5}
            step={0.05}
            onChange={(v) => set({ rate: v })}
            format={(v) => `${v.toFixed(2)}×`}
          />
          <Slider
            label="Volume"
            value={s.volume}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => set({ volume: v })}
            format={(v) => `${Math.round(v * 100)}%`}
          />
          <Slider
            label="Pitch"
            value={s.pitch}
            min={0.5}
            max={2}
            step={0.05}
            onChange={(v) => set({ pitch: v })}
            format={(v) => v.toFixed(2)}
          />

          <button
            type="button"
            onClick={() =>
              speakText("Hi! I'm ZED-4. Can you hear me okay?", undefined, { force: true })
            }
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, #5fd0ff, #2a8ec9)",
              color: "#04162e",
            }}
          >
            <Volume2 className="w-4 h-4" /> Test voice
          </button>
        </div>
      )}
    </div>
  );
}

function Row({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        {hint && <p className="text-xs text-cyan-200/60 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({
  checked, onChange, disabled,
}: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition disabled:opacity-40"
      style={{
        background: checked
          ? "linear-gradient(135deg, #5fd0ff, #2a8ec9)"
          : "rgba(255,255,255,0.15)",
      }}
    >
      <span
        className="inline-block h-5 w-5 rounded-full bg-white shadow transition"
        style={{ transform: `translateX(${checked ? 22 : 2}px)` }}
      />
    </button>
  );
}

function Slider({
  label, value, min, max, step, onChange, format,
}: {
  label: string;
  value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs font-mono text-cyan-200/80">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-cyan-300"
      />
    </div>
  );
}
