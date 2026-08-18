Pivot Glitch Detectives from a single long hackathon landing page into a proper multi-page company website while keeping the existing play + printables products fully functional.

Scope
- Treat Glitch Detectives as both the company and the core product.
- Keep `/play` and `/printables` unchanged for users who want to use the product.
- Create clearly separated company pages: `/` (Home), `/about`, `/products`, `/contact`.
- Replace the on-page hash navigation with a site-wide navbar that links to real routes.

Plan

1. Restructure the home page (`src/routes/index.tsx`)
   - Shrink it from a single long scroll to a concise company homepage: hero, one-line value prop, key proof points, and CTAs.
   - Keep the existing brand visuals, colors, and typography; only the content length changes.
   - Add a `head()` with company-focused title and description.

2. Create `/about` route
   - File: `src/routes/about.tsx`
   - Content: company story, mission, the problem Glitch Detectives solves (memorisation vs. reasoning), team/contact philosophy, and why reasoning-first matters in the AI era.
   - Reuse the existing `ProblemSection`, `RoleReversal`, `Neurodivergent`, and `Benefits` copy where it fits, but present it as narrative rather than stacked sections.
   - Add route-specific `head()` metadata.

3. Create `/products` route
   - File: `src/routes/products.tsx`
   - Content: product overview — the Glitch Detectives game platform (6 worlds/cases) and the printable Foundations Collection.
   - Include a "For Parents" and "For Educators" framing, with clear CTAs to `/play` and `/printables/fractions-l1`.
   - Add route-specific `head()` metadata.

4. Create `/contact` route
   - File: `src/routes/contact.tsx`
   - Content: sales/inquiry form for schools, parents, and partners. Fields: name, email, role (parent/teacher/school/admin/partner), message.
   - Since no backend data storage is required, submit the form to a client-side action (e.g., mailto link or simple success state) unless the user later asks for a backend integration.
   - Add route-specific `head()` metadata.

5. Replace the landing-only navbar with a site-wide navbar
   - Update `src/components/landing/Navbar.tsx` to use `<Link to>` for real routes: Home, About, Products, Contact, Printables.
   - Keep "Try for Free" CTA pointing to `/play`.
   - Use `activeProps` to highlight the current route.
   - Make it responsive; keep the existing mobile menu pattern if it exists, or add a simple hamburger menu if needed.

6. Update shared chrome in `src/routes/__root.tsx`
   - Ensure the navbar renders on every page unless the route is intentionally full-screen (e.g., gameplay).
   - Keep the current root layout; if the navbar is already included per-page, move it to `__root.tsx` around `<Outlet />` so it appears automatically on every route.

7. Add a site-wide footer
   - If the current footer only lives on the home page, create a shared `Footer` component and render it in `__root.tsx`.
   - Include company links, product links, social links, and a short copyright line.

8. SEO / metadata
   - Define distinct `head()` metadata for `/`, `/about`, `/products`, and `/contact`.
   - No `og:image` unless a real absolute cover image URL is generated or supplied.

9. Remove or redirect old hash-only navigation
   - Replace the current `SECTION_LINKS` hash-based links in `Navbar` with the new route links.
   - If any in-page anchors are still needed inside a route (e.g., FAQ on `/about`), use hash anchors within that single route.

10. Verify
    - `bun run build` passes.
    - `bun run lint` passes.
    - Smoke test that `/`, `/about`, `/products`, `/contact`, `/play`, and `/printables/fractions-l1` all load and the navbar links work.

Out of scope
- No new auth, no backend contact form storage, no payment changes, no new game cases.
- Visual rebrand is not part of this plan unless explicitly requested; keep the existing brand palette and assets.