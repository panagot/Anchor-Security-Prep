# Changelog

## [0.2.0] — 2026-05-23

### Added
- 26 Anchor security rules (ASP001–ASP026)
- SARIF, JSON, Markdown export
- Commands: scan, rules, init, doctor, baseline, audit-prep, fix, test-rules
- Next.js dashboard with compare, rules docs, report explorer
- 15 per-rule regression fixtures
- GitHub Actions CI + composite action template
- Release workflow for linux/mac/win binaries
- Grant docs: APPLICATION, BENCHMARK, INCIDENTS, REVIEWER, CONTRIBUTING

### Fixed
- Baseline diff uses file:line fingerprint; fails CI on new findings
- Vercel deployment (Next.js at repo root)
- Composite action release URL

### Live
- https://anchor-security-prep.vercel.app/

## [0.1.0] — Initial prototype

- Core scanner + vulnerable example
