# OGGEL digital — Next.js

Next.js 15 (App Router), plain JavaScript.

```
app/
  layout.jsx            fonts (Geist + DM Mono via next/font), metadata, <body> settings
  page.jsx              all page markup
  SiteInteractions.jsx  'use client' — cursor, scroll reveal, nav blend, form, clock
  globals.css           all styles
public/images/          project screenshots (thesis.jpg, housing.jpg, lily.jpg)
```

## Run locally

Requires Node 18.18+ (https://nodejs.org).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add project images

Put `thesis.jpg`, `housing.jpg`, `lily.jpg` in `public/images/`. Missing images fall back to a grey card.

## Put it on GitHub

**No terminal:** create a repo at https://github.com/new → click **uploading an existing file** → drag in the *contents* of this folder (not `node_modules` or `.next` if you ran it locally) → **Commit changes**.

**Terminal:**

```bash
git init
git add .
git commit -m "First version"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/oggel-digital.git
git push -u origin main
```

## Deploy on Vercel

1. https://vercel.com → sign in with GitHub.
2. **Add New… → Project** → import the repo.
3. Vercel detects **Next.js** automatically. Leave all settings as they are.
4. **Deploy**. Every push to `main` redeploys.

Custom domain: **Project → Settings → Domains → Add**, then follow the DNS instructions.

## Contact form

Currently front-end only (validates and shows a thank-you). To make it send, add a route at `app/api/contact/route.js` using an email service like Resend, or post the form to Formspree.

## Still to fill in

- Real KvK number (search `KvK` in `app/page.jsx`).
- Links on project cards: add `href="…"` to each `<a className="case …">`.
# OGGEL-digital
