# Articles section

Add a proper Articles area to the platform site, with your first piece published as the opening article.

## What gets built

1. **Articles index — `/articles`**
   - Branded hero ("Articles" / short line about reasoning-first learning in the AI era).
   - Card list of articles: title, date, reading time, short excerpt, and a "Read" link.
   - Uses existing brand colours, typography, and layout patterns from the other platform pages.

2. **Article page — `/articles/$slug`**
   - Full-width readable article layout: title, publish date, reading time, then the body with clear headings, paragraphs and lists.
   - Back link to `/articles` and a closing CTA block pointing to Detective Worlds and Printables.
   - Unknown slug shows a friendly "article not found" state with a link back to the index.

3. **First article**
   - Title: "Anti-AI or Not? What Every Homeschool Parent Needs to Think Through Before Handing Their Kid a Chatbot"
   - Slug: `/articles/anti-ai-or-not`
   - Your text published as written, lightly formatted into sections (What AI is doing to how kids learn / What it's doing to their wellbeing / The environment side / So should homeschool parents use it or not? / Why I'm building Glitch Detectives). Wording stays yours — only spacing, headings and one or two obvious typos are cleaned up. Nothing is invented or added.
   - Note: one sentence in the pasted text is cut off ("the habit of sitting with nothing and creating something is a ,") and part of the environment section came through truncated. I'll flag those spots so you can fill them in, or leave the sentence out until you confirm the wording.

4. **Navigation**
   - Add "Articles" to the site navbar (desktop and mobile) and to the footer links.

5. **SEO**
   - Distinct `head()` on both routes: title, description, `og:title`, `og:description`, `og:type` (`website` for the index, `article` for the post), canonical URLs on `https://glitchdetectives.lovable.app`, and Article JSON-LD on the post.

## Technical notes

- Articles live in code: `src/content/articles.ts` holds the metadata (slug, title, date, excerpt, reading time) and each article body lives in its own component under `src/content/articles/`. Adding a future article = one new file plus one registry entry.
- Routes: `src/routes/articles.index.tsx`, `src/routes/articles.$slug.tsx`, and `src/routes/articles.tsx` as a thin `<Outlet />` layout.
- No backend, no database, no auth — fully static and SSR-rendered, which is best for search visibility.
- Navbar edit in `src/components/landing/Navbar.tsx`; footer edit in `src/components/landing/sections.tsx`.

## Out of scope

- No comments, newsletter signup, or tagging/categories (can be added later).
- No admin editor — new articles are added on request.
