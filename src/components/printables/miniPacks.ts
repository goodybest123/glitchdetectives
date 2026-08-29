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
  /** Original PDF page numbers shown as buyer-facing samples. */
  samplePages?: number[];
  /** PDF page used as the card cover; defaults to the first sample page. */
  coverPage?: number;
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
  const pageNumbers = pack.samplePages ?? Array.from({ length: pack.pageCount }, (_, i) => i + 1);
  return pageNumbers.map((n) => ({
    n,
    src: `/printables/mini-packs/${pack.slug}/page-${n}.jpg`,
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
    downloadUrl: "https://selar.com/glitchdetectives_money_math",
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
    downloadUrl: "https://selar.com/548i3377r9",
    tint: "#fff4d6",
  },
  {
    slug: "real-world-glitch-hunt",
    title: "Real-World Math Glitch Hunt - Mini Pack",
    blurb:
      "A free 6-page workbook where children follow ZED-4 through everyday scenes and repair the maths glitches he leaves behind.",
    badges: ["Real-World", "6 Pages", "Free"],
    pageCount: 6,
    description: [
      "If your child rushes to guess numbers without checking if they actually make sense, you're not alone. We spend so much time asking kids, \u201CWhat is the answer?\u201D that we forget to teach them the most important skill: asking, \u201CDoes this answer make sense?\u201D",
      "That's exactly why I created the Real-World Math Glitch Hunt. Instead of boring drill sheets, this free 6-page workbook turns your child into a Math Detective. They will follow ZED-4, a friendly robot who keeps making mathematical \u201Cglitches\u201D in everyday life \u2014 like sharing pizza, buying toys, and counting balloons.",
      "Your child's mission: INVESTIGATE the scene, DETECT the glitch, REPAIR the mistake, and EXPLAIN their thinking.",
    ],
    learn: [
      {
        title: "Does this make sense?",
        body: "Children stop guessing numbers and start checking whether an answer is reasonable before they accept it.",
      },
      {
        title: "Maths in everyday scenes",
        body: "Sharing pizza, buying toys and counting balloons put arithmetic into situations children already recognise.",
      },
      {
        title: "The four-step detective routine",
        body: "Investigate, detect, repair, explain \u2014 the same habit that carries across every Glitch Detectives pack.",
      },
    ],
    downloadUrl: "http://selar.com/mini_glitch_detectives_hunt",
    tint: "#ece8ff",
  },
  {
    slug: "7-day-math-without-worksheets-challenge",
    title: "The 7-Day Math Without Worksheets Homeschool Challenge",
    blurb:
      "Seven real-world math investigations, zero worksheets, and five minutes a day for a calmer week of noticing, reasoning, and explaining.",
    badges: ["7 Days", "No Worksheets", "Free"],
    pageCount: 22,
    samplePages: [2, 7, 13],
    coverPage: 1,
    description: [
      "Tried the workbooks, printed the pages, and still ended up with a child in tears? This free seven-day challenge takes a different approach: seven hands-on math investigations using things you already have at home. No prep, no printing, just five minutes a day and a little curiosity.",
      "Your child might split an apple fairly, work with a pretend $20 budget, build a tower from blocks, or catch and fix a hidden mistake. Each day follows the same simple method: Investigate, Detect, Repair, Explain — a practical routine for noticing what is happening, finding the problem or pattern, working out the fix, and explaining their thinking out loud.",
      "Inside are parent scripts, prompts, and a helpful line for when your child gets stuck, along with a Detective ID Card, a grand finale mystery featuring ZED-4, a certificate page, and real talk for the parent. You do not need to be good at maths to run this. You just need to ask, ‘What do you notice?’",
    ],
    learn: [
      {
        title: "Real-world reasoning",
        body: "Children explore fairness, money, measurement, patterns, and mistakes through ordinary objects and situations at home.",
      },
      {
        title: "A repeatable thinking routine",
        body: "Investigate, detect, repair, explain gives children a steady way to slow down, check their thinking, and communicate what they notice.",
      },
      {
        title: "Confidence for the whole family",
        body: "Parent scripts and ‘say this if they get stuck’ prompts make it easier to support mathematical thinking without needing a lesson plan.",
      },
    ],
    downloadUrl: "https://selar.com/7-days-math-without-worksheet-challenge",
    tint: "#f8e8ee",
  },
];

export function getMiniPack(slug: string) {
  return MINI_PACKS.find((p) => p.slug === slug);
}
