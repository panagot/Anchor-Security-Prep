# Anchor Security Prep — Grant Proposal

**Project:** Anchor Security Prep (`anchor-prep`)  
**Track:** [Solana Foundation Developer Tooling Grant](https://solana.org/grants-funding)  
**Total request:** $10,000 USD  
**Application form:** https://share.hsforms.com/1GE1hYdApQGaDiCgaiWMXHA5lohw  
**Reviewer walkthrough (2 min):** https://anchor-security-prep.vercel.app/reviewer  
**Milestone detail:** [M1](https://anchor-security-prep.vercel.app/m1) · [M2](https://anchor-security-prep.vercel.app/m2)

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

**Why fund now:** Audits remain inaccessible for indie devs and hackathon teams. STRIDE subsidizes audits for larger protocols — but bugs must be caught earlier. We have a working prototype with SARIF, GitHub Actions scaffolding, and a grant-reviewer demo path. Funding closes the last 10–15% of M1/M2 and funds maintenance + adoption so the tool becomes default pre-audit hygiene in the ecosystem.

**Public-good positioning:** Complement STRIDE and professional audits — reduce audit scope, catch issues in CI, lower overall ecosystem exploit risk.

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
| Rule fixtures | 21/26 (M1 target: 26/26) | `cargo test -p anchor-prep` — 24 tests |
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

| Category | Amount | % | Purpose |
|----------|--------|---|---------|
| **M1 — CLI core v1.0** | $2,500 | 25% | 26 rules, fixtures, SARIF, release binaries |
| **M2 — CI + dashboard v1.0** | $3,000 | 30% | GitHub Action, dashboard, reviewer path |
| **Maintenance (6 months)** | $2,500 | 25% | Issue triage, FP fixes, Anchor compat |
| **Adoption** | $2,000 | 20% | Docs, tutorials, community outreach |
| **Total** | **$10,000** | 100% | |

Payment structure: M1 and M2 on acceptance criteria met. Maintenance: monthly ($417/mo × 6). Adoption: 25% of adoption budget per 25% of each adoption metric achieved (see §10).

---

## 8. Development milestones

> **Detailed review pages:** [M1](https://anchor-security-prep.vercel.app/m1) · [M2](https://anchor-security-prep.vercel.app/m2)

### Milestone 1 — CLI core v1.0 ($2,500)

**Goal:** Production-grade open-source CLI that catches exploit-class Anchor patterns before audit.

**Deliverables:**

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | 26 production rules (ASP001–ASP026) | ✓ Done |
| 2 | Per-rule fixture regression tests | ◐ 21/26 |
| 3 | Commands: scan, rules, doctor, baseline, audit-prep, init, fix | ✓ Done |
| 4 | JSON, Markdown, SARIF 2.1 export | ✓ Done |
| 5 | `.anchor-prep.toml` configuration | ✓ Done |
| 6 | Vulnerable + clean example programs | ✓ Done |
| 7 | Release binaries (linux / mac / win) | ✓ v0.2.0 |
| 8 | External benchmark Phase 1 | ✓ sealevel-attacks |

**Acceptance criteria (all must pass for M1 payout):**

1. `cargo test -p anchor-prep` passes — fixtures + integration (24+ tests)
2. Vulnerable example: ≥40 findings, ≥29 high/critical
3. Clean example: 0 high/critical
4. Published release binaries on GitHub Releases
5. 26/26 rule fixtures with golden regression tests

**Remaining M1 work (~10%):** Complete fixtures ASP022–ASP026; expand benchmark to 3+ OSS repos.

**Status:** ~90% complete

---

### Milestone 2 — CI + dashboard v1.0 ($3,000)

**Goal:** Embed security into every PR; grant reviewers evaluate value in under 2 minutes without install.

**Deliverables:**

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | Composite GitHub Action + workflow template | ✓ Done |
| 2 | SARIF upload with rule catalog + helpUri | ✓ Done |
| 3 | Web dashboard (compare, scan, report, rules) | ✓ Live on Vercel |
| 4 | Integrations page with CI snippets | ✓ Done |
| 5 | Grant reviewer walkthrough (`/reviewer`) | ✓ Done |
| 6 | M1/M2 milestone detail pages | ✓ Done |
| 7 | Server-rendered compare (no empty demo state) | ✓ Done |
| 8 | Audit checklist export from reports | ◐ Planned |
| 9 | End-to-end demo video | ◐ Planned |

**Acceptance criteria (all must pass for M2 payout):**

1. `anchor-prep init` scaffolds working GitHub Actions workflow
2. Hosted demo URL for grant reviewers (https://anchor-security-prep.vercel.app/reviewer)
3. Compare → report → integrations path completable in under 2 minutes
4. SARIF export works on bundled sample report

**Remaining M2 work (~5%):** Audit checklist export; optional demo video.

**Status:** ~95% complete

---

## 9. Maintenance milestones ($2,500 — 6 × $417/mo)

| Month | Scope | Deliverable |
|-------|-------|-------------|
| 1–2 | Issue triage, false-positive reports, Anchor 0.30+ compat | FP triage log in GitHub Issues |
| 3–4 | New rules from community requests, rule tuning | 5+ new rules or major rule improvements |
| 5–6 | Anchor version matrix, documentation refresh | Updated compat matrix + CHANGELOG |

**SLA:**

- Critical bugs: 48-hour response
- Anchor minor version compatibility: within 2 weeks of release
- False positive triage: monthly review cycle

---

## 10. Adoption milestones ($2,000)

| Metric | Target (6 mo) | Tracking |
|--------|---------------|----------|
| GitHub stars | 100 | GitHub API |
| Public CI integrations | 20 | GitHub search `anchor-prep` in workflows |
| Programs scanned (unique repos) | 50 | CLI telemetry + Action logs |
| Findings resolved (community reports) | 25 | Issue labels `fixed-by-user` |

**Payment:** 25% of adoption budget ($500) per 25% of each metric achieved.

**Adoption levers:**

- Colosseum / hackathon default pre-submission check
- Solana Stack tutorials and Discord outreach
- Threads documenting bugs caught pre-audit
- Optional audit-firm “pre-audit ready” badge partnership

---

## 11. Timeline

| Phase | Weeks | Focus |
|-------|-------|-------|
| **Pre-grant (done)** | — | v0.2.0, live demo, 21/26 fixtures, Phase 1 benchmark |
| **Grant Month 1** | 1–4 | Close M1 (26/26 fixtures), community beta thread |
| **Grant Month 2** | 5–8 | Close M2 (audit checklist export), expand benchmark |
| **Grant Month 3–4** | 9–16 | 5+ new rules, FP tuning from community |
| **Grant Month 5–6** | 17–24 | Anchor compat matrix, adoption push, docs refresh |

**Community feedback milestone (grant period):**

- Public beta thread (Solana Discord / Reddit) with vulnerable vs clean examples
- Collect 5+ external feedback items; document in GitHub Issues
- Incorporate top false-positive reports into rule tuning (Month 1–2)

---

## 12. Team — Why us?

**Solo indie developer** with Solana ecosystem experience building developer tools as public goods.

**Edge over competition:**

1. **Shipped before funding** — v0.2.0 demonstrates delivery: CLI, 26 rules, SARIF, live dashboard, CI templates, GitHub release with binaries. Not a slide deck — working software.
2. **Reviewer-first UX** — `/reviewer`, `/compare`, `/m1`, `/m2` let SF evaluators verify value in 2 minutes without Rust toolchain.
3. **Pre-audit positioning** — Complements STRIDE and audits; targets the underserved indie/hackathon segment commercial tools ignore.
4. **Open governance** — MIT license, CONTRIBUTING.md, rule bounties, openness to co-maintainers.

**Why not wait for commercial tools?** Sec3 X-Ray and similar products serve funded protocols. Indie devs need a free, CI-native alternative that embeds security into daily workflow — not a sales call.

---

## 13. Risks & mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| False positives kill adoption | Medium | Baseline diff, monthly tuning, public benchmark with honest FP notes |
| Solo maintainer bus factor | Medium | CONTRIBUTING.md, rule bounties, co-maintainer outreach |
| Overlap with emerging OSS tools | Low | SARIF + CI scaffold + fix guidance + pre-audit positioning |
| Anchor version churn | High | Version matrix in CI; 2-week compat SLA |
| Heuristic misses novel exploits | Medium | Position as pre-audit complement; expand rules from audit reports |

---

## 14. Open source commitment

- **License:** MIT — all code, rules, and documentation
- **Repository:** https://github.com/panagot/Anchor-Security-Prep (public)
- **No telemetry by default** — optional adoption metrics via GitHub Action logs and community reports
- **Grant deliverables remain open** — no proprietary fork or paid tier planned

---

## 15. Appendix — related documents

| Document | Purpose |
|----------|---------|
| [BENCHMARK_RESULTS.md](./BENCHMARK_RESULTS.md) | Phase 1 external scan results |
| [BENCHMARK.md](./BENCHMARK.md) | Benchmark methodology + Phase 2 plan |
| [INCIDENTS.md](./INCIDENTS.md) | Exploit → rule mapping |
| [EXPLOITS.md](./EXPLOITS.md) | Rule → real-world exploit examples |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contributor / co-maintainer onboarding |

**Grant review (web):** https://anchor-security-prep.vercel.app/reviewer · [M1](https://anchor-security-prep.vercel.app/m1) · [M2](https://anchor-security-prep.vercel.app/m2)

---

## 16. Grant reviewer quick path

1. **2 min overview:** https://anchor-security-prep.vercel.app/reviewer  
2. **Side-by-side proof:** https://anchor-security-prep.vercel.app/compare  
3. **If approving — milestone detail:** [M1](https://anchor-security-prep.vercel.app/m1) · [M2](https://anchor-security-prep.vercel.app/m2)  
4. **Full proposal:** this document  
5. **Repo:** https://github.com/panagot/Anchor-Security-Prep
