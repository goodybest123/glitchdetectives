/**
 * Speech synthesis utility for natural, expressive voice output.
 * Selects the highest quality natural/neural English voice available on the device
 * (e.g. Edge Natural, Chrome Google Natural, iOS/macOS Siri/Enhanced).
 */

export function getBestNaturalVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const englishVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  const candidates = englishVoices.length > 0 ? englishVoices : voices;

  // 1. Prioritize premium natural / neural voices
  const naturalRegex = /natural|neural|online|enhanced|premium|multilingual/i;
  const naturalMatch = candidates.find((v) => naturalRegex.test(v.name));
  if (naturalMatch) return naturalMatch;

  // 2. Prioritize high-quality child-friendly friendly English voices
  const friendlyRegex =
    /google us english|google uk english female|jenny|guy|samantha|victoria|karen|tessa|moira|daniel|oliver|arthur|ava|serena|allison/i;
  const friendlyMatch = candidates.find((v) => friendlyRegex.test(v.name));
  if (friendlyMatch) return friendlyMatch;

  // 3. Fallback to any English female / warm voice or first English voice
  const femaleFallback = candidates.find((v) => /female/i.test(v.name));
  return femaleFallback ?? candidates[0];
}

export function warmUpSpeechVoices(callback?: (voices: SpeechSynthesisVoice[]) => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return () => {};

  const handleVoices = () => {
    const list = window.speechSynthesis.getVoices();
    if (list.length > 0 && callback) {
      callback(list);
    }
  };

  handleVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", handleVoices);

  return () => {
    window.speechSynthesis.removeEventListener?.("voiceschanged", handleVoices);
  };
}
