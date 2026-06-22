# Blog Writer — Complete Project Guide

A complete guide from zero to production for the Blog Writer application. Covers every feature, architecture decision, and implementation detail.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Why](#2-tech-stack--why)
3. [Project Setup from Scratch](#3-project-setup-from-scratch)
4. [Database Design & Prisma](#4-database-design--prisma)
5. [Authentication System](#5-authentication-system)
6. [Core CRUD — Posts API](#6-core-crud--posts-api)
7. [Rich Text Editor (TipTap)](#7-rich-text-editor-tiptap)
8. [Layout & Navigation](#8-layout--navigation)
9. [Dark Mode](#9-dark-mode)
10. [Responsive Design](#10-responsive-design)
11. [Tag System & Filtering](#11-tag-system--filtering)
12. [Search with Highlighting](#12-search-with-highlighting)
13. [Pagination](#13-pagination)
14. [Like Button](#14-like-button)
15. [Post Views Counter](#15-post-views-counter)
16. [Bookmarks (Save for Later)](#16-bookmarks-save-for-later)
17. [Share Button](#17-share-button)
18. [Related Posts](#18-related-posts)
19. [Reading Progress Bar](#19-reading-progress-bar)
20. [Reading Time Estimate](#20-reading-time-estimate)
21. [Table of Contents](#21-table-of-contents)
22. [Copy Code Blocks](#22-copy-code-blocks)
23. [Author Profiles](#23-author-profiles)
24. [Profile Page](#24-profile-page)
25. [Scroll Inspiration Banner](#25-scroll-inspiration-banner)
26. [Deployment to Vercel](#26-deployment-to-vercel)
27. [Environment Variables & Security](#27-environment-variables--security)
28. [Complete Feature Summary](#28-complete-feature-summary)

---

## 1. Project Overview

Blog Writer is a production-deployed, full-stack blog writing application. Users can create accounts, write rich-text blog posts, like and bookmark posts, share them, and explore by tags. The app is fully responsive, has dark mode, and is deployed on Vercel.

**Live URL:** https://blog-writing-app-ashy.vercel.app

**Repository:** https://github.com/keerthishree20/blog-writing-app

---

## 2. Tech Stack & Why

| Technology | Role | Why We Chose It |
|---|---|---|
| **Next.js 16** | Framework | Full-stack in one framework. Server components reduce client JS. App Router enables nested layouts. |
| **TypeScript** | Language | Type safety catches bugs at compile time. Auto-complete in editors. |
| **Tailwind CSS v4** | Styling | Utility-first CSS. No custom CSS files. Fast iteration. |
| **Prisma v7** | ORM | Type-safe database queries. Auto-generated TypeScript types from schema. |
| **PostgreSQL (Neon)** | Database | Serverless PostgreSQL. Scales to zero. Connection pooling for serverless functions. |
| **Auth.js v5** | Authentication | Supports multiple providers (credentials, Google, GitHub). JWT sessions. |
| **TipTap** | Editor | Headless rich-text editor built on ProseMirror. Extensible. |
| **Vercel** | Hosting | Optimized for Next.js. Auto-deploys. Free SSL. Serverless functions. |

---

## 3. Project Setup from Scratch

### Step 1: Create Next.js app
```bash
npx create-next-app@latest Blog_Writing --typescript --tailwind --app --turbopack
cd Blog_Writing
```

### Step 2: Install dependencies
```bash
# Database
npm install prisma @prisma/client @prisma/adapter-pg pg

# Authentication
npm install next-auth@beta bcrypt
npm install -D @types/bcrypt

# Editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/pm

# UI
npm install next-themes lucide-react
```

### Step 3: Initialize Prisma
```bash
npx prisma init --datasource-provider postgresql
```

### Step 4: Set environment variables
Create `.env` with:
```
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### Step 5: Create and apply migrations
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Step 6: Start development
```bash
npm run dev
```

---

## 4. Database Design & Prisma

### Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Post {
  id         String   @id @default(cuid())
  title      String
  content    String
  tags       String   @default("")      // comma-separated
  authorId   String?
  authorName String?
  likes      Int      @default(0)
  views      Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model User {
  id        String   @id @default(cuid())
  name      String?
  email     String   @unique
  password  String                       // bcrypt hashed
  createdAt DateTime @default(now())
}
```

### Key decisions:
- **Tags as comma-separated string**: Simple for a blog. A many-to-many tags table would be better at scale but adds complexity.
- **authorId + authorName on Post**: Denormalized for fast display. No JOIN needed to show author name on cards.
- **likes/views as integers**: Atomic increment via Prisma prevents race conditions.
- **Neon PostgreSQL**: Serverless — scales to zero when idle, connection pooling works with Vercel's serverless functions.

### Prisma client singleton (`lib/db.ts`)

```typescript
import { PrismaClient } from "@/app/generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Migrations
```bash
# Create a new migration
npx prisma migrate dev --name add-views-counter

# Apply on production (runs in build command)
prisma migrate deploy

# Regenerate client (always restart dev server after)
npx prisma generate
```

---

## 5. Authentication System

### Architecture

We use Auth.js v5 with two configuration files:

| File | Purpose | Used By |
|---|---|---|
| `auth.ts` | Full config — imports Prisma, bcrypt, handles credentials | Server components, API routes |
| `auth.config.ts` | Edge-safe config — no Node.js imports | `proxy.ts` (middleware replacement) |
| `proxy.ts` | Route protection | Next.js 16 proxy layer |

### Providers

**1. Credentials (email + password)**
- Registration: `app/api/auth/register/route.ts` hashes password with `bcrypt` at cost factor 12
- Login: `bcrypt.compare()` verifies the password against the stored hash
- Returns user object with id, name, email

**2. Google OAuth**
- Configured in Google Cloud Console as Web Application
- Redirect URI: `https://blog-writing-app-ashy.vercel.app/api/auth/callback/google`
- If user doesn't exist in DB, created automatically on first login

**3. GitHub OAuth (optional)**
- Only shows login button if `AUTH_GITHUB_ID` env var is set

### Sessions
- **JWT strategy** — session stored in encrypted cookie, no sessions table needed
- `AUTH_SECRET` encrypts the JWT token
- Stateless — works perfectly with serverless (each request may hit different server)

### Route Protection

`proxy.ts` protects:
- `/posts/new` — must be logged in to create posts
- `/posts/*/edit` — must be logged in to edit posts

Unauthenticated users are redirected to `/login`.

### Authorization Pattern

```typescript
const ADMIN_EMAIL = "keerthishreets@gmail.com";

// In API routes:
const session = await auth();
if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

const isAdmin = session.user.email === ADMIN_EMAIL;
if (!isAdmin && post.authorId !== session.user.id) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

- **401**: Not logged in
- **403**: Logged in but not the owner/admin
- Admin can edit/delete any post
- Regular users can only edit/delete their own posts

---

## 6. Core CRUD — Posts API

### Routes

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/posts` | No | List all posts |
| POST | `/api/posts` | Yes | Create a new post |
| GET | `/api/posts/[id]` | No | Get single post |
| PUT | `/api/posts/[id]` | Yes (owner/admin) | Update post |
| DELETE | `/api/posts/[id]` | Yes (owner/admin) | Delete post |
| POST | `/api/posts/[id]/like` | No | Increment like count |
| POST | `/api/posts/[id]/view` | No | Increment view count |

### Security checks on every mutating route:
1. Check `auth()` — return 401 if not authenticated
2. Fetch the post — return 404 if not found
3. Check ownership or admin — return 403 if not authorized
4. Validate input — return 400 if title is empty
5. Perform the operation

---

## 7. Rich Text Editor (TipTap)

### Implementation (`components/Editor.tsx`)

```typescript
// Loaded dynamically to avoid SSR issues (TipTap uses browser APIs)
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });
```

### Features:
- StarterKit extension (bold, italic, headings, lists, code blocks, blockquotes)
- Auto-saves to `localStorage` every 1.5 seconds
- Content stored as HTML in the database
- Rendered with `dangerouslySetInnerHTML` + Tailwind's `prose` typography plugin

### Auto-save mechanism:
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    if (editor) {
      localStorage.setItem(`draft-${postId}`, editor.getHTML());
    }
  }, 1500);
  return () => clearInterval(interval);
}, [editor]);
```

---

## 8. Layout & Navigation

### Root Layout (`app/layout.tsx`)

The root layout contains:
- **Desktop sidebar** (`hidden md:flex`) — logo, nav links (All Posts, Bookmarks, New Post, Profile), user menu, theme toggle
- **Mobile nav** — `MobileNav` component with hamburger button and slide-in drawer
- **Content area** — `ContentArea` client component wrapping `<main>` (handles scroll events for inspiration banner)

### Sidebar Links

| Section | Link | Visibility |
|---|---|---|
| Browse | All Posts | Always |
| Browse | Bookmarks | Always |
| Write | New Post | Logged in only |
| Write | Profile | Logged in only |

---

## 9. Dark Mode

### Implementation:
1. `next-themes` library with `attribute="class"`
2. Custom Tailwind v4 variant in `globals.css`:
   ```css
   @custom-variant dark (&:where(.dark, .dark *));
   ```
3. Both `<html>` and `<body>` need `suppressHydrationWarning` to prevent hydration mismatch
4. `ThemeToggle` component cycles through Sun (light) / Moon (dark) / Monitor (system)

### Why override the default variant?
Tailwind v4's built-in `dark:` uses a media query (`prefers-color-scheme: dark`). We override it to use a class-based approach so users can manually toggle dark mode regardless of their system preference.

---

## 10. Responsive Design

### Strategy:
- **Desktop (md+)**: Sidebar is visible (`hidden md:flex`), mobile header hidden
- **Mobile (<md)**: Sidebar hidden, sticky header with hamburger, slide-in drawer

### MobileNav Component:
- Hamburger button opens overlay + drawer (`translate-x-0` / `-translate-x-full`)
- Same navigation links as sidebar
- Clicking a link or the overlay closes the drawer
- User menu and theme toggle in drawer footer

---

## 11. Tag System & Filtering

### How tags work:
- Stored as comma-separated string in the `tags` field: `"react,typescript,nextjs"`
- On the home page, 3 default filter tags shown: `fullstack`, `next.js`, `typescript`
- Clicking a tag adds `?tag=tagname` to the URL
- Server-side filtering in the home page component
- URL is shareable — sharing `/?tag=react` loads the filtered view

### PostCard tag display:
- Maximum 3 tags shown per card
- If more exist, shows "+N more" badge
- Each tag is a clickable link that triggers tag filtering

---

## 12. Search with Highlighting

### How search works:
1. `SearchBar` client component updates `?q=query` URL param
2. Home page (server component) reads `q` from searchParams
3. Filters posts where title or tags include the query (case-insensitive)
4. Passes `searchQuery` prop to `PostCard`

### Search highlighting in PostCard:
```typescript
function highlightText(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-yellow-200">{part}</mark>
      : part
  );
}
```

Matching text in post titles is wrapped in yellow `<mark>` tags.

---

## 13. Pagination

### Implementation:
- `POSTS_PER_PAGE = 6` constant in home page
- URL parameter: `?page=2`
- Server-side slicing: `filtered.slice((page - 1) * 6, page * 6)`
- `Pagination` client component renders page buttons + prev/next arrows
- Preserves other URL params (search query, tag filter) when navigating pages

---

## 14. Like Button

### How it works:
1. `LikeButton` client component calls `POST /api/posts/[id]/like`
2. API uses Prisma atomic increment: `{ likes: { increment: 1 } }`
3. Prevents double-liking via `localStorage` key `liked_posts` (array of post IDs)
4. Heart icon animates (scale-150) on click
5. Filled heart shown when already liked, button disabled

### Why localStorage, not database?
- No login required to like — anonymous likes
- Per-browser deduplication is "soft" — user can clear storage or use another browser
- Simple and works without adding a Likes join table

---

## 15. Post Views Counter

### How it works:
1. `ViewCounter` client component mounted on post view page
2. On mount, checks `sessionStorage` for `viewed_{postId}` key
3. If not viewed this session, calls `POST /api/posts/[id]/view`
4. API uses atomic increment: `{ views: { increment: 1 } }`
5. View count shown on post cards (Eye icon) and post header

### Why sessionStorage?
- One view per browser session per post
- Tab refresh doesn't count again
- New session (new tab/restart) counts as a new view
- More accurate than localStorage (which would be one view forever)

---

## 16. Bookmarks (Save for Later)

### Components:
- `BookmarkButton` — toggle button on post view page, stores/removes post ID in `localStorage` key `bookmarked_posts`
- `/bookmarks` page — client-side page that reads IDs from localStorage, fetches each post from API, displays them

### How it works:
1. Click "Bookmark" on a post → ID saved to localStorage
2. Visit `/bookmarks` → all bookmarked IDs fetched from localStorage → each post loaded from API
3. "Remove" button on each bookmark removes it from localStorage and the list
4. Sidebar and mobile nav both link to `/bookmarks`

### Why client-side?
- No login required to bookmark
- Data stored per-browser in localStorage
- No additional database table needed

---

## 17. Share Button

### Three sharing methods:

| Button | API Used | Platform |
|---|---|---|
| Copy link | `navigator.clipboard.writeText()` | All |
| Post on X | Twitter intent URL | All |
| Share | `navigator.share()` (Web Share API) | Mobile only |

### Post URL construction (server-side):
```typescript
const host = headersList.get("host") ?? "localhost:3000";
const protocol = host.includes("localhost") ? "http" : "https";
const postUrl = `${protocol}://${host}/posts/${id}`;
```

---

## 18. Related Posts

### Algorithm:
1. Extract tags from current post
2. Fetch all other posts from database
3. Filter to posts sharing at least one tag with the current post
4. Sort by most recent (`updatedAt` desc)
5. Limit to 3 results

### Why filter in JavaScript?
PostgreSQL doesn't natively support "find rows where comma-separated field overlaps with a list." Filtering in JS after fetching all posts is simple and fast enough for a blog. At scale, we'd normalize tags into a separate table with a many-to-many relation.

---

## 19. Reading Progress Bar

### Implementation (`components/ReadingProgressBar.tsx`):
- Fixed position at top of page (z-50)
- Listens to scroll event with `{ passive: true }` for performance
- Calculates: `(scrollY / (scrollHeight - innerHeight)) * 100`
- Renders a violet div with `width: ${progress}%`
- Event listener cleaned up on unmount

---

## 20. Reading Time Estimate

### Implementation (`lib/readingTime.ts`):
```typescript
export function readingTime(html: string): string {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}
```
- Strips HTML tags
- Counts words
- Divides by 200 (average reading speed)
- Minimum 1 minute
- Shown on PostCard and post header

---

## 21. Table of Contents

### Implementation (`components/TableOfContents.tsx`):
1. Parse post HTML with `DOMParser` to extract `h1`, `h2`, `h3` headings
2. Build array of `{ id, text, level }` items
3. On mount, assign `id="heading-N"` to actual DOM headings inside `[data-post-content]`
4. Render collapsible panel (click to expand/collapse)
5. Click a heading → `scrollIntoView({ behavior: "smooth" })`
6. Indentation based on heading level

### Only shown when 2+ headings exist.

---

## 22. Copy Code Blocks

### Implementation (`components/CopyCodeBlocks.tsx`):
1. On mount, find all `<pre>` elements inside `[data-post-content]`
2. For each `<pre>`, create a "Copy" button positioned absolute top-right
3. Button appears on hover (opacity transition)
4. Click copies `<code>` text content to clipboard
5. Button text changes to "Copied!" for 1.5 seconds

---

## 23. Author Profiles

### Route: `/author/[name]`
- Decodes URL-encoded author name
- Fetches all posts by that author
- Shows author header with icon, name, post count
- Lists all their posts as PostCards
- Returns 404 if no posts found for that author name

### How users navigate here:
- Click author name on any PostCard → links to `/author/{authorName}`

---

## 24. Profile Page

### Route: `/profile` (protected — redirects to /login if not authenticated)

Shows:
- User avatar (Google image or default icon)
- Name and email
- Join date (from User.createdAt)
- Stats grid: total posts, total likes received, total views
- All user's posts listed below

### Stats calculation (server-side):
```typescript
const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
```

---

## 25. Scroll Inspiration Banner

### How it works:
1. `ContentArea` wraps `<main>` and listens for scroll events
2. On the first **downward** scroll per page visit, shows `ScrollInspirationBanner`
3. Banner displays a random writing quote from a predefined list
4. Violet strip slides in from the top
5. Automatically fades out after 3 seconds
6. Uses `hasShown` ref to ensure it fires only once per page visit

---

## 26. Deployment to Vercel

### Setup:
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Build command: `prisma migrate deploy && next build`
4. Install command runs `postinstall` → `prisma generate`

### Deploy:
```bash
vercel --prod --yes --scope keerthishree-s-projects
```

### After deploying to a new domain:
1. Go to Google Cloud Console → APIs & Credentials
2. Edit your OAuth client
3. Add `https://<new-domain>/api/auth/callback/google` as authorized redirect URI

### Vercel Hobby plan limitation:
- Only 1 concurrent build allowed
- If a deployment is stuck, cancel it before triggering a new one

---

## 27. Environment Variables & Security

### Variable management:
- **Local development**: `.env` file (gitignored)
- **Production**: Vercel dashboard → Settings → Environment Variables
- **Never hardcode secrets** in source code

### Security measures implemented:

| Layer | Measure |
|---|---|
| Passwords | bcrypt hash at cost factor 12 |
| API routes | `auth()` check on every mutation (401/403) |
| Admin check | Server-side email comparison |
| SQL injection | Prisma parameterized queries (structural prevention) |
| JWT tokens | Encrypted with AUTH_SECRET |
| Route protection | proxy.ts redirects unauthenticated users |
| HTTPS | Enforced by Vercel in production |
| UI authorization | Edit/delete buttons hidden for non-owners (defense in depth) |

---

## 28. Complete Feature Summary

### All Features Built

| # | Feature | Type | Key Files |
|---|---|---|---|
| 1 | Authentication (Email + Google) | Server | `auth.ts`, `auth.config.ts`, `proxy.ts` |
| 2 | Rich Text Editor | Client | `components/Editor.tsx` |
| 3 | Posts CRUD API | Server | `app/api/posts/` |
| 4 | Dark Mode | Client | `ThemeProvider.tsx`, `ThemeToggle.tsx` |
| 5 | Responsive Design | Client | `MobileNav.tsx`, layout.tsx |
| 6 | Tag Filtering | Client/Server | `TagFilter.tsx`, `app/page.tsx` |
| 7 | Search with Highlighting | Client/Server | `SearchBar.tsx`, `PostCard.tsx` |
| 8 | Pagination | Client/Server | `Pagination.tsx`, `app/page.tsx` |
| 9 | Like Button | Client | `LikeButton.tsx`, `api/posts/[id]/like` |
| 10 | Post Views Counter | Client | `ViewCounter.tsx`, `api/posts/[id]/view` |
| 11 | Bookmarks | Client | `BookmarkButton.tsx`, `app/bookmarks/` |
| 12 | Share Button | Client | `ShareButton.tsx` |
| 13 | Related Posts | Server | `app/posts/[id]/page.tsx` |
| 14 | Reading Progress Bar | Client | `ReadingProgressBar.tsx` |
| 15 | Reading Time | Utility | `lib/readingTime.ts` |
| 16 | Table of Contents | Client | `TableOfContents.tsx` |
| 17 | Copy Code Blocks | Client | `CopyCodeBlocks.tsx` |
| 18 | Author Profiles | Server | `app/author/[name]/page.tsx` |
| 19 | Profile Page | Server | `app/profile/page.tsx` |
| 20 | Scroll Inspiration Banner | Client | `ContentArea.tsx`, `ScrollInspirationBanner.tsx` |

### Data Flow Architecture

```
Browser (Client Components)
  ├── LikeButton ──► POST /api/posts/[id]/like ──► Prisma atomic increment
  ├── ViewCounter ──► POST /api/posts/[id]/view ──► Prisma atomic increment
  ├── BookmarkButton ──► localStorage (no server)
  ├── ShareButton ──► Clipboard API / Twitter Intent / Web Share API
  └── Editor ──► localStorage auto-save ──► POST /api/posts (on publish)

Server Components
  ├── Home page ──► prisma.post.findMany() ──► filter/paginate ──► PostCard[]
  ├── Post view ──► prisma.post.findUnique() ──► content + related posts
  ├── Author page ──► prisma.post.findMany({ where: authorName })
  └── Profile ──► auth() + prisma queries ──► stats + posts

API Routes
  ├── POST/PUT/DELETE ──► auth() check ──► ownership check ──► Prisma mutation
  └── GET ──► Prisma query ──► JSON response
```

### Tech Stack at a Glance

```
Frontend:  Next.js 16 + TypeScript + Tailwind CSS v4 + TipTap + lucide-react + next-themes
Backend:   Next.js API Routes + Auth.js v5 + bcrypt
Database:  PostgreSQL (Neon) + Prisma v7
Hosting:   Vercel (Hobby plan)
AI Tools:  Claude Code + Google Custom Search MCP
```

---

*Built by Keerthishree using Claude Code*
