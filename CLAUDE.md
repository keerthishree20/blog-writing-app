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
- **Adapter:** `@prisma/adapter-pg` in `lib/db.ts`
- **Generated client:** `app/generated/prisma/` — gitignored, regenerated via `postinstall` on Vercel and manually with `prisma generate`
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
- **Scroll inspiration banner:** `ContentArea` wraps `<main>` and fires `ScrollInspirationBanner` once per page visit on first downward scroll.
- **Bookmarks:** `BookmarkButton` toggles post IDs in `localStorage` key `bookmarked_posts`. `/bookmarks` page fetches each bookmarked post from API.
- **Views:** `ViewCounter` client component fires `POST /api/posts/[id]/view` once per session (tracked via `sessionStorage`). Atomic `{ views: { increment: 1 } }` in DB.
- **Pagination:** Home page paginates at 6 posts per page. `Pagination` component uses `?page=N` URL param.
- **Search highlighting:** `PostCard` accepts `searchQuery` prop and wraps matching text in `<mark>` tags.
- **Table of Contents:** `TableOfContents` parses headings from HTML, assigns IDs to DOM headings via `data-post-content` attribute, scrolls smoothly.
- **Copy code blocks:** `CopyCodeBlocks` adds hover-to-show Copy button to all `<pre>` elements inside `[data-post-content]`.
- **Profile page:** `/profile` shows logged-in user's stats (posts, likes, views) and all their posts.

### Data models
```
Post:  id, title, content, tags (comma-separated), authorId, authorName, likes, views, createdAt, updatedAt
User:  id, name, email, password (bcrypt), createdAt
```

### Components
| Component | Type | Purpose |
|---|---|---|
| Editor | client | TipTap rich-text editor with auto-save |
| PostCard | client | Post list card with search highlighting, tag limit (3), views |
| BookmarkButton | client | Toggle bookmark in localStorage |
| LikeButton | client | Heart with animation, localStorage dedup |
| ViewCounter | client | Increment views once per session |
| ShareButton | client | Copy link, Post on X, native share |
| TableOfContents | client | Collapsible TOC from headings |
| CopyCodeBlocks | client | Copy button on code blocks |
| ReadingProgressBar | client | Scroll-driven progress bar |
| Pagination | client | Page navigation with URL params |
| TagFilter | client | Default tag filter (fullstack, next.js, typescript) |
| SearchBar | client | Search input with URL params |
| ThemeToggle | client | Light/dark/system toggle |
| MobileNav | client | Hamburger menu + drawer |
| ContentArea | client | Main wrapper + scroll banner |
| UserMenu | client | Avatar + sign out |

### Pages
| Route | Type | Purpose |
|---|---|---|
| `/` | server | Home — posts list, search, tags, pagination |
| `/posts/new` | server | New post editor (protected) |
| `/posts/[id]` | server | Post view — TOC, content, like, bookmark, share, related |
| `/posts/[id]/edit` | server | Edit post (protected) |
| `/author/[name]` | server | Author profile + their posts |
| `/bookmarks` | client | Saved posts from localStorage |
| `/profile` | server | User stats + their posts (protected) |
| `/login` | server | Login page |
| `/register` | server | Registration page |

## Environment variables

```
DATABASE_URL        postgresql://... (Neon)
AUTH_SECRET         (generate with: openssl rand -base64 32)
AUTH_GOOGLE_ID      Google OAuth client ID
AUTH_GOOGLE_SECRET  Google OAuth client secret
AUTH_GITHUB_ID      (optional — enables GitHub login button)
AUTH_GITHUB_SECRET  (optional)
```

## Deployment

- Platform: Vercel — team `keerthishree-s-projects`, project `blog-writing-app`
- `postinstall` runs `prisma generate`; `build` runs `prisma migrate deploy && next build`
- After deploying to a new domain, update Google OAuth callback URL in Google Cloud Console to `https://<domain>/api/auth/callback/google`
- Vercel Hobby plan: only 1 concurrent build — cancel blocked deployments before retriggering
