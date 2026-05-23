# Vercel deployment

The Next.js dashboard lives at the **repository root** (`app/`, `package.json`, etc.).

## Deploy

1. Import [panagot/Anchor-Security-Prep](https://github.com/panagot/Anchor-Security-Prep) at [vercel.com/new](https://vercel.com/new)
2. **Root Directory:** leave as `.` (default)
3. **Framework:** Next.js (auto-detected)
4. Deploy — no environment variables required

## Verify

- https://anchor-security-prep.vercel.app/
- https://anchor-security-prep.vercel.app/compare
- https://anchor-security-prep.vercel.app/rules

## Notes

- Live scanning (`/api/scan`) requires the Rust CLI and only works locally
- Hosted demo uses bundled reports in `public/samples/`
- If you previously set Root Directory to `web`, reset it to `.` and redeploy
