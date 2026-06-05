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
| Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |

## Notes
- Dev server logs go to `/tmp/blog-dev.log`
- TipTap editor requires JS hydration — headless Chrome screenshots won't show the editor toolbar
- Dark mode toggle is in the sidebar footer (Sun/Moon/Monitor icons)
- **Neon DB auto-pauses** after inactivity — if the homepage 500s with `ETIMEDOUT`, run `npx prisma db execute --stdin <<< "SELECT 1;"` to wake it. `/login` and `/register` load without DB.
- **Scroll inspiration banner** lives in `components/ContentArea.tsx` + `components/ScrollInspirationBanner.tsx`. It only triggers on the first downward scroll per page visit. Use Playwright (not headless Chrome) to test it — you must set `scrollTop > 0` on `<main>` before dispatching the scroll event, since the direction check compares against `lastScrollTop`.

## Testing scroll interactions with Playwright

```js
import { chromium } from '/home/harikishan/.nvm/versions/node/v22.15.0/lib/node_modules/playwright/index.mjs';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });

// Simulate downward scroll (must move scrollTop for direction detection)
await page.evaluate(() => {
  const main = document.querySelector('main');
  if (main) {
    main.firstElementChild.style.minHeight = '2000px';
    main.scrollTop = 100;
    main.dispatchEvent(new Event('scroll', { bubbles: true }));
  }
});
```
