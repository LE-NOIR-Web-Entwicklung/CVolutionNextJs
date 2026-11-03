This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Create a local environment file with the required server keys. The Claude motivation-letter feature needs:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Motivation letters

The form supports applications to an advertised role and spontaneous applications, using separate four-paragraph structures. `/api/motivation-letter/generate` accepts `applicationType: "reactive" | "spontaneous"`; omitted values default to `reactive`. Spontaneous applications require a desired role and either the company name or its website. Advertised applications require advert text or an advert URL.

Career changes and missing direct qualifications do not block generation. The prompt requires honest descriptions of transferable experience and forbids invented qualifications. Letters target 180–240 body words. Word exports use A4 with 20 mm margins, 11 pt text, single line spacing and no added paragraph spacing; short separators preserve the letter's blocks.

Public HTTP(S) pages are read with bounded redirects, DNS validation and support for structured `JobPosting` data. Protected, expired or JavaScript-only pages may still require pasted text. No additional scraping service is used.

Run the mocked generation, source-reading and Word-export regression tests with Node 22 or later:

```bash
node --test tests/motivation-letter.test.cjs
```

To include actual Word pagination checks, install LibreOffice and Poppler (`soffice` and `pdfinfo` on PATH) and run `CV_EXPORT_RENDER_WORD=1 node --test tests/cv-export.test.cjs tests/motivation-letter.test.cjs`.

These tests make no live AI calls. They verify the submitted prompts; final model output still requires a live generation check.

## Bewerbungsmanager

The dashboard's **Bewerbungen** area stores one private record per application: company, role, advert/form input, contact, status, application date, deadline, next action, notes and editable motivation letter. Search and status filters apply to company/role; open applications are ordered by next-action date. Due dates use Europe/Zurich. Wiedervorlagen are displayed in the dashboard; no email or calendar notifications are sent.

Letters generated inside an application are saved automatically. Manual changes are saved with **Bewerbung speichern**. Confirmation protects unsaved edits when switching records, following site links, signing out or reloading/closing the browser tab. The separate motivation tool keeps its existing independent Word download; its save action transfers a draft to the manager and requires company and role. Switching dashboard tabs preserves drafts in memory. Only saved applications survive a page reload.

Managing, deleting, JSON-exporting and Word-exporting saved applications remains available after subscription expiry. New AI generation and CV exports retain the existing subscription checks. The saved-letter Word endpoint accepts an `applicationId`, verifies ownership and reads the saved text on the server; client-provided letter content cannot override that record. CV exports use the current central profile, without storing a historical copy of a submitted CV.

### Database setup and rollout

Apply `supabase/migrations/20261103_create_applications.sql` to the configured Supabase database **before** deploying the updated dashboard. For an explicitly selected database, an administrator can run:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/20261103_create_applications.sql
```

The server needs the existing `SUPABASE_SERVICE_ROLE_KEY` environment variable. Keep it server-only. No new package, external service or billing configuration is required, and no existing records need backfilling. The migration has not been applied to the hosted database by this change.

The table enforces owner-only RLS, bounded fields and valid form data. API operations additionally verify the bearer token and filter by the authenticated owner. Updates require the saved `updated_at` value; concurrent changes return 409 and preserve local edits. The database sets timestamps and preserves record identity. Deleting an application removes its stored form, notes and letter. Deleting its `auth.users` account cascades to its applications. Subscription expiry does not delete records. Production privacy/retention notices and processor arrangements should cover these additional application records; this implementation is not a legal compliance assessment.

For deployment rollback, restore the previous application version and retain the new table. Dropping the table would delete saved applications; take a backup before any deliberate data removal.

### Verification

Run from this directory with Node 22+. Database tests require local `initdb`, `pg_ctl` and `psql`; they create and remove an isolated cluster under `/tmp` and never connect to a hosted database.

```bash
node --test tests/applications.test.cjs tests/applications-client.test.cjs
node --test tests/applications-db.test.cjs
CV_EXPORT_RENDER_WORD=1 node --test tests/cv-export.test.cjs tests/motivation-letter.test.cjs
npx tsc --noEmit --incremental false
npm run build
```

Browser tests require Playwright and Chromium plus a local server (`npm run start -- --hostname 127.0.0.1 --port 3107` after building):

```bash
APPLICATIONS_BROWSER_URL=http://127.0.0.1:3107 node --test tests/applications-browser.test.cjs
```

If Playwright is supplied by a shared runtime, set `PLAYWRIGHT_MODULE` to that module and optionally `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its Chromium executable. All Supabase, application and AI requests in these browser tests are intercepted with synthetic fixtures. Non-local server URLs are rejected. They test UI behavior, while the route and PostgreSQL tests separately verify the server and RLS boundaries. They do not verify the hosted Supabase configuration, live authentication or live AI output. No visual regression baseline or full screen-reader audit is supplied.

TDD evidence on 3 November 2026: the first application tests failed on the absent application module/routes; the saved-letter export tests initially returned 402 instead of 200/404. A separate browser regression reproduced the advert-only Word download failing before the integration was corrected. The passing application logic/API/client tests measure 99.68% line, 95.09% branch and 100% function coverage; these numbers exclude React UI code. Browser checks cover create/edit/reload, separate letters, filters, failed saves/loads, stale updates, confirmed deletion, standalone transfer/download, expired subscriptions, CV-modal reuse, labels/focus and overflow at 375/768/1440 px.

Final verification: 62 logic/client/CV/letter tests, 6 PostgreSQL tests and 6 browser journeys passed (74 total, no skips in these runs). Production build, explicit TypeScript check, focused ESLint and `git diff --check` passed. The changed self-service landing page retains one pre-existing Next.js `<img>` lint warning. A browser test also reproduced and then verified the fix for losing unsaved application input through the site's navigation. Encoding and line endings of existing files were preserved. Implementation, security, data-lifecycle and regression reviews were performed as separate local passes without subagents.

Security release limitation: `npm audit --omit=dev --audit-level=high` reported 17 existing dependency findings (2 critical, 10 high, 1 moderate, 4 low), including critical findings in Next.js and jsPDF. Package manifests and lockfiles are unchanged by this feature. Dependency remediation and hosted rollout remain separate release requirements; a successful feature test is not a production security clearance.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
