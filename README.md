# Pogromcy awarii — repair service application

A Polish Next.js application for sending computers and laptops to a repair service. It preserves the original site's layout, photographs, branding, gallery, service content, Google reviews, and location information. Node.js route handlers validate repair submissions and simulate courier bookings. Ready to build on Vercel.

## Run locally

Use Node.js 24 LTS and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No environment variables or external accounts are required for demo flows.

## Demo accounts

Login is simulated: enter an email or choose a demo-account button. There are no passwords.

| Email              | Role             |
| ------------------ | ---------------- |
| klient@example.com | Client (Anna)    |
| piotr@example.com  | Client (Piotr)   |
| serwis@example.com | Service employee |

Registration creates a client account in the current browser. Use fictional contact information.

## Walk through a repair

1. Log in as a client, choose **Nowe zgłoszenie**, fill in equipment, fault, accessories, sender details, and return address, then review and confirm.
2. On repair details, select **Przygotuj przesyłkę demo**. Read packing instructions and view the clearly marked test label/tracking number.
3. Log out and log in as the service employee **in the same browser**. Open the repair, confirm receipt, start diagnostics, and publish a quote.
4. Switch back to the client to accept or reject the quote.
5. Switch back to the service employee to simulate return shipping and complete the repair. A rejected quote allows return without repair.

An existing sample quote is available as `PA-DEMO-001`. Search/filter repairs, edit profiles, and inspect the service user list. **Resetuj demo** restores initial data and logs out; it deletes locally registered accounts and repairs.

## Demo limitations

This is a functional demo, not production authentication or a shared database. Accounts, session identity, repairs, profiles, and notifications are saved under `pogromcy-demo-v1` in `localStorage`. They persist across refreshes and synchronize between tabs of the same browser/origin, but are not shared between devices or different deployment URLs. Anyone with browser access can inspect or change demo storage. The role checks exercise the intended workflow; they are not a security boundary.

`POST /api/demo/repairs` validates data and returns a new record without persisting it. `POST /api/demo/shipping` returns a test tracking number. These stateless demo endpoints are public and never book a real courier, deliver emails/SMS, or generate real shipping labels. Test labels must not be used to send parcels. Confirm the real shipping destination with the service before shipping any equipment.

Google Maps and the existing Elfsight reviews widget still depend on external network access; the repair demo does not depend on them.

## Architecture

- `app/`: App Router pages and Node.js demo route handlers.
- `components/`: migrated site components, local demo provider, client/service screens.
- `lib/domain.ts`: models, input/storage validation, workflow rules, provider contracts.
- `lib/mock-services.ts`: replaceable auth, repository, courier, and notification adapters.
- `lib/seed.ts`: fictional users and repair records.
- `public/assets/images/`: existing local images and branding.
- `tests/`: domain/API tests and Playwright browser scenarios.

Original Jekyll source and its assets remain in the repository as a migration reference. Next.js serves only `app/` and `public/`. The former GitHub Pages workflow is disabled on this application branch; `main` retains its existing static site until this branch is merged.

## Validation

```sh
npm run check
npx playwright install --with-deps chromium
npm run test:e2e
```

CI checks TypeScript, domain and API behavior, the production build, and browser flows. See [development notes](docs/DEVELOPMENT.md) and [Vercel setup](docs/DEPLOYMENT.md).

## Moving to production

Replace the local auth provider with server-side authentication and enforce session ownership/roles in every protected API operation. Replace browser persistence with a database and transactional status updates. Connect courier bookings, real labels, and email delivery through the provider interfaces. Add the required privacy/consent text before collecting real personal data. The demo API must be replaced or disabled when enabling production accounts.
