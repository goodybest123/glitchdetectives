/**
 * TanStack Start bootstrap.
 *
 * Registers two middlewares on the Start instance:
 *  - `attachSupabaseAuth` (functionMiddleware): attaches the current user's
 *    Supabase bearer token to every server-function call so `requireSupabaseAuth`
 *    can validate the session on the server.
 *  - `errorMiddleware` (requestMiddleware): converts uncaught SSR errors into
 *    the branded 500 HTML page. Re-throws framework HTTPErrors (they carry
 *    `statusCode`) so redirects and 404s still work.
 */
import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware],
}));
