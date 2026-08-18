/**
 * `/printables` layout route. Renders nothing of its own — the library
 * listing lives in `printables.index.tsx` and detail pages mount here.
 */
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/printables")({
  component: () => <Outlet />,
});
