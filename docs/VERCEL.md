# Vercel deployment

The Next.js dashboard lives at the **repository root** (`app/`, `package.json`, etc.).

## Required settings

In [Vercel Dashboard](https://vercel.com) → **anchor-security-prep** → **Settings → General**:

| Setting | Value |
|---------|-------|
| **Root Directory** | *(leave empty — repo root)* |
| **Framework Preset** | Next.js |
| **Build Command** | *(leave empty — use default)* |
| **Output Directory** | *(leave empty — use default)* |
| **Install Command** | *(leave empty — use default)* |

> **Critical:** Do not set Output Directory to `.next` — Vercel manages Next.js output automatically. A custom output path causes 404 errors.

> **If you previously set Root Directory to `web`:** clear it (leave empty) and redeploy. The app is no longer in a subdirectory.

## Deploy

1. Connect GitHub repo: [panagot/Anchor-Security-Prep](https://github.com/panagot/Anchor-Security-Prep)
2. Leave **Root Directory** empty (default)
3. Deploy branch `main`
4. Production URL: https://anchor-security-prep.vercel.app

## If you still see 404

1. **Settings → General → Root Directory** must be **empty** (not `web`)
2. **Settings → Build & Development → Framework Preset** must be **Next.js** (not Other)
3. Clear any overrides for Build Command / Output Directory
4. **Deployments → Redeploy** latest commit (uncheck “Use existing build cache”)
5. If stuck: delete the Vercel project and re-import from GitHub with default root settings

## Repo layout

```
Anchor-Security-Prep/
├── app/              ← Next.js (deployed to Vercel)
├── cli/              ← Rust scanner (not deployed)
├── package.json
└── examples/
```

## What works on Vercel

| Route | Works |
|-------|-------|
| `/`, `/compare`, `/rules` | Yes (bundled samples) |
| `/report/[id]` | Yes (sample reports) |
| `/api/scan` | No (needs local Rust CLI) |
