/**
 * Single source of truth for the free "Glitch Detectives Mini Packs".
 * Shared by the mini packs section on `/printables` and the per-pack
 * preview route `/printables/mini-packs/$slug`.
 *
 * To add a pack: append an entry here, render its page images to
 * `public/printables/mini-packs/<slug>/page-N.jpg` and set `pageCount`.
 */

export type MiniPack = {
  /** URL segment used by `/printables/mini-packs/$slug`. */
  slug: string;
  title: string;
  /** One-line summary shown on the library card. */
  blurb: string;
  /** Short grade/topic chips. */
  badges: string[];
  /** Number of printable pages; also drives how many preview images we expect. */
  pageCount: number;
  /** Long-form product copy paragraphs for the preview page. */
  description: string[];
  /** "What they will actually learn" bullets. */
  learn: { title: string; body: string }[];
  /** External purchase/download page. Undefined until the link exists. */
  downloadUrl?: string;
  /** Accent colour for the card tile. */
  tint: string;
};

/** Page image paths for a pack (rendered from its PDF into /public). */
export function packPages(pack: MiniPack) {
  return Array.from({ length: pack.pageCount }, (_, i) => ({
    n: i + 1,
    src: `/printables/mini-packs/${pack.slug}/page-${i + 1}.jpg`,
  }));
}

export const MINI_PACKS: MiniPack[] = [
  {
    slug: "money-maths",
    title: "Glitch Detectives — Money Maths",
    blurb:
      "A quick 4-page activity pack where children audit real-world receipts and repair the hidden glitches.",
    badges: ["Money", "4 Pages", "Free"],
    pageCount: 4,
    description: [
      "A quick 4-page activity pack. Instead of handing your kids a boring worksheet of random questions on money, this turns them into Glitch Detectives.",
      "Their job isn't to solve a problem from scratch — it's to act as an auditor and find the deliberate, hidden mistakes in two exciting real-world scenarios: The Pantry Restock Mission, where your child audits a checkout receipt with a glitch in the subtotal, and The Toy Store Takeover, where the cash register at The Playful Pixel Toy Co. is malfunctioning. Your child must investigate the intended purchases, find the miscalculated totals on the receipt, and fix the store's system.",
      "Using a simple 5-step framework — Investigate, Detect, Repair, Explain, Result — your child won't just be doing maths; they will be auditing it.",
    ],
    learn: [
      {
        title: "Mathematical auditing",
        body: "Spotting hidden logical errors in everyday systems (like automated store receipts) instead of just solving equations from scratch.",
      },
      {
        title: "Applied arithmetic",
        body: "Using multiplication to verify that Quantity × Unit Price is correct, and addition to fix broken subtotals and final totals.",
      },
      {
        title: "Critical thinking & communication",
        body: "Proving exactly why a calculation is wrong and writing out how to fix it, which builds massive confidence in their reasoning skills.",
      },
    ],
    tint: "#e8f9f5",
  },
  {
    slug: "mixed-missions",
    title: "Glitch Detectives Mini Pack",
    blurb:
      "A free 6-page pack for Grades 2–4 with detective missions across addition, fractions, multiplication and measurement.",
    badges: ["Grades 2–4", "6 Pages", "Free"],
    pageCount: 6,
    description: [
      "This 6-page FREE printable is designed for Grades 2–4 and helps children build real critical and mathematical thinking by spotting, repairing and explaining mistakes instead of simply solving problems.",
      "Inside you'll find detective missions on addition, fractions, multiplication and measurement — plus a parent guide with simple questions that encourage deeper thinking.",
      "Perfect for homeschool families, after-school practice, or anyone who wants maths to make sense, not just be memorised.",
    ],
    learn: [
      {
        title: "Four topics, one habit",
        body: "Addition, fractions, multiplication and measurement missions all use the same investigate-detect-repair-explain routine.",
      },
      {
        title: "Reasoning over recall",
        body: "Children explain why an answer is wrong, which surfaces misconceptions a correct-answer worksheet would hide.",
      },
      {
        title: "Parent guide included",
        body: "Simple prompt questions so the adult in the room can extend the thinking without needing a lesson plan.",
      },
    ],
    tint: "#fff4d6",
  },
];

export function getMiniPack(slug: string) {
  return MINI_PACKS.find((p) => p.slug === slug);
}
