# Anchor Security Prep — Grant Proposal

**Project:** Anchor Security Prep (`anchor-prep`)  
**Track:** [Solana Foundation Developer Tooling Grant](https://solana.org/grants-funding)  
**Total request:** $10,000 USD  
**Application:** https://share.hsforms.com/1GE1hYdApQGaDiCgaiWMXHA5lohw

---

## Problem

Professional Solana audits cost $15K–$100K+. Programs like STRIDE subsidize audits for protocols above $10M TVL — but **indie Anchor developers, hackathon teams, and early-stage projects** ship code without any pre-audit security signal.

Existing tools are either commercial (Sec3 X-Ray), generic (Rust clippy), or post-deployment focused. There is no **free, open-source, Anchor-native static analyzer** with CI integration and fix guidance.

## Solution

Anchor Security Prep is a public-good pre-audit scanner that:

- Runs **26 Solana-native rules** (signers, PDAs, CPI, tokens, DoS, admin exposure)
- Exports **SARIF** for GitHub Code Scanning
- Scaffolds **GitHub Actions** via `anchor-prep init`
- Provides an **interactive dashboard** with side-by-side vulnerable vs clean comparison
- Includes **per-rule documentation** with bad/good patterns and fix hints

## Who benefits

| Audience | Impact |
|----------|--------|
| Solo Anchor devs | Catch critical bugs before mainnet |
| Hackathon teams | Security gate without audit budget |
| Small protocols | Reduce audit scope and cost |
| CI maintainers | SARIF inline on PRs |

## Differentiation

| Tool | Anchor-native | Open source | SARIF/CI | Fix guidance |
|------|--------------|-------------|----------|--------------|
| Anchor Security Prep | ✓ | ✓ MIT | ✓ | ✓ per finding |
| Sec3 X-Ray | ✓ | ✗ | Partial | ✓ |
| Clippy | ✗ | ✓ | ✗ | Generic Rust |
| Manual audit | ✓ | N/A | N/A | Expensive |

---

## Budget breakdown

| Category | Amount | Purpose |
|----------|--------|---------|
| **Development** | $5,500 | CLI v1.0, GitHub Action, dashboard, rule docs, fixtures |
| **Maintenance** | $2,500 | 6 months issue triage, false-positive fixes, Anchor compat |
| **Adoption** | $2,000 | Docs, tutorials, community outreach, release binaries |

---

## Development milestones

### Milestone 1 — CLI core v1.0 ($2,500)

**Deliverables:**
- 26 production rules with per-rule fixture regression tests
- Commands: `scan`, `rules`, `doctor`, `baseline`, `audit-prep`, `init`
- JSON, Markdown, SARIF output
- `.anchor-prep.toml` configuration
- Expanded vulnerable + clean example programs

**Acceptance criteria:**
- `cargo test -p anchor-prep` passes (fixtures + integration)
- Vulnerable example: 20+ findings, 8+ high/critical
- Clean example: 0 high/critical
- Published release binaries (linux/mac/win)

**Status:** ~85% complete (v0.2 prototype)

### Milestone 2 — CI + dashboard v1.0 ($3,000)

**Deliverables:**
- Composite GitHub Action (`.github/action/action.yml`)
- SARIF upload to Code Scanning with full rule catalog + helpUri
- Web dashboard deployed (compare, scan, report, rule docs)
- Integrations page with copy-paste CI snippets
- Audit checklist export from reports

**Acceptance criteria:**
- `anchor-prep init` scaffolds working workflow
- End-to-end demo: PR → scan → SARIF → dashboard report
- Hosted demo URL for grant reviewers

**Status:** ~75% complete (local dashboard works; deploy + release pending)

---

## Maintenance milestones ($2,500 — 6 × $417/mo)

| Month | Scope |
|-------|-------|
| 1–2 | Issue triage, false-positive reports, Anchor 0.30 compat |
| 3–4 | New rules from community requests, rule tuning |
| 5–6 | Anchor version matrix updates, documentation refresh |

---

## Adoption milestones ($2,000)

| Metric | Target (6 mo) | Tracking |
|--------|---------------|----------|
| GitHub stars | 100 | GitHub API |
| Public CI integrations | 20 | GitHub search `anchor-prep` in workflows |
| Weekly scans | 500 | Action telemetry + CLI download counts |

Payment: 25% of adoption budget per 25% of each metric achieved.

---

## Current prototype (v0.2)

Already built and demo-ready locally:

```
anchor-security-prep/
  cli/           # Rust scanner — 26 rules, SARIF, 10 commands
  app/           # Next.js dashboard — scan, compare, report, rules
  public/        # Static assets + bundled sample reports
  fixtures/      # Per-rule regression snippets (ASP001–ASP026)
  examples/      # Vulnerable (20+ findings) + clean (0 high/crit)
  templates/     # GitHub Action workflow
  docs/          # Grant proposal, schema
```

**Demo:** http://localhost:3001 — Compare → Report → Export SARIF → Integrations

---

## Maintenance SLA

- Response to critical bugs: 48 hours
- Anchor minor version compatibility: within 2 weeks of release
- False positive triage: monthly review cycle
- All code MIT licensed, public GitHub repository

---

## Team

Solo/indie developer with Solana ecosystem experience. Prototype demonstrates delivery capability before grant funding.
