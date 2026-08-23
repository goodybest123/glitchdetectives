Refine company website copy and terminology: restore "Explore Worlds" / "Explore Printables" CTAs, replace "game" with "Detective Worlds", and sharpen messaging around neuroinclusion, blank-page anxiety, and AI-era skepticism.

Scope

- Copy-only updates on the public-facing company pages (Home, About, Products) plus the play dashboard.
- Keep `/play` and `/printables` fully functional; do not change gating, pricing, or download links.
- Standardise on the user-chosen term "Detective Worlds" instead of "game".

User decisions

- Replacement term for "game": Detective Worlds.
- "Explore Worlds" / "Explore Printables" CTAs: Home hero only.
- Blank-page anxiety messaging: Home + Products.

Plan

1. Update Home (`src/routes/index.tsx`)
   - Hero CTAs: replace current "Explore Products" + "Try Free" with "Explore Worlds" (→ `/play`) and "Explore Printables" (→ `/printables`).
   - Hero subheading: explicitly mention neuroinclusive design and that children learn not every answer — especially AI-generated answers — should be trusted.
   - Proof-point card update: adjust "AI Literacy" copy to frame the child as an error-hunter / answer-checker in the AI era.
   - Products-preview section: replace "A game and printables" with "Detective Worlds and printables"; keep the six-worlds bullet.
   - Final CTA: replace "Try the Game" with "Enter Detective Worlds".
   - Update `head()` meta description to mention AI skepticism, error-hunting, and neuroinclusion.

2. Update About (`src/routes/about.tsx`)
   - Problem section: strengthen AI-era angle — children need to question confident-sounding answers, not just avoid memorisation.
   - Inclusive section: expand neuroinclusive benefits to include reduced blank-page anxiety and low-pressure entry points.
   - Benefits section: add "AI answer verification" or "healthy skepticism" as an AI-era skill.

3. Update Products (`src/routes/products.tsx`)
   - Hero headline: replace "Play, Print, and Reason" with "Detective Worlds, Printables, and Reason".
   - Hero CTA: "Try Detective Worlds Free" (or keep "Explore Worlds" if on Products, but user said Home hero only — so Products CTAs keep their current shape but update wording).
   - Replace "The Game" eyebrow and "Interactive Detective Worlds" with consistent Detective Worlds framing.
   - Printables section: add a paragraph about blank-page anxiety — structured workbooks, visible starting point, and the same error-hunting loop so children never face a blank page.
   - For Parents / Educators: update bullets to mention neuroinclusion and AI-literacy.
   - Update `head()` meta description to reflect the same messaging.

4. Update play dashboard (`src/routes/play.index.tsx`)
   - Page title and subhead: replace "game" with "Detective Worlds" / "Active Cases".
   - Keep the passcode gate intact; only copy changes.

5. Replace stray "game" references
   - Search `src/routes/index.tsx`, `src/routes/about.tsx`, `src/routes/products.tsx`, `src/routes/play.index.tsx`, `src/routes/contact.tsx`, `src/components/landing/Navbar.tsx`, and README/docs for any remaining "game" terminology.
   - Replace with "Detective Worlds", "Cases", "Missions", or "experience" depending on context.
   - Update the JSDoc comment in `Navbar.tsx` that says "Try for Free CTA goes to the game".

6. Verify
   - `bun run build` passes.
   - `rg -i "game" src/routes src/components/landing` returns only unavoidable references (e.g., code comments about legacy routes, none in user-facing copy).
   - Smoke-test that `/`, `/about`, `/products`, and `/play` still render correctly and CTAs link to the right routes.

Out of scope

- No new visual assets, no new pages, no backend changes, no pricing changes, no auth/gating changes.
