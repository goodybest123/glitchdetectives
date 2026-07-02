/**
 * `/play` layout route. Pathless wrapper that just renders an `<Outlet />`
 * so nested routes (`/play/case-01`, `/play/report`, etc.) can share the URL
 * segment. No UI of its own.
 */
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/play")({
  component: () => <Outlet />,
});
