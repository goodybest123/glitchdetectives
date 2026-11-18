/**
 * Redirect former article detail URLs to their matching blog posts.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/articles/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/blog/$slug", params: { slug: params.slug } });
  },
});
