# Anchor Security Prep — Grant Proposal

**Project:** Anchor Security Prep (`anchor-prep`)  
**Track:** [Solana Foundation Developer Tooling Grant](https://solana.org/grants-funding)  
**Total request:** $10,000 USD  
**Application:** https://share.hsforms.com/1GE1hYdApQGaDiCgaiWMXHA5lohw

---

## Elevator pitch (for application form)

> Anchor Security Prep is a free, MIT-licensed pre-audit static analyzer that catches common exploit patterns in Anchor programs before expensive audits or mainnet launches. With 26+ Anchor-native rules, SARIF export for GitHub Code Scanning, one-command CI setup, and per-finding fix guidance, it gives indie devs, hackathon teams, and early protocols audit-grade signal without the budget. Built as a public good to complement Solana's STRIDE subsidies and reduce overall ecosystem risk.

### Why fund this now

1. **Timely gap** — Audits remain inaccessible for most builders; rising exploit costs make proactive tooling urgent.
2. **Proven prototype + delivery** — v0.2 is functional (CLI, live dashboard, fixtures); funding accelerates to production and adoption.
3. **High leverage** — SARIF/CI integration embeds security into daily workflows; open-source rules create compounding value for Solana devs.

**Live demo:** https://anchor-security-prep.vercel.app/ · **Repo:** https://github.com/panagot/Anchor-Security-Prep

**Application draft:** [docs/APPLICATION.md](./APPLICATION.md) · **Benchmark:** [docs/BENCHMARK.md](./BENCHMARK.md) · **Exploits:** [docs/EXPLOITS.md](./EXPLOITS.md) · **Contributing:** [docs/CONTRIBUTING.md](./CONTRIBUTING.md)

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

**Wedge vs. emerging OSS tools** (solana_fender, radar, Soteria, anchor-constraints-analyzer): we combine **SARIF + GitHub Actions scaffold + per-finding fix guidance + live dashboard demo** in one MIT-licensed package aimed at pre-audit workflows, not post-deploy monitoring alone.

**Positioning:** complement audits and STRIDE — reduce audit scope and cost; target hackathon/Colosseum pre-submission as default security check.

---

## Signal quality & false-positive plan

Static analyzers live or die on signal-to-noise. Grant-funded work includes:

| Deliverable | Purpose |
|-------------|---------|
| **Baseline diff** (`baseline save` / `baseline diff`) | Suppress known findings; fail only on regressions |
| **Severity calibration** | Per-rule confidence + documented false-positive cases |
| **Accuracy benchmark** | Run against 10 open-source Anchor programs; publish FP/FN notes |
| **Rule metadata** | "Exploit examples in the wild" + TVL-impact notes per rule |
| **Monthly tuning cycle** | Community FP reports triaged; rules adjusted in maintenance milestone |

**Target by grant end:** 40–50 rules with strong regression coverage, grounded in public audit reports (Zellic, OtterSec, etc.).

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
- Vulnerable example: 40+ findings, 29 high/critical
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

**Status:** ~90% complete — dashboard live at https://anchor-security-prep.vercel.app/; release binaries pending

---

## Community feedback milestone (grant period)

- Public beta thread (Solana Discord / Reddit) with vulnerable vs clean examples
- Collect 5+ external feedback items; document in GitHub Issues
- Incorporate top false-positive reports into rule tuning (Month 1–2 maintenance)

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
| Programs scanned (unique repos) | 50 | CLI telemetry + Action logs |
| Findings resolved (community reports) | 25 | Issue labels `fixed-by-user` |

Payment: 25% of adoption budget per 25% of each metric achieved.

**Adoption levers:** Colosseum/hackathon default check · Solana Stack tutorials · Twitter threads on bugs caught pre-audit · optional audit-firm "pre-audit" badge partnership.

---

## Current prototype (v0.2)

Already built and demo-ready locally:

```
anchor-security-prep/
  cli/           # Rust scanner — 26 rules, SARIF, 10 commands
  app/           # Next.js dashboard (Vercel deploy root)
  fixtures/      # Per-rule regression snippets (ASP001–ASP026)
  examples/      # Vulnerable (20+ findings) + clean (0 high/crit)
  templates/     # GitHub Action workflow
  docs/          # Grant proposal, schema
```

**Demo:** https://anchor-security-prep.vercel.app/ — Compare → Report → Export SARIF → Integrations

---

## Risks & mitigations (proactive)

| Risk | Mitigation |
|------|------------|
| False positives kill adoption | Baseline diff, tuning cycle, accuracy benchmark on real repos |
| Solo maintainer | Open CONTRIBUTING.md; rule bounties; openness to co-maintainers |
| Overlap with other tools | SARIF + CI scaffold + fix guidance + pre-audit positioning |
| Anchor version churn | Version matrix in CI; compat within 2 weeks of Anchor releases |

---

## Pre-submission priorities (4 weeks)

1. External eyes on vulnerable vs clean examples (Discord/Reddit beta)
2. Accuracy metrics + FP suppression story (this doc + benchmark issue)
3. Dashboard polish — impact stats, screenshots for application
4. 2–3 recent Solana exploits mappable to existing rules (with write-up)
5. Release binaries (linux/mac/win) for M1 acceptance

---

## Maintenance SLA

- Response to critical bugs: 48 hours
- Anchor minor version compatibility: within 2 weeks of release
- False positive triage: monthly review cycle
- All code MIT licensed, public GitHub repository

---

## Team

Solo/indie developer with Solana ecosystem experience. Prototype demonstrates delivery capability before grant funding — CLI, fixtures, CI templates, and **live dashboard** already shipped. Committed to public-good maintenance, contributor-friendly governance, and transparency on false-positive tuning.
