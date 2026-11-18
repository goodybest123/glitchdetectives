/**
 * Article registry. Each entry describes one published article; the body lives
 * in its own component under `src/content/articles/`. To publish a new article,
 * add a body component there and one entry to `ARTICLES` below.
 */
import type { ComponentType } from "react";
import { AntiAiOrNot } from "./articles/anti-ai-or-not";
import { NewMathsOldMaths } from "./articles/new-maths-old-maths";

export type Article = {
  slug: string;
  title: string;
  /** ISO date used for display and Article JSON-LD. */
  date: string;
  readingTime: string;
  excerpt: string;
  Body: ComponentType;
};

export const ARTICLES: Article[] = [
  {
    slug: "new-maths-old-maths",
    title: "The New Maths and Old Maths. Pick One.",
    date: "2026-11-18",
    readingTime: "8 min read",
    excerpt:
      "Old Maths builds procedures and fluency. New Maths asks children to understand, explore, question, and explain. In a changing world, which approach do children need?",
    Body: NewMathsOldMaths,
  },
  {
    slug: "anti-ai-or-not",
    title:
      "Anti-AI or Not? What Every Homeschool Parent Needs to Think Through Before Handing Their Kid a Chatbot",
    date: "2026-08-24",
    readingTime: "7 min read",
    excerpt:
      "I get asked this a lot: are you against AI? No. I'm also not for it just because it's new. Here's how I think about kids, chatbots, wellbeing and moderation — without picking a team.",
    Body: AntiAiOrNot,
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function formatArticleDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
