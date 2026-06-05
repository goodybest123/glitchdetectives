import { useEffect } from "react";
import { speakText, stopSpeech } from "./speech";
import { getVoiceSettings } from "./voice-settings";

/**
 * Speak `text` aloud once when the component mounts (and again any time
 * `text` or `deps` change). Respects the user's global mute/auto-speak
 * settings. The same string should be visible on screen so voice and
 * captions stay in sync.
 *
 * On unmount or when deps change, any in-flight TTS is cancelled so ZED
 * doesn't keep talking after the child leaves the section.
 */
export function useNarrate(text: string | undefined | null, deps: unknown[] = []) {
  useEffect(() => {
    if (!text) return;
    const s = getVoiceSettings();
    if (s.muted || !s.autoSpeak) return;
    // Small delay so the voice list is ready and the screen has painted.
    const t = setTimeout(() => speakText(text), 350);
    return () => {
      clearTimeout(t);
      stopSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, ...deps]);
}
