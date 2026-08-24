/**
 * `/articles` layout route. Renders nothing of its own — the index listing and
 * individual article pages mount into this outlet.
 */
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/articles")({
  component: () => <Outlet />,
});
