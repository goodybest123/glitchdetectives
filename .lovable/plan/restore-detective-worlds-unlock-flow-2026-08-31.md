# Restore Detective Worlds unlock flow

## Goal
Make the passcode form reliably call the server-side unlock function, retain the unlocked session, and navigate into `/play` without weakening the private access gate.

## Current diagnosis
- Browser reproduction shows submitting the form performs a native GET to `/unlock?passcode=...`.
- The unlock server function is not reached during that submission, and no session cookie is created.
- The configured server secrets are present, so the first implementation step will verify the client/server function boundary and hydration path before changing behavior.

## Implementation steps
1. Trace the generated client request and route hydration path for `/unlock`, including the existing function middleware, to identify why the React `onSubmit` handler is not intercepting the form.
2. Refactor the gate code if needed so the server-function declaration file remains a thin client-safe wrapper, with session configuration and timing-safe comparison in an imported server-only runtime helper.
3. Update the unlock page only as needed to prevent native fallback submission, show a clear busy/error state, and navigate after the server confirms the correct passcode.
4. Preserve the existing security properties: passcode and session secret remain server-only, comparison remains timing-safe, and `/play` continues checking the encrypted session before rendering nested worlds.
5. Verify in a fresh browser session that:
   - an incorrect code stays on `/unlock`, shows the generic error, and creates no unlocked session;
   - the correct configured code reaches the server, creates the session, and opens `/play`;
   - refreshing or opening a nested `/play` route remains unlocked;
   - locking and retrying returns to the locked state;
   - there are no browser console errors or failed unlock requests.

## Technical details
- Keep TanStack Router and TanStack Start server functions; do not move the passcode into client code or local storage.
- Use the existing generated auth middleware without replacing it.
- Update route metadata only if route changes require it; do not alter unrelated public pages.
