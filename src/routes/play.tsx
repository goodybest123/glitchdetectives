/**
 * `/play` layout route. Renders an `<Outlet />` so nested routes
 * (`/play/case-01`, `/play/report`, etc.) can share the URL segment.
 *
 * It also acts as the access gate: `beforeLoad` asks the server whether this
 * visitor has unlocked the worlds, and the server throws a redirect to
 * `/unlock` when they haven't. Gating at the layout covers every child route.
 */
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requirePlayUnlocked } from "@/lib/gate.functions";

export const Route = createFileRoute("/play")({
  beforeLoad: () => requirePlayUnlocked(),
  component: () => <Outlet />,
});
