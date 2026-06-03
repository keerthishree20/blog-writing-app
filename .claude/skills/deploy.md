---
description: Deploy Blog Writer to Vercel production
---

# Deploy: Blog Writer to Vercel

## Prerequisites
- Vercel CLI authenticated: `vercel whoami`
- All env vars set on Vercel project (DATABASE_URL, AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET)
- Code pushed to `origin/main`

## Deploy

```bash
vercel --prod --yes --scope keerthishree-s-projects 2>&1
```

## Check deployment status

```bash
vercel ls blog-writing-app 2>&1
```

## If deployments are BLOCKED (Hobby plan = 1 concurrent build)

Cancel all blocked deployments first:
```bash
curl -s "https://api.vercel.com/v2/deployments?teamId=keerthishree-s-projects&limit=20&projectId=prj_0CdNfoDaphAPn9Zfr7XgW0BN6dKI" \
  -H "Authorization: Bearer $(cat ~/.vercel/auth.json | python3 -c 'import json,sys; print(json.load(sys.stdin)[\"token\"])')" \
  | python3 -c "import json,sys; [print(d['uid']) for d in json.load(sys.stdin).get('deployments',[])]" \
  | while read id; do
    curl -s -X PATCH "https://api.vercel.com/v12/deployments/$id/cancel?teamId=keerthishree-s-projects" \
      -H "Authorization: Bearer $(cat ~/.vercel/auth.json | python3 -c 'import json,sys; print(json.load(sys.stdin)[\"token\"])')" \
      -H "Content-Type: application/json" -d '{}' > /dev/null
    echo "Cancelled $id"
  done
```

Then redeploy.

## After deploying to a new domain

Update Google OAuth callback URL:
1. Go to https://console.cloud.google.com/apis/credentials
2. Edit the OAuth client
3. Add: `https://<new-domain>/api/auth/callback/google`

## Project info
- Team: `keerthishree-s-projects`
- Project ID: `prj_0CdNfoDaphAPn9Zfr7XgW0BN6dKI`
- Neon DB: `ep-twilight-credit-aqforexi-pooler.c-8.us-east-1.aws.neon.tech`
