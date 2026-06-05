# Blog Writer

A minimal blogging app built with Next.js 16, Tailwind CSS v4, Prisma, and Auth.js.

**Live site:** https://blog-writing-app-ashy.vercel.app

## Features

- Write and publish blog posts with a rich TipTap editor (auto-saves drafts to localStorage)
- Tag-based filtering and author profile pages
- Like posts and see like counts on cards
- Reading time estimate on post cards and post headers
- Reading progress bar on post pages
- Scroll-triggered inspiration banner — shows a random writing quote on first downward scroll, fades out after 3 seconds
- Light / dark / system theme toggle
- Sign in with email+password or Google

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Neon PostgreSQL via Prisma v7
- **Auth:** Auth.js v5 (Credentials + Google OAuth)
- **Deployment:** Vercel

## Getting Started

```bash
npm install
npm run dev       # http://localhost:3000
```

Copy `.env.example` to `.env` and fill in `DATABASE_URL`, `AUTH_SECRET`, and OAuth credentials.

```bash
npx prisma migrate dev --name init   # apply migrations
npx prisma generate                  # regenerate client (restart dev server after)
npx prisma studio                    # browse database
```

## Deploy

```bash
vercel --prod --yes --scope keerthishree-s-projects
```

After deploying to a new domain, update the Google OAuth callback URL in Google Cloud Console to `https://<domain>/api/auth/callback/google`.
