import type { L4Theme } from "@/lib/level4/types";

const EMOJI: Record<L4Theme, string> = {
  pizza: "🍕",
  fuel: "⛽",
  candy: "🍬",
  juice: "🧃",
  battery: "🔋",
  chocolate: "🍫",
  snack: "🍱",
  energy: "⚡",
  treasure: "🎁",
};

export function themeEmoji(theme: L4Theme): string {
  return EMOJI[theme] ?? "📦";
}

export function themeAccent(theme: L4Theme): string {
  // Warm amber/copper palette per the brief.
  if (theme === "fuel" || theme === "energy") return "#ffb86b";
  if (theme === "juice" || theme === "candy") return "#ff8e8e";
  if (theme === "battery") return "#7df4c6";
  if (theme === "chocolate" || theme === "snack" || theme === "treasure") return "#e8a87c";
  return "#ffd28a";
}

export function ThemeBadge({ theme, size = 28 }: { theme: L4Theme; size?: number }) {
  return (
    <span
      style={{ fontSize: size, lineHeight: 1 }}
      aria-hidden
      role="presentation"
    >
      {themeEmoji(theme)}
    </span>
  );
}
