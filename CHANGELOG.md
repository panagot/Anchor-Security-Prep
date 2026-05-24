# Changelog

## [0.2.0] — 2026-05-24

### Added

- Reviewer walkthrough (`/reviewer`) with stepper, checklist, trust strip
- Server-rendered compare page (bundled reports on first paint — no "No data." flash)
- Rules catalog search + severity filter + "Full doc" badges
- 6 new rule fixtures (ASP005, 007, 012, 017, 022, 024) — **21/26** coverage, 24 tests
- Phase 1 external benchmark: coral-xyz/sealevel-attacks (50 findings)
- Bundled SARIF export for vulnerable sample report
- OpenGraph/Twitter preview image (`public/og.svg`)
- `/api/cli-status` for accurate Vercel demo detection

### Changed

- All demo CTAs route to bundled sample reports (not disabled `/scan` form)
- Per-page SEO metadata on documentation and demo routes
- Footer links and docs index updated

### Fixed

- Compare page SSR for crawlers and text-fetch reviewers
- Scan page no longer shows enabled "Run scan" on Vercel when CLI unavailable

### Live

- https://anchor-security-prep.vercel.app/reviewer

## [0.2.0-beta] — 2026-05-23

### Added

- 26 Anchor security rules (ASP001–ASP026)
- SARIF, JSON, Markdown export
- Commands: scan, rules, init, doctor, baseline, audit-prep, fix, test-rules
- Next.js dashboard with compare, rules docs, report explorer
- 15 per-rule regression fixtures
- GitHub Actions CI + composite action template
- Release workflow for linux/mac/win binaries
- Docs: BENCHMARK, INCIDENTS, EXPLOITS, CONTRIBUTING

### Fixed

- Baseline diff uses file:line fingerprint; fails CI on new findings
- Vercel deployment (Next.js at repo root)
- Composite action release URL

## [0.1.0] — Initial prototype

- Core scanner + vulnerable example
