# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Runs: prisma migrate deploy && next build
npm run start        # Start production server

npx prisma migrate dev --name <name>   # Create + apply a migration
npx prisma generate                    # Regenerate client after schema changes (restart dev server after)
npx prisma studio                      # Open DB browser UI

vercel --prod --yes --scope keerthishree-s-projects   # Deploy to production
```

## Architecture

**Stack:** Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4 + Prisma v7 + Auth.js v5

### Database
- **Local dev:** `DATABASE_URL` points to Neon PostgreSQL (same as production)
- **Adapter:** `@prisma/adapter-pg` in `lib/db.ts` — `better-sqlite3` is devDependency only (legacy, not used)
- **Generated client:** `app/generated/prisma/` — gitignored, regenerated via `postinstall` on Vercel and manually with `prisma generate`
- **Two db files exist locally:** `dev.db` (root, actual app db) and `prisma/dev.db` (empty, Prisma migration tracking). After a migration, apply SQL manually to `dev.db` if needed.
- After running `prisma generate`, always restart the dev server — old client stays cached in memory.

### Authentication (Auth.js v5)
- `auth.ts` — full server config with Credentials (email+password via bcrypt) + Google + GitHub (optional)
- `auth.config.ts` — Edge-safe config (no DB imports) used only by `proxy.ts`
- `proxy.ts` — Next.js 16 proxy (replaces `middleware.ts`) protecting `/posts/new` and `/posts/*/edit`
- Sessions use JWT strategy
- Registration API at `app/api/auth/register/route.ts` — hashes passwords with bcrypt (cost 12)
- GitHub login only shows if `AUTH_GITHUB_ID` env var is set

### Key patterns
- **Server components** call `auth()` directly for session, pass `isOwner` down to client components
- **API routes** (`app/api/posts/`) check `auth()` for POST/PUT/DELETE — return 401 if unauthenticated
- **PostCard / view page** show edit/delete only when `isOwner=true`
- **Dark mode:** `next-themes` with `attribute="class"` — `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` overrides Tailwind's built-in media-query dark variant. Both `<html>` and `<body>` need `suppressHydrationWarning`.
- **Editor:** TipTap loaded via `next/dynamic` with `ssr: false`. Auto-saves to `localStorage` every 1.5s.
- **Scroll inspiration banner:** `ContentArea` (client component) wraps `<main>` and listens for scroll events. On the first downward scroll per page visit it shows `ScrollInspirationBanner` — a violet strip with a random writing quote that fades out after 3 seconds. Uses `hasShown` ref to ensure it only fires once.

### Data models
```
Post:  id, title, content, tags (comma-separated), authorId, authorName, createdAt, updatedAt
User:  id, name, email, password (bcrypt), createdAt
```

## Environment variables

```
DATABASE_URL        postgresql://... (Neon)
AUTH_SECRET         /ph6MRwT5jj0JQZLKtWSJ0IqkiXnNb0Tc9SD4mbAcfc=
AUTH_GOOGLE_ID      147074910215-...apps.googleusercontent.com
AUTH_GOOGLE_SECRET  GOCSPX-...
AUTH_GITHUB_ID      (optional — enables GitHub login button)
AUTH_GITHUB_SECRET  (optional)
```

## Deployment

- Platform: Vercel — team `keerthishree-s-projects`, project `blog-writing-app`
- `postinstall` runs `prisma generate`; `build` runs `prisma migrate deploy && next build`
- After deploying to a new domain, update Google OAuth callback URL in Google Cloud Console to `https://<domain>/api/auth/callback/google`
- Vercel Hobby plan: only 1 concurrent build — cancel blocked deployments before retriggering
