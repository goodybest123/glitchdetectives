/**
 * Legacy route layout kept to redirect existing article links to the blog.
 */
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/articles")({
  component: () => <Outlet />,
});
