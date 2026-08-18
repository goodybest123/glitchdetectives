/**
 * Tiny Web Audio synth for UI sound effects. Five named tones — tick, ding,
 * snap, chime, error — synthesised on the fly (no audio files to ship).
 *
 * Exports:
 *  - `useSfx()` returns a `play(name)` function. Muted state is respected.
 *  - `useSoundMuted()` returns `[muted, setMuted]` backed by localStorage
 *    (`gd:sound:v1`) and synced across tabs via the `storage` event.
 *
 * All calls are wrapped in try/catch and no-op if the AudioContext is
 * unavailable (SSR, old Safari, autoplay-blocked contexts).
 */
import { useCallback, useEffect, useState } from "react";

type SfxName = "tick" | "ding" | "snap" | "chime" | "error";

const STORAGE_KEY = "gd:sound:v1";

let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.08,
  delay = 0,
) {
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume().catch(() => {});
  const now = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(now);
  osc.stop(now + duration + 0.05);
}

const PLAYERS: Record<SfxName, () => void> = {
  tick: () => tone(880, 0.06, "triangle", 0.05),
  ding: () => {
    tone(1320, 0.18, "sine", 0.07);
    tone(1760, 0.18, "sine", 0.04, 0.04);
  },
  snap: () => {
    tone(220, 0.04, "square", 0.06);
    tone(660, 0.12, "triangle", 0.06, 0.03);
  },
  chime: () => {
    tone(523.25, 0.25, "sine", 0.08);
    tone(659.25, 0.25, "sine", 0.07, 0.08);
    tone(783.99, 0.35, "sine", 0.07, 0.16);
    tone(1046.5, 0.5, "sine", 0.06, 0.26);
  },
  error: () => tone(220, 0.18, "sawtooth", 0.05),
};

function readMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "muted";
  } catch {
    return false;
  }
}

export function useSfx() {
  const play = useCallback((name: SfxName) => {
    if (readMuted()) return;
    try {
      PLAYERS[name]();
    } catch {
      /* ignore */
    }
  }, []);
  return play;
}

export function useSoundMuted(): [boolean, (next: boolean) => void] {
  const [muted, setMutedState] = useState<boolean>(() => readMuted());
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setMutedState(readMuted());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const setMuted = useCallback((next: boolean) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "muted" : "on");
    } catch {
      /* ignore */
    }
    setMutedState(next);
  }, []);
  return [muted, setMuted];
}
