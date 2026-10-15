import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/printables/bundle")({
  beforeLoad: () => {
    throw redirect({ to: "/printables/fractions/bundle" });
  },
});
