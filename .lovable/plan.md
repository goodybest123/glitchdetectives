## Problem

Navigating to `/play/case-01` shows the `/play` dashboard instead of the case page. Cause: `src/routes/play.case-01.tsx` is registered as a **child** of `src/routes/play.tsx` (per `routeTree.gen.ts`), but `play.tsx`'s `component: PlayPage` does not render `<Outlet />`. TanStack Router matches the child route, but it has nowhere to mount — the parent silently keeps rendering the dashboard.

## Fix

Convert `/play` into a layout + index route (standard TanStack pattern):

1. **Rename** `src/routes/play.tsx` → `src/routes/play.index.tsx` (no code change inside the file; the existing dashboard becomes the leaf route for `/play`).
2. **Create** new `src/routes/play.tsx` as a minimal layout:
   ```tsx
   import { createFileRoute, Outlet } from "@tanstack/react-router";
   export const Route = createFileRoute("/play")({ component: () => <Outlet /> });
   ```
3. Let the router plugin regenerate `routeTree.gen.ts` (do not edit by hand).

After this:
- `/play` → renders the layout's `<Outlet />` → renders `play.index.tsx` (dashboard).
- `/play/case-01` → renders the layout's `<Outlet />` → renders `play.case-01.tsx` (case page).

## Files touched
- **rename** `src/routes/play.tsx` → `src/routes/play.index.tsx`.
- **create** `src/routes/play.tsx` (3-line layout with `<Outlet />`).

## Out of scope
- Any changes to the case-01 page itself, the pizza component, or the chat — those remain working once routing is fixed.
