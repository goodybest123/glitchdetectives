import { Brain, MessageCircle, Sparkles, type LucideIcon } from "lucide-react";

const BLUE = "var(--color-brand-blue)";

type Benefit = { icon: LucideIcon; title: string; line: string; bg: string };

const BENEFITS: Benefit[] = [
  {
    icon: Brain,
    title: "Low Cognitive Load",
    line: "Calm layouts, one task per page, no distractions.",
    bg: "#e8f9f5",
  },
  {
    icon: MessageCircle,
    title: "Sparks Conversation",
    line: "Each sheet ends with a “talk it through” prompt.",
    bg: "#fff4d6",
  },
  {
    icon: Sparkles,
    title: "Builds Confidence",
    line: "Small wins, visible progress, no red pens.",
    bg: "#ece8ff",
  },
];

export function BenefitsRow() {
  return (
    <section style={{ background: "var(--color-bg-light)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-24">
        <ul className="grid sm:grid-cols-3 gap-8 lg:gap-12 text-center">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <li key={b.title} className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: b.bg }}
                >
                  <Icon className="w-7 h-7" style={{ color: BLUE }} strokeWidth={2} />
                </div>
                <h3
                  className="mt-5 text-lg font-black uppercase tracking-tight"
                  style={{ color: BLUE }}
                >
                  {b.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed max-w-xs"
                  style={{ color: "color-mix(in oklab, var(--color-brand-blue) 70%, transparent)" }}
                >
                  {b.line}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
