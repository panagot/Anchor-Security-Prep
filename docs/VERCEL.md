# Vercel deployment

## Required settings

In [Vercel Dashboard](https://vercel.com) → **anchor-security-prep** → **Settings → General**:

| Setting | Value |
|---------|-------|
| **Root Directory** | `web` |
| **Framework Preset** | Next.js |
| **Build Command** | *(leave empty — use default)* |
| **Output Directory** | *(leave empty — use default)* |
| **Install Command** | *(leave empty — use default)* |

> **Critical:** Do not set Output Directory to `.next` — Vercel manages Next.js output automatically. A custom output path causes 404 errors.

## Deploy

1. Connect GitHub repo: `panagot/Anchor-Security-Prep`
2. Set **Root Directory** to `web` as above
3. Deploy branch `main`
4. Production URL: https://anchor-security-prep.vercel.app

## If you still see 404

1. **Settings → General → Root Directory** must be exactly `web` (not `.`, not empty)
2. **Settings → Build & Development** → clear any overrides for Build Command / Output Directory
3. **Deployments** → Redeploy latest commit (not an old one)
4. If stuck: delete the Vercel project and re-import from GitHub with Root Directory = `web`

## Repo layout

```
Anchor-Security-Prep/
├── cli/           ← Rust scanner (not deployed to Vercel)
├── web/           ← Next.js app (Vercel Root Directory)
│   ├── app/
│   ├── package.json
│   └── ...
└── examples/
```

## What works on Vercel

| Route | Works |
|-------|-------|
| `/`, `/compare`, `/rules` | Yes (bundled samples) |
| `/report/[id]` | Yes (sample reports) |
| `/api/scan` | No (needs local Rust CLI) |
