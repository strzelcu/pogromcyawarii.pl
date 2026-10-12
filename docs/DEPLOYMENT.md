# Vercel deployment

This branch is a Next.js app with Node.js 24 API handlers. It does not use Jekyll or static export for deployment.

1. Import `strzelcu/pogromcyawarii.pl` into Vercel or use an existing linked project.
2. Select the `feature/repair-service-app` branch for a **preview deployment**. Keep production pointed at the existing branch/site until the migration is reviewed.
3. Framework preset: **Next.js**. Root directory: repository root. Node.js version: **24.x**.
4. Install: `npm ci`. Build: `npm run build`. Leave output directory at the framework default. The repository includes `vercel.json`.
5. No database credentials or environment variables are needed for demo mode.
6. Verify the preview using both demo roles in the same browser. Test one newly created repair through both courier directions, quote acceptance and rejection, refresh persistence, and mobile navigation.

Do not configure `output: 'export'`: the app needs Node.js route handlers. Server-side writes never depend on process memory or local disk. The browser owns demo data; changing from a preview URL to a custom domain starts a separate local dataset.

The application's Pages workflow is disabled. Merging this branch does not automatically migrate a custom domain or configure Vercel. Change production/domain routing only after reviewing the preview and checking the intended production setup.

## Production follow-up

Before accepting real users, configure real authentication and a shared persistent database, implement server-side access checks, replace public demo endpoints, connect a courier and email provider, and establish privacy/consent handling. Keep provider credentials on the server. Plan data storage close to the Functions region.
