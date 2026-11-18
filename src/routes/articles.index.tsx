/**
 * Redirect the former article index URL to the blog.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/articles/")({
  beforeLoad: () => {
    throw redirect({ to: "/blog" });
  },
});
