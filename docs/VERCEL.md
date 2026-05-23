# Vercel deployment

The Next.js dashboard lives in **`web/`**. Vercel must use that folder as the project root.

## One-time setup (fixes 404 NOT_FOUND)

1. Open [Vercel Dashboard](https://vercel.com) → **anchor-security-prep** project
2. Go to **Settings → General**
3. Find **Root Directory**
4. Click **Edit** → enter `web` → **Save**
5. Go to **Settings → General → Build & Development Settings**
6. Ensure **Framework Preset** is **Next.js** (auto-detected)
7. Clear any custom **Build Command** or **Output Directory** overrides (leave empty for defaults)
8. **Deployments** → latest deployment → **⋯** → **Redeploy**

## Expected build settings (after Root Directory = `web`)

| Setting | Value |
|---------|-------|
| Root Directory | `web` |
| Framework | Next.js |
| Build Command | `next build` (default) |
| Output Directory | *(empty — Vercel manages this)* |
| Install Command | `npm install` (default) |

## Verify

After redeploy, these URLs should return **200**:

- https://anchor-security-prep.vercel.app/
- https://anchor-security-prep.vercel.app/compare
- https://anchor-security-prep.vercel.app/rules

## Why 404 happens

If **Root Directory** is `.` (repo root), Vercel builds from the wrong location or uses legacy routing. The Rust CLI and examples are at repo root; only `web/` is the Next.js app.

Do **not** add a root `vercel.json` with `"builds"` — it breaks routing on modern Vercel.
