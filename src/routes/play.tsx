/**
 * `/play` layout route. Renders an `<Outlet />` so nested routes
 * (`/play/case-01`, `/play/report`, etc.) can share the URL segment.
 *
 * Cases 01–03 are public. Individual routes for Cases 04–06 enforce their
 * availability before loading.
 */
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/play")({
  component: () => <Outlet />,
});
