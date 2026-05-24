# Anchor Security Prep — Grant Proposal

**Project:** Anchor Security Prep (`anchor-prep`)  
**Track:** [Solana Foundation Developer Tooling Grant](https://solana.org/grants-funding)  
**Total request:** $10,000 USD  
**Application form:** https://share.hsforms.com/1GE1hYdApQGaDiCgaiWMXHA5lohw  
**Reviewer walkthrough (2 min):** https://anchor-security-prep.vercel.app/reviewer  
**Milestone detail:** [M1 Begin](https://anchor-security-prep.vercel.app/m1) · [M2 Finish](https://anchor-security-prep.vercel.app/m2)

> **For Google Doc submission:** Copy sections 1–12 below into a shared Google Doc per [SF Developer Tooling guidelines](https://tinyurl.com/y2abys36). Paste the Google Doc link in the form field **“Your project / idea”**. Use written answers in the form fields — do not paste raw URLs except where the form asks for them.

---

## 1. Executive summary

Anchor Security Prep is a **free, MIT-licensed pre-audit static analyzer** for Anchor and Solana programs. It catches exploit-class patterns — missing signers, unsafe CPI, PDA bump issues, token constraint bugs, admin exposure, DoS vectors — **before** a $15K–$100K professional audit or mainnet launch.

| | |
|---|---|
| **Ask** | $10,000 USD |
| **License** | MIT — fully open source |
| **On-chain** | N/A (off-chain developer tool) |
| **Status** | v0.2.0 shipped — CLI, dashboard, CI templates, live demo |
| **Rules** | 26 active (ASP001–ASP026) |
| **Proof** | 41 findings / 29 high+critical on vulnerable sample; 0 high/critical on clean reference |

| **Fixtures** | 21/26 golden regression tests today; 26/26 by M2 finish |

**Why fund now:** Audits remain inaccessible for indie devs and hackathon teams. We have a working prototype with CLI, **public website**, SARIF, and CI scaffolding. Funding delivers production v1.0 and **12 months of dedicated upkeep** — two milestones at $5,000 each.

**Public-good positioning:** Complement STRIDE and professional audits — reduce audit scope, catch issues in CI, lower overall ecosystem exploit risk.

**Rule sources:** Rules are derived from public material including [Sealevel Attacks](https://github.com/coral-xyz/sealevel-attacks), Zellic/OtterSec/Neodyme audit patterns, and 2025–2026 exploit post-mortems — mapped in [EXPLOITS.md](./EXPLOITS.md) and [INCIDENTS.md](./INCIDENTS.md).

---

## 2. Problem statement

### 2.1 The audit gap

Professional Solana security audits typically cost **$15,000–$100,000+**. Programs like STRIDE subsidize audits for protocols above certain TVL thresholds — but **indie Anchor developers, hackathon teams, Colosseum submissions, and early-stage protocols** ship code without any structured pre-audit security signal.

Consequences:

- Critical bugs reach testnet/mainnet undetected
- Audit spend concentrates on remediation of preventable issues
- Hackathon and grant submissions lack a standard security gate
- Ecosystem exploit costs continue to rise (see [INCIDENTS.md](./INCIDENTS.md))

### 2.2 Gap in existing tooling

| Tool | Anchor-native | Open source | SARIF / CI | Fix guidance | Pre-audit focus |
|------|--------------|-------------|------------|--------------|-----------------|
| **Anchor Security Prep** | ✓ | ✓ MIT | ✓ | ✓ per finding | ✓ |
| Sec3 X-Ray | ✓ | ✗ | Partial | ✓ | Partial |
| Rust Clippy | ✗ | ✓ | ✗ | Generic Rust | ✗ |
| solana_fender / radar / Soteria | Partial | Varies | Varies | Varies | Often post-deploy |
| Manual audit | ✓ | N/A | N/A | ✓ | ✓ (expensive) |

No existing tool combines **Anchor-native rules + SARIF + one-command CI scaffold + per-finding fix guidance + live comparison demo** in a single MIT-licensed package aimed at pre-audit workflows.

---

## 3. Solution

### 3.1 What we build

**Rust CLI (`anchor-prep`)** — scans Anchor program source for 26 security rules; outputs JSON, Markdown, and SARIF 2.1; supports severity gates (`--fail-on high`), baseline diff, and audit-prep checklists.

**Next.js dashboard** — interactive report explorer, side-by-side vulnerable vs clean comparison, searchable rule catalog with bad/good patterns, integrations page with copy-paste CI snippets.

**CI integration** — `anchor-prep init` scaffolds `.github/workflows/anchor-prep.yml`; composite GitHub Action; SARIF upload to GitHub Code Scanning with full rule catalog and `helpUri` links.

### 3.2 Rule coverage (26 rules)

| Category | Rules | Examples |
|----------|-------|----------|
| Account validation | ASP001–ASP010, ASP026 | Missing signer, unchecked AccountInfo, PDA bump |
| CPI & programs | ASP006, ASP019, ASP025 | Unvalidated CPI, invoke_signed, remaining accounts |
| Token & SPL | ASP009, ASP018, ASP022, ASP024 | Mint constraints, Token-2022, ATA binding |
| Lifecycle & admin | ASP004, ASP011, ASP015 | Unsafe close, init_if_needed, admin exposure |
| Logic & DoS | ASP016, ASP017, ASP021, ASP023 | Unbounded Vec, handler loops, unchecked math |

Full catalog: `anchor-prep rules --json` or https://anchor-security-prep.vercel.app/rules

### 3.3 Who benefits

| Audience | Impact |
|----------|--------|
| Solo Anchor devs | Catch critical bugs before mainnet |
| Hackathon / Colosseum teams | Security gate without audit budget |
| Small protocols | Reduce audit scope and cost |
| CI maintainers | SARIF inline annotations on PRs |
| Solana Foundation | Lower ecosystem exploit surface area |

---

## 4. Technical architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Anchor workspace (programs/**/*.rs)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  anchor-prep CLI (Rust)                                     │
│  · Parse Rust/Anchor AST heuristics                         │
│  · Run 26 rules (ASP001–ASP026)                             │
│  · Emit JSON · Markdown · SARIF 2.1                        │
└──────────┬───────────────────────────────┬──────────────────┘
           │                               │
           ▼                               ▼
┌──────────────────────┐      ┌───────────────────────────────┐
│  GitHub Actions CI   │      │  Next.js dashboard (Vercel)   │
│  · scan on PR        │      │  · /compare · /report · /rules│
│  · upload SARIF      │      │  · /reviewer · /m1 · /m2      │
│  · baseline diff     │      └───────────────────────────────┘
└──────────────────────┘
```

**Repository layout:**

```
Anchor-Security-Prep/
├── cli/           # Rust scanner — anchor-prep binary
├── app/           # Next.js dashboard (Vercel deploy root)
├── fixtures/      # Per-rule regression snippets (ASP001–ASP026)
├── examples/
│   ├── vulnerable-program/   # 41 findings, 29 high/critical
│   └── clean-program/        # 0 high/critical
├── templates/     # GitHub Action workflow template
└── docs/          # Grant proposal, benchmarks, application
```

**Key commands:**

| Command | Purpose |
|---------|---------|
| `scan <path>` | Analyze Anchor workspace |
| `rules [--json]` | List rule catalog |
| `init [path]` | Scaffold GitHub Actions workflow |
| `baseline save/diff` | Suppress known findings; fail on regressions |
| `audit-prep <path>` | Generate pre-audit checklist |
| `doctor [path]` | Verify project layout and toolchain |

---

## 5. Traction & proof (pre-funding)

| Metric | Value | How to verify |
|--------|-------|---------------|
| Release | v0.2.0 | GitHub Releases — linux/mac/win binaries |
| Vulnerable demo | 41 findings, 29 high/critical | https://anchor-security-prep.vercel.app/compare |
| Clean reference | 0 high/critical | Same URL |
| Rule fixtures | 21/26 today (ASP013, 014, 016, 018, 020 remaining) | `cargo test -p anchor-prep` — 24 tests |
| External benchmark | 50 findings, 35 files | [BENCHMARK_RESULTS.md](./BENCHMARK_RESULTS.md) — coral-xyz/sealevel-attacks |
| CI | Passing | `.github/workflows/ci.yml` |
| SARIF export | Working on bundled sample | Sample report → Export SARIF |
| Grant review path | ~2 min | https://anchor-security-prep.vercel.app/reviewer |

---

## 6. Signal quality & false-positive plan

Static analyzers live or die on signal-to-noise. Grant-funded work includes:

| Deliverable | Purpose |
|-------------|---------|
| **Baseline diff** (`baseline save` / `baseline diff`) | Suppress known findings; CI fails only on regressions |
| **Severity calibration** | Per-rule confidence + documented false-positive cases |
| **Accuracy benchmark** | Run against 10 open-source Anchor programs; publish FP/FN notes |
| **Rule metadata** | Exploit examples in the wild + impact notes per rule ([EXPLOITS.md](./EXPLOITS.md)) |
| **Monthly tuning cycle** | Community FP reports triaged; rules adjusted in maintenance milestone |

**Target by grant end:** 40–50 rules with strong regression coverage, grounded in public audit reports (Zellic, OtterSec, Neodyme, etc.).

**Honest limitation:** This is not a replacement for professional audit. Heuristic static analysis will produce false positives on some secure code — baseline diff and documented tuning are the mitigation.

---

## 7. Budget breakdown ($10,000 USD)

| Milestone | Amount | When paid |
|-----------|--------|-----------|
| **M1 — Begin** | $5,000 | CLI beta, public website, CI foundation accepted |
| **M2 — Finish** | $5,000 | Production v1.0 + 12 months dedicated upkeep begins |
| **Total** | **$10,000** | |

**Payment structure:** Two milestones only. M1 pays on begin deliverables (working CLI, live website, CI scaffold). M2 pays on production v1.0 completion and start of the 12-month upkeep SLA.

**Included in the grant:** Public website (Next.js dashboard on Vercel), CLI, CI integration, and **12 months of dedicated upkeep** (issue triage, false-positive tuning, Anchor compatibility, documentation, adoption outreach).

> **Detailed review pages:** [M1 Begin](https://anchor-security-prep.vercel.app/m1) · [M2 Finish](https://anchor-security-prep.vercel.app/m2)

---

## 8. Milestone 1 — Begin ($5,000)

**Goal:** Launch the grant with a working CLI, public website, and CI foundation — so developers and reviewers can use Anchor Security Prep immediately.

**Deliverables:**

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | Rust CLI with 26 Anchor security rules | ✓ Done |
| 2 | JSON, Markdown, SARIF 2.1 export | ✓ Done |
| 3 | Core commands: scan, rules, doctor, baseline, init | ✓ Done |
| 4 | **Public website / dashboard** on Vercel | ✓ Live |
| 5 | Compare, rules, report, integrations, /reviewer pages | ✓ Done |
| 6 | GitHub Actions workflow + composite action | ✓ Done |
| 7 | Vulnerable + clean example programs | ✓ Done |
| 8 | v0.2.0 release binaries (linux / mac / win) | ✓ Done |
| 9 | Phase 1 external benchmark | ✓ sealevel-attacks |

**Acceptance criteria (M1 payout):**

1. Website live at anchor-security-prep.vercel.app — no install required to evaluate
2. Compare demo: ≥40 findings on vulnerable; 0 high/critical on clean reference
3. `cargo test -p anchor-prep` passes (24+ tests)
4. `anchor-prep init` scaffolds working CI workflow
5. SARIF export works on bundled sample report

**Status:** ~85% complete (v0.2.0 prototype covers most begin deliverables)

---

## 9. Milestone 2 — Finish ($5,000)

**Goal:** Ship production v1.0 across CLI, website, and CI. Publish public accuracy data. Begin **12 months of dedicated upkeep**.

**Deliverables:**

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | 26/26 rule fixtures with golden regression tests | ◐ 21/26 today |
| 2 | Add 10–15 new high-impact rules (with fixtures) | ◐ Planned — remaining accounts, account reload after CPI, Token-2022 hooks, admin migration |
| 3 | **Public accuracy benchmark report** (3–5 OSS Anchor repos, FP/FN notes) | ◐ Phase 1 (sealevel-attacks) done |
| 4 | Per-rule confidence scores + config/allow suppression | ◐ Planned |
| 5 | Audit checklist export from reports | ◐ Planned |
| 6 | Website v1.0 (reviewer, milestones, integrations, rule docs) | ◐ Core live |
| 7 | v1.0 release binaries on GitHub | ◐ v0.2.0 today |
| 8 | VS Code extension scaffolding (scan-on-save hook) | ◐ Optional |
| 9 | **12 months upkeep** — triage, bugs, Anchor 0.30+ compat | Starts on M2 acceptance |
| 10 | **12 months upkeep** — FP tuning, docs, adoption outreach | Monthly cycle |

**Acceptance criteria (M2 payout):**

1. 26/26 rule fixtures; `cargo test -p anchor-prep` passes
2. Public benchmark report on ≥3 OSS Anchor repos with documented FP/FN notes
3. Vulnerable ≥40 findings / ≥29 high+critical; clean 0 high/critical
4. Website v1.0 with /reviewer, /m1, /m2, /integrations live
5. Published v1.0 release binaries
6. 12-month upkeep plan documented; adoption metrics tracked

**12-month upkeep SLA:**

- Critical bugs: 48-hour response
- Anchor 0.30+ and minor version compatibility: tested within 2 weeks of release
- False positive triage: monthly review cycle
- Documentation and release notes updated with each rule change

**Adoption targets (tracked during 12-month upkeep):**

| Metric | Target (12 mo) | Tracking |
|--------|----------------|----------|
| GitHub stars | ≥75 | GitHub API |
| Public CI integrations | ≥15 | GitHub search `anchor-prep` in workflows |
| Programs scanned (unique repos) | ≥40 | Action logs + community reports |
| Findings resolved by users | ≥25 | Issue label `fixed-by-user` |

*Or equivalent traction* — e.g. Solana Stack tutorial mention, Colosseum/hackathon default recommendation.

**Status:** Paid on v1.0 completion + upkeep period start

---

## 10. Timeline

| Phase | Focus |
|-------|-------|
| **Pre-grant (done)** | v0.2.0, live website, 21/26 fixtures, Phase 1 benchmark |
| **M1 — Begin** | Accept begin deliverables; payout $5,000 |
| **Months 1–3** | Close v1.0: 26/26 fixtures, benchmark expansion, website polish |
| **M2 — Finish** | v1.0 release; payout $5,000; **12-month upkeep begins** |
| **Months 4–12** | Upkeep: FP tuning, Anchor compat, new rules, adoption push |

**Community feedback (during upkeep):**

- Public beta thread (Solana Discord / Reddit)
- Collect external FP reports; triage monthly
- Incorporate top feedback into rule tuning

---

## 11. Team — Why us?

**Solo indie developer** with Solana ecosystem experience building developer tools as public goods.

**Domain credibility:**

1. **Shipped before funding** — v0.2.0 is working software: Rust CLI (26 rules), SARIF export, public website, CI templates, and GitHub release with linux/mac/win binaries — not a concept deck.
2. **Audit-informed rules** — Rule catalog mapped to [Sealevel Attacks](https://github.com/coral-xyz/sealevel-attacks), public Zellic/OtterSec/Neodyme patterns, and 2025–2026 post-mortems ([EXPLOITS.md](./EXPLOITS.md), [INCIDENTS.md](./INCIDENTS.md)). Phase 1 benchmark published on coral-xyz/sealevel-attacks.
3. **Open-source public goods track record** — Full-stack Rust + Next.js tool MIT-licensed from day one; CONTRIBUTING.md and rule fixture workflow ready for co-maintainers.
4. **Reviewer-first delivery** — Built `/reviewer`, `/compare`, `/m1`, `/m2` so SF evaluators verify value in 2 minutes without a Rust toolchain — uncommon for solo tooling grants.
5. **Ecosystem participation** — Active in Solana developer communities; tool positioned for hackathon/Colosseum pre-submission workflows.

**Why not wait for commercial tools?** Sec3 X-Ray and similar products serve funded protocols. Indie devs need a free, CI-native alternative that embeds security into daily workflow — not a sales call.

---

## 12. Risks & mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| False positives kill adoption | Medium | Baseline diff, monthly tuning, public benchmark with honest FP notes |
| Solo maintainer bus factor | Medium | CONTRIBUTING.md, rule bounties, co-maintainer outreach |
| Overlap with emerging OSS tools | Low | SARIF + CI scaffold + fix guidance + pre-audit positioning |
| Anchor version churn (incl. 0.30+) | High | Version matrix in CI; Anchor 0.30+ compat tested within 2 weeks of release |
| Heuristic misses novel exploits | Medium | Position as pre-audit complement; expand rules from audit reports |

---

## 13. Open source commitment

- **License:** MIT — all code, rules, and documentation
- **Repository:** https://github.com/panagot/Anchor-Security-Prep (public)
- **No telemetry by default** — optional adoption metrics via GitHub Action logs and community reports
- **Grant deliverables remain open** — no proprietary fork or paid tier planned

---

## 14. Appendix — related documents

| Document | Purpose |
|----------|---------|
| [BENCHMARK_RESULTS.md](./BENCHMARK_RESULTS.md) | Phase 1 external scan results |
| [BENCHMARK.md](./BENCHMARK.md) | Benchmark methodology + Phase 2 plan |
| [INCIDENTS.md](./INCIDENTS.md) | Exploit → rule mapping |
| [EXPLOITS.md](./EXPLOITS.md) | Rule → real-world exploit examples |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contributor / co-maintainer onboarding |

**Grant review (web):** https://anchor-security-prep.vercel.app/reviewer · [M1 Begin](https://anchor-security-prep.vercel.app/m1) · [M2 Finish](https://anchor-security-prep.vercel.app/m2)

---

## 15. Grant reviewer quick path

1. **2 min overview:** https://anchor-security-prep.vercel.app/reviewer  
2. **Side-by-side proof:** https://anchor-security-prep.vercel.app/compare  
3. **If approving — milestone detail:** [M1 Begin](https://anchor-security-prep.vercel.app/m1) · [M2 Finish](https://anchor-security-prep.vercel.app/m2)  
4. **Full proposal:** this document  
5. **Repo:** https://github.com/panagot/Anchor-Security-Prep
