# Development and validation

Node.js 24 LTS, npm, Next.js App Router, TypeScript, React, and Zod. Customer-facing text is Polish; project documentation is English.

## Commands

- `npm ci`: install the locked dependency graph.
- `npm run dev`: run Next.js locally.
- `npm run typecheck`: check TypeScript.
- `npm test`: check workflow, ownership, validation, local registration, and Node.js APIs.
- `npm run build`: build the production application.
- `npm run start`: serve the production build.
- `npm run test:e2e`: run Playwright against the production server (built first).
- `npm run format:check`: check formatting.

Playwright needs Chromium: `npx playwright install --with-deps chromium`. The configuration automatically starts a local server if none is running.

## Mock data

The demo context reads validated, versioned browser storage after hydration. It reports blocked/corrupt storage and falls back to seeded data. Reset uses an explicit confirmation because it deletes local accounts and repairs. All forms validate inputs before creating records; the server validates submissions independently.

Domain functions enforce the workflow: equipment receipt precedes diagnostics, quote acceptance precedes repair, rejection leads to return without repair, and completion follows return shipping. Client screens expose only that client's repairs, while service screens require the staff demo role. These are demo workflow checks, not production authorization.

## Browser coverage

Playwright verifies: new repair → Node.js submission API → local record → inbound shipping API → staff receipt/diagnostics/quote → client acceptance → return shipping → completion. Additional cases cover registration, profile persistence, owner separation, service-only user list, mobile menu, gallery dialog, invalid API input, quote rejection and return without repair, recovery/reset after corrupt storage, and absence of mobile horizontal overflow.

## Visual reference

`app/site.css` is the existing site's styling; `app/app.css` adds the account/repair screens using its existing colors, typography, cards, and buttons. Original Jekyll source remains for comparison; application code is under `app/`, `components/`, and `lib/`.
