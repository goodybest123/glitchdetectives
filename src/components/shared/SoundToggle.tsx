/**
 * SoundToggle — header speaker icon that mutes/unmutes SFX. Backed by
 * `useSoundMuted`, which persists to localStorage (`gd:sound:v1`).
 */
import { useSoundMuted } from "@/hooks/useSfx";

export function SoundToggle() {
  const [muted, setMuted] = useSoundMuted();
  return (
    <button
      type="button"
      onClick={() => setMuted(!muted)}
      aria-pressed={!muted}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      title={muted ? "Sound off" : "Sound on"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900"
    >
      <span aria-hidden className="text-base">
        {muted ? "🔇" : "🔊"}
      </span>
    </button>
  );
}
