---
description: Launch the Blog Writer dev server and verify it's running
---

# Run: Blog Writer Dev Server

## Start the server

```bash
npm run dev > /tmp/blog-dev.log 2>&1 &
```

Wait for ready signal:
```bash
until grep -q "Ready in" /tmp/blog-dev.log 2>/dev/null; do sleep 1; done
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

Server is ready when `http://localhost:3000` returns `200`.

## Stop the server

```bash
pkill -f "next dev" 2>/dev/null
```

## Screenshot a page

```bash
google-chrome --headless --disable-gpu --screenshot=/tmp/screenshot.png \
  --window-size=1280,900 http://localhost:3000 2>/dev/null
```

## Key pages to verify

| Page | URL |
|---|---|
| All Posts | http://localhost:3000 |
| New Post | http://localhost:3000/posts/new |
| Bookmarks | http://localhost:3000/bookmarks |
| Profile | http://localhost:3000/profile |
| Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |
| Author | http://localhost:3000/author/{name} |
| Post View | http://localhost:3000/posts/{id} |

## Notes
- Dev server logs go to `/tmp/blog-dev.log`
- TipTap editor requires JS hydration — headless Chrome screenshots won't show the editor toolbar
- Dark mode toggle is in the sidebar footer (Sun/Moon/Monitor icons)
- **Neon DB auto-pauses** after inactivity — if the homepage 500s with `ETIMEDOUT`, run `npx prisma db execute --stdin <<< "SELECT 1;"` to wake it
- **Scroll inspiration banner** only triggers on first downward scroll per page visit
- After `prisma generate`, restart the dev server
