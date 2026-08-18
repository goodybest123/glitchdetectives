/**
 * Single source of truth for the "Fractions — Foundations Collection"
 * printable product copy. Shared by the library card, the detail page
 * (`/printables/fractions-l1`) and the buyer preview page.
 */

export const COLLECTION_TITLE = "Glitch Detectives: Fractions";
export const COLLECTION_SUBTITLE =
  "Foundations Collection (Includes Levels 1 & 2 Missions)";

export const COLLECTION_INTRO =
  "This complete printable workbook combines Levels 1 and 2 fraction missions into one resource. Children become Lead Detectives who investigate mathematical mistakes, repair misconceptions, and explain their thinking, developing a strong conceptual understanding of fractions.";

export const COLLECTION_BADGES = [
  "Grades 1–2",
  "Fractions",
  "21 Pages",
  "Instant Digital Download",
  "Free",
];

export const COLLECTION_PITCH_HEADING =
  "Become the Lead Detective and Solve Fraction Mysteries";

export const COLLECTION_PITCH = [
  "Instead of completing repetitive fraction exercises, children become Lead Detectives helping a character named Sam uncover mathematical glitches.",
  "Children investigate completed work, identify mistakes in reasoning, repair misconceptions and explain why the correct mathematical thinking works.",
  "This workbook develops conceptual understanding through reasoning-first learning rather than memorisation. We present this as a complete learning journey that seamlessly combines both Levels 1 and 2 into one comprehensive resource.",
];

export const WHATS_INSIDE_INTRO =
  "This workbook thoughtfully combines two stages of learning, providing a complete progression from foundational understanding to deeper investigations.";

export const WHATS_INSIDE = [
  {
    title: "Level 1 — Building Strong Foundations",
    lead: "Children investigate everyday sharing situations while learning to:",
    items: [
      "Identify equal and unequal parts",
      "Understand halves",
      "Understand quarters",
      "Recognise fractions in everyday contexts",
      "Connect pictures with fraction language",
      "Explain mathematical thinking",
    ],
  },
  {
    title: "Level 2 — Deeper Fraction Investigations",
    lead: "Children continue solving more challenging investigations involving:",
    items: [
      "Numerators and denominators",
      "Fractions of a set",
      "Comparing unit fractions",
      "Equivalent fractions",
      "Fractions on a number line",
      "Adding and subtracting fractions with the same denominator",
    ],
  },
] as const;

/** Google Drive location of the full workbook download. */
export const COLLECTION_PDF_URL =
  "https://drive.google.com/file/d/1iKVxom5mfZ_qN1Zdyd7kT_eX7WwmMMUD/view?usp=drive_link";

/** Sample pages rendered from the workbook PDF (served from /public). */
export const PREVIEW_PAGES = [1, 2, 3, 4, 5].map((n) => ({
  n,
  src: `/printables/preview/page-${n}.jpg`,
}));
