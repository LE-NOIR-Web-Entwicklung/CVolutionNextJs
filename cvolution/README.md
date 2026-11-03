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

To include actual Word pagination checks, install LibreOffice and Poppler (`soffice` and `pdfinfo` on PATH) and run `CV_EXPORT_RENDER_WORD=1 node --test tests/*.test.cjs`.

These tests make no live AI calls. They verify the submitted prompts; final model output still requires a live generation check.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
