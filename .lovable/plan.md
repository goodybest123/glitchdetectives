## Glitch Detectives Landing Page — Build Plan

Replace the current intro screen with a full marketing landing page, while preserving the existing mission flow (Map + MissionRunner) accessible from CTAs.

### 1. Design tokens (src/styles.css)
Add the requested palette as CSS variables and map to Tailwind theme tokens:
- `--brand-blue: #1e293b`
- `--brand-yellow: #FFDE59`
- `--brand-mint: #A5F5DE`
- `--bg-light: #F8F9FA`
- `--bg-mint: #E8F9F5`

Add font stack: heavy sans-serif headings (Space Grotesk 700/900) with `uppercase` + `tracking-wide` utility classes. Keep existing semantic tokens for the mission app.

### 2. Routing
- `src/routes/index.tsx` → new `LandingPage` (the marketing site).
- `src/routes/play.tsx` → hosts the existing Intro → Map → MissionRunner flow (moved out of index).
- "Try for Free" / "Explore the Worlds" / "Enter World (Fraction Factory)" link to `/play`.
- Navbar anchor links use smooth scrolling to in-page section IDs.

### 3. Component breakdown (all in `src/components/landing/`)
- `Navbar.tsx` — sticky white nav, stacked logo, links, yellow CTA.
- `WaveDivider.tsx` — reusable SVG wave with `fromColor` / `toColor` / `flip` props.
- `Hero.tsx` — brand-blue bg, dot pattern, badges, H1, glassmorphic description card, dual CTAs, checklist, floating image with mint/yellow glow.
- `ProblemSection.tsx` — light gray, split layout, 3 amber warning cards.
- `HowItWorks.tsx` — 4-step loop with connecting line (desktop), icons: Search, Zap, Wrench, MessageCircle.
- `WorldsSection.tsx` — 6 world cards (Fraction Factory active, others Coming Soon with lock overlay); shows 3 by default + "See More Worlds" toggle.
- `RoleReversal.tsx` — yellow-tinted bg, central robot, 3 supporting cards.
- `Printables.tsx` — mint-tinted bg, 4 image cards.
- `Neurodivergent.tsx` — brand-blue bg, 6 outlined dark cards with icons.
- `Benefits.tsx` — "Beyond the Answer", Core vs AI-Era skills, 2×2 offset icon grid.
- `Testimonials.tsx` — mint bg, 3 cards with large yellow quote glyph + avatar initials.
- `FinalCTA.tsx` — yellow bg with two buttons.
- `Footer.tsx` — brand-blue, links + dummy social icons.

`LandingPage` composes these in order with `WaveDivider` between contrasting sections.

### 4. Assets
Generate two hero/world images via imagegen:
- Hero floating image: friendly robot detective with magnifying glass (premium illustration, soft).
- World card images: reuse a single generated illustration set per world; coming-soon worlds rendered grayscale via CSS filter.

### 5. Behavior
- Smooth scroll: set `scroll-behavior: smooth` on `html` + use anchor `href="#how-it-works"` etc.
- Hover: `hover:scale-105 transition-transform` on all cards and buttons.
- "See More Worlds" — local `useState` toggle.
- Fully responsive: mobile collapses nav links, single-column sections, 2×2 grids become stacked.

### 6. Out of scope
- No changes to AI evaluation, mission logic, or `MissionRunner` internals. Existing components remain wired through `/play`.

### Technical notes
- Tailwind v4 inline theme: extend `@theme` with `--color-brand-blue`, `--color-brand-yellow`, `--color-brand-mint`, `--color-bg-light`, `--color-bg-mint` so classes like `bg-brand-blue` work.
- Keep design tokens (`--primary`, etc.) untouched so the mission UI is unaffected.
- Images stored in `src/assets/landing/` and imported as ES6 modules.
