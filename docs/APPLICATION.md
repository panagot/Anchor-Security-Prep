# Grant application — form field draft

Use when submitting: https://share.hsforms.com/1GE1hYdApQGaDiCgaiWMXHA5lohw

---

## Project name

Anchor Security Prep (`anchor-prep`)

## One-line summary

Free, MIT-licensed pre-audit static analyzer for Anchor programs with SARIF, CI scaffolding, and fix guidance.

## Elevator pitch (2–3 sentences)

Anchor Security Prep is a free, MIT-licensed pre-audit static analyzer that catches common exploit patterns in Anchor programs before expensive audits or mainnet launches. With 26+ Anchor-native rules, SARIF export for GitHub Code Scanning, one-command CI setup, and per-finding fix guidance, it gives indie devs, hackathon teams, and early protocols audit-grade signal without the budget. Built as a public good to complement Solana's STRIDE subsidies and reduce overall ecosystem risk.

## Why fund this now

1. **Timely gap** — Professional audits cost $15K–$100K+; most builders ship without pre-audit checks while exploit costs rise.
2. **Proven delivery** — v0.2 shipped: CLI (26 rules, SARIF), live dashboard, CI templates, regression fixtures. Live demo: https://anchor-security-prep.vercel.app/
3. **High leverage** — SARIF/CI embeds security in daily workflows; open-source rules compound for the ecosystem.

## Problem statement

Indie Anchor developers, hackathon teams, and early-stage protocols lack affordable pre-audit security signal. STRIDE subsidizes audits for larger protocols — but bugs must be caught *before* that stage.

## Solution

Rust CLI + Next.js dashboard. 26 rules covering signers, PDAs, CPI, tokens, DoS, admin exposure. Outputs JSON/MD/SARIF. `anchor-prep init` scaffolds GitHub Actions. Baseline diff for FP suppression.

## Traction / proof points

- **Live demo:** https://anchor-security-prep.vercel.app/
- **Repo:** https://github.com/panagot/Anchor-Security-Prep
- **Demo impact:** 41 findings on vulnerable example (7 critical, 22 high); 0 high/critical on clean reference
- **15/26 rule fixtures** with `cargo test -p anchor-prep`
- **CI:** GitHub Actions passing (18 Rust tests + Next.js build)
- **Grant review path:** https://anchor-security-prep.vercel.app/reviewer

## Differentiation

Open-source wedge: SARIF + GitHub Action scaffold + per-finding fix guidance + live comparison dashboard. Complements (not replaces) professional audits and commercial tools like Sec3 X-Ray.

## Budget requested

$10,000 USD — see [GRANT.md](./GRANT.md) for M1/M2/maintenance/adoption breakdown.

## Milestones (summary)

| Milestone | Amount | Status |
|-----------|--------|--------|
| M1 CLI v1.0 | $2,500 | ~85% |
| M2 CI + dashboard | $3,000 | ~90% (dashboard live) |
| Maintenance 6mo | $2,500 | Planned |
| Adoption | $2,000 | Planned |

## Risks & mitigations

- **False positives:** baseline diff, monthly tuning, public benchmark ([BENCHMARK.md](./BENCHMARK.md))
- **Solo maintainer:** CONTRIBUTING.md, rule bounties, openness to co-maintainers
- **Anchor churn:** version matrix in CI, 2-week compat SLA

## Links

| Resource | URL |
|----------|-----|
| Repository | https://github.com/panagot/Anchor-Security-Prep |
| Live demo | https://anchor-security-prep.vercel.app/ |
| Grant review (~2 min) | https://anchor-security-prep.vercel.app/reviewer |
| Compare demo | https://anchor-security-prep.vercel.app/compare |
| Grant doc | https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/GRANT.md |
