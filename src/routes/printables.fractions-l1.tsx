/**
 * `/printables/fractions-l1` layout route. The workbook detail page lives in
 * `printables.fractions-l1.index.tsx`; the sample gallery mounts here.
 */
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/printables/fractions-l1")({
  component: () => <Outlet />,
});
