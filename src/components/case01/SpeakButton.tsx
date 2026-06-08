import { useEffect, useRef, useState } from "react";
import { Volume2, Square } from "lucide-react";

type SpeakButtonProps = {
  text: string;
  className?: string;
  size?: "sm" | "md";
};

function pickVoice(voices: SpeechSynthesisVoice[]) {
  if (!voices.length) return null;
  const en = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  const pool = en.length ? en : voices;
  const female = pool.find((v) => /female|samantha|victoria|karen|moira|tessa/i.test(v.name));
  return female ?? pool[0];
}

export function SpeakButton({ text, className = "", size = "sm" }: SpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    setSupported(true);
    // Warm up voices list
    const load = () => window.speechSynthesis.getVoices();
    load();
    window.speechSynthesis.addEventListener?.("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", load);
      if (utterRef.current) window.speechSynthesis.cancel();
    };
  }, []);

  if (!supported) return null;

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const speak = () => {
    if (!text?.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickVoice(window.speechSynthesis.getVoices());
    if (voice) u.voice = voice;
    u.rate = 0.95;
    u.pitch = 1;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utterRef.current = u;
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const dim = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const icon = size === "sm" ? 14 : 18;

  return (
    <button
      type="button"
      onClick={speaking ? stop : speak}
      aria-label={speaking ? "Stop reading" : "Read aloud"}
      aria-pressed={speaking}
      className={`inline-flex ${dim} items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all hover:bg-neutral-50 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] ${
        speaking ? "animate-pulse border-[#60a5fa] text-[#1e293b]" : ""
      } ${className}`}
    >
      {speaking ? <Square size={icon} fill="currentColor" /> : <Volume2 size={icon} />}
    </button>
  );
}
