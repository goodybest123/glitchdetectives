import { ArrowRight, BookOpen, Search, ShoppingBag } from "lucide-react";

const BLUE = "var(--color-brand-blue)";
const MUTED = "color-mix(in oklab, var(--color-brand-blue) 70%, transparent)";

const COLLECTIONS = [
  {
    name: "Life Skills",
    intro: "Maths for everyday moments",
    detail: "Budgeting, cooking, planning, and practical choices.",
    icon: ShoppingBag,
    tone: "#fff2c2",
    slug: "life-skills",
  },
  {
    name: "Mini Packs",
    intro: "Short investigations, ready to print",
    detail: "Focused activities for a quick, low-prep learning session.",
    icon: Search,
    tone: "#e8f9f5",
    slug: "mini-packs",
  },
  {
    name: "Workbooks & Guides",
    intro: "Go deeper, at your own pace",
    detail: "Longer resources and helpful guides for learners and adults.",
    icon: BookOpen,
    tone: "#edf1e9",
    slug: "workbooks-guides",
  },
] as const;

export function PrintableCollections() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {COLLECTIONS.map(({ name, intro, detail, icon: Icon, tone, slug }) => (
        <a
          key={name}
          href={`/printables#${slug}`}
          className="group rounded-3xl border border-black/5 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-blue)] sm:p-7"
          style={{ background: tone }}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80">
            <Icon className="h-6 w-6" style={{ color: BLUE }} />
          </span>
          <span className="mt-5 block text-xl font-black uppercase" style={{ color: BLUE }}>
            {name}
          </span>
          <span className="mt-2 block text-sm font-bold" style={{ color: BLUE }}>
            {intro}
          </span>
          <span className="mt-2 block text-sm leading-relaxed" style={{ color: MUTED }}>
            {detail}
          </span>
          <span
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold"
            style={{ color: BLUE }}
          >
            Explore collection
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </a>
      ))}
    </div>
  );
}
