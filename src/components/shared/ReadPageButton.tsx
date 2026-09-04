/**
 * ReadPageButton — a big, friendly "Read this to me" control for young
 * detectives who cannot read yet.
 *
 * It collects the visible text inside a region (the nearest element marked
 * with `data-readable`, or an element passed via `targetRef`) and reads it
 * aloud, block by block, using the device's built-in speech voice — the same
 * engine `SpeakButton` uses, so only one voice ever plays at a time.
 */
import { useEffect, useRef, useState } from "react";
import { Headphones, Square } from "lucide-react";

type Props = {
  /** Optional explicit region to read. Defaults to the closest `[data-readable]` ancestor. */
  targetRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  label?: string;
};

const BLOCK_SELECTOR = "h1,h2,h3,h4,p,li,button,label,summary,figcaption,blockquote,td,th";

/** Extracts readable, on-screen text from a region in document order. */
function collectText(root: HTMLElement): string {
  const seen = new Set<string>();
  const chunks: string[] = [];

  root.querySelectorAll<HTMLElement>(BLOCK_SELECTOR).forEach((el) => {
    if (el.getAttribute("aria-hidden") === "true") return;
    if (el.closest("[data-no-read]")) return;
    // Skip elements that are not actually visible.
    if (!el.offsetParent && el.tagName !== "BODY") return;
    const text = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
    if (!text || text.length < 2) return;
    // Skip icon-only controls and duplicates from nested blocks.
    if (seen.has(text)) return;
    seen.add(text);
    chunks.push(text);
  });

  return chunks.join(". ");
}

export function ReadPageButton({ targetRef, className = "", label = "READ THIS TO ME" }: Props) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);
    return () => window.speechSynthesis.cancel();
  }, []);

  if (!supported) return <div ref={anchorRef} />;

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const start = () => {
    const region =
      targetRef?.current ??
      anchorRef.current?.closest<HTMLElement>("[data-readable]") ??
      document.querySelector<HTMLElement>("main") ??
      document.body;
    const text = collectText(region);
    if (!text) return;

    window.speechSynthesis.cancel();
    // Split into shorter utterances so long pages stay reliable across browsers.
    const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text];
    let remaining = sentences.length;
    setSpeaking(true);
    sentences.forEach((sentence) => {
      const utterance = new SpeechSynthesisUtterance(sentence.trim());
      utterance.rate = 0.9;
      const done = () => {
        remaining -= 1;
        if (remaining <= 0) setSpeaking(false);
      };
      utterance.onend = done;
      utterance.onerror = done;
      window.speechSynthesis.speak(utterance);
    });
  };

  return (
    <div ref={anchorRef} data-no-read className={className}>
      <button
        type="button"
        onClick={speaking ? stop : start}
        aria-pressed={speaking}
        className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-black tracking-widest transition-colors ${
          speaking
            ? "border-[#1e293b] bg-[#1e293b] text-white"
            : "border-[#bfdbfe] bg-[#eff6ff] text-[#1e3a8a] hover:bg-[#dbeafe]"
        }`}
      >
        {speaking ? <Square size={16} fill="currentColor" /> : <Headphones size={16} />}
        {speaking ? "STOP READING" : label}
      </button>
    </div>
  );
}
