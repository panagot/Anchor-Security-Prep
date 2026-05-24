# COPY THIS ENTIRE FILE INTO GOOGLE DOCS
# Template: https://docs.google.com/document/d/1dEncOVru7WJm_IwnjqpXf3BlV9PyYLfxIuJwPeSWy14/edit
# Follow SF Developer Tooling format exactly (sections below).

---

Anchor Security Prep — Developer Tooling Grant Proposal

Project: Anchor Security Prep (anchor-prep)
Applicant: [Your name / Anchor Security Prep]
Total request: $10,000 USD
License: MIT (fully open source)
Repository: https://github.com/panagot/Anchor-Security-Prep
Live demo: https://anchor-security-prep.vercel.app
Grant reviewer path (~2 min): https://anchor-security-prep.vercel.app/reviewer
Milestone detail: https://anchor-security-prep.vercel.app/m1 (Begin) · https://anchor-security-prep.vercel.app/m2 (Finish)


═══════════════════════════════════════════════════════════════
1. OVERVIEW OF ECOSYSTEM IMPACT
═══════════════════════════════════════════════════════════════

Anchor Security Prep is a free, MIT-licensed pre-audit static analyzer for Anchor and Solana programs. It is a public good: no paywall, no proprietary tier, all rules and documentation open source.

THE PROBLEM

Professional Solana security audits cost $15,000–$100,000+. Programs like STRIDE subsidize audits for larger protocols — but indie Anchor developers, hackathon teams, Colosseum submissions, and early-stage projects ship code without structured pre-audit security signal. Existing tools are either commercial (Sec3 X-Ray), generic (Rust Clippy), or lack CI-native integration with fix guidance.

HOW THIS BENEFITS SOLANA DEVELOPERS (specific examples)

• Solo Anchor devs — Run one command before mainnet: anchor-prep scan . catches missing signers, unsafe CPI, PDA issues, and token constraint bugs with per-finding fix hints.

• Hackathon / Colosseum teams — Gate PRs with --fail-on high in GitHub Actions without a $15K audit budget. SARIF export surfaces findings inline on pull requests.

• Small protocols preparing for audit — Reduce audit scope and cost by fixing exploit-class issues before engaging Zellic, OtterSec, or Neodyme.

• CI maintainers — anchor-prep init scaffolds a working workflow; baseline diff fails CI only on new findings (suppresses known false positives).

• Solana Foundation / ecosystem — Lower exploit surface area by embedding security into daily developer workflow, complementing STRIDE rather than replacing professional audits.

PROOF OF IMPACT (already shipped — v0.2.0)

• 26 Anchor-native security rules (ASP001–ASP026)
• Vulnerable example: 41 findings, 29 high/critical
• Clean reference: 0 high/critical (same rule engine)
• Live dashboard — reviewers verify value in under 2 minutes without installing Rust
• GitHub release v0.2.0 with linux/mac/win binaries
• Phase 1 external benchmark: coral-xyz/sealevel-attacks (50 findings, 35 files)
• 21/26 rules have golden regression fixtures today (26/26 by M2 finish)

RULE SOURCES

Rules are derived from public sources including Sealevel Attacks (coral-xyz), Zellic/OtterSec/Neodyme audit patterns, and 2025–2026 exploit post-mortems — documented in the GitHub repo (EXPLOITS.md, INCIDENTS.md).

PUBLIC GOOD COMMITMENT

• MIT license on all code, rules, and docs
• No telemetry by default
• 12 months dedicated upkeep SLA (included in Milestone 2 — Finish)
• Quantifiable adoption metrics (see Milestone 2 — tracked during 12-month upkeep)
• Production release by grant end (v1.0 CLI + dashboard)


═══════════════════════════════════════════════════════════════
2. PRODUCT DESIGN
═══════════════════════════════════════════════════════════════

2.1 WHAT WE ARE BUILDING

A two-part developer tool:

(A) Rust CLI (anchor-prep) — scans Anchor program source for 26 security rules; outputs JSON, Markdown, and SARIF 2.1; supports severity gates, baseline diff, and audit-prep checklists.

(B) Next.js dashboard — interactive report explorer, side-by-side vulnerable vs clean comparison, searchable rule catalog with bad/good patterns, CI integrations page.

2.2 ARCHITECTURE

Input: Anchor workspace (programs/**/*.rs)

Processing: anchor-prep CLI (Rust)
  → Parse Rust/Anchor source via static heuristics
  → Run 26 rules (ASP001–ASP026)
  → Emit JSON · Markdown · SARIF 2.1

Outputs:
  → GitHub Actions CI (scan on PR, upload SARIF to Code Scanning, baseline diff)
  → Next.js dashboard (compare, report explorer, rule docs, /reviewer grant path)

2.3 TECHNOLOGY STACK

• Rust 1.70+ — CLI scanner, rule engine, SARIF export
• Next.js 15 — dashboard and grant reviewer pages
• GitHub Actions — CI integration, release binaries
• SARIF 2.1 — GitHub Code Scanning native format
• Vercel — hosted demo for grant reviewers and community

2.4 KEY FEATURES & WORKFLOW INTEGRATION

CLI commands:
  scan <path>          — analyze Anchor workspace
  rules [--json]       — list rule catalog
  init [path]          — scaffold .github/workflows/anchor-prep.yml
  baseline save/diff   — suppress known findings; fail on regressions
  audit-prep <path>    — generate pre-audit checklist
  doctor [path]        — verify project layout and toolchain

Developer workflow:
  1. Developer runs anchor-prep init (once)
  2. Every PR triggers scan with --fail-on high
  3. SARIF uploaded → findings appear inline on GitHub
  4. baseline diff prevents CI noise from known acceptable findings

Rule coverage (26 rules):
  • Account validation (ASP001–ASP010, ASP026): signers, PDAs, AccountInfo
  • CPI & programs (ASP006, ASP019, ASP025): unvalidated CPI, remaining accounts
  • Token & SPL (ASP009, ASP018, ASP022, ASP024): mint constraints, Token-2022
  • Lifecycle & admin (ASP004, ASP011, ASP015): unsafe close, init_if_needed
  • Logic & DoS (ASP016, ASP017, ASP021, ASP023): unbounded Vec, unchecked math

2.5 PROOF-OF-CONCEPT (SHIPPED — v0.2.0)

We have a working prototype, not a slide deck:

• CLI with 26 rules and 10 commands — DONE
• SARIF export + GitHub Actions template — DONE
• Live dashboard at anchor-security-prep.vercel.app — DONE
• Vulnerable vs clean comparison demo — DONE
• 21/26 rule fixtures with cargo test -p anchor-prep (24 tests) — DONE
• v0.2.0 release with linux/mac/win binaries — DONE

Grant funding delivers production v1.0 and 12 months of dedicated upkeep — two milestones at $5,000 each.

2.6 SIGNAL QUALITY & FALSE-POSITIVE PLAN

Static analyzers live or die on signal-to-noise. Grant-funded work includes:

• Baseline diff — suppress known findings; CI fails only on regressions
• Severity calibration — per-rule confidence + documented FP cases
• Accuracy benchmark — 10 open-source Anchor programs; publish FP/FN notes
• Monthly tuning cycle — community FP reports triaged in maintenance milestone

Target by grant end: 40–50 rules grounded in public audit reports.

Honest limitation: Not a replacement for professional audit. Heuristic analysis may produce false positives — baseline diff is the mitigation.


═══════════════════════════════════════════════════════════════
3. BUDGET BREAKDOWN (MILESTONES)
═══════════════════════════════════════════════════════════════

TOTAL REQUEST: $10,000 USD — TWO MILESTONES ONLY

| Milestone | Amount | When paid |
|-----------|--------|-----------|
| M1 — Begin | $5,000 | CLI beta + public website + CI foundation accepted |
| M2 — Finish | $5,000 | Production v1.0 + 12 months dedicated upkeep begins |
| Total | $10,000 | |

Included in grant: Rust CLI, public website (Vercel), CI/SARIF integration, and 12 months of dedicated upkeep (issue triage, false-positive tuning, Anchor compatibility, documentation, adoption outreach).

───────────────────────────────────────────────────────────────
MILESTONE 1 — BEGIN
Amount: $5,000 (paid on acceptance)
Status: ~85% complete (v0.2.0 prototype shipped)
Detail page: https://anchor-security-prep.vercel.app/m1
───────────────────────────────────────────────────────────────

Kick off the grant with a working CLI, live public website, and CI scaffolding.

Deliverables:
  ✓ Rust CLI with 26 Anchor security rules (ASP001–ASP026)
  ✓ 21/26 golden regression fixtures (cargo test -p anchor-prep — 24 tests)
  ✓ JSON, Markdown, and SARIF 2.1 export
  ✓ Core commands: scan, rules, doctor, baseline, init
  ✓ Public website / dashboard on Vercel (anchor-security-prep.vercel.app)
  ✓ Compare, rules catalog, report explorer, integrations, /reviewer pages
  ✓ GitHub Actions workflow template + composite action
  ✓ Vulnerable + clean example programs (41 vs 0 high/critical)
  ✓ v0.2.0 release binaries (linux / mac / win)
  ✓ Phase 1 external benchmark (coral-xyz/sealevel-attacks)

Testing plan:
  • Website accessible without install — compare demo works in browser
  • cargo test -p anchor-prep passes (24+ tests)
  • anchor-prep init scaffolds working CI workflow
  • SARIF export verified on bundled sample report

Acceptance criteria (M1 payout):
  1. Website live at anchor-security-prep.vercel.app
  2. Compare: ≥40 findings on vulnerable; 0 high/critical on clean
  3. cargo test -p anchor-prep passes (21/26 fixtures today)
  4. anchor-prep init scaffolds CI workflow
  5. SARIF export on bundled sample

───────────────────────────────────────────────────────────────
MILESTONE 2 — FINISH (includes 12 months dedicated upkeep)
Amount: $5,000 (paid on acceptance)
Detail page: https://anchor-security-prep.vercel.app/m2
───────────────────────────────────────────────────────────────

Complete production v1.0 across CLI, website, and CI. Then deliver 12 months of dedicated upkeep.

Production v1.0 deliverables:
  ◐ 26/26 rule fixtures with golden tests (21/26 today — ASP013, 014, 016, 018, 020 remaining)
  ◐ Add 10–15 new high-impact rules with fixtures (remaining accounts, account reload after CPI, Token-2022 hooks, admin migration)
  ◐ Public accuracy benchmark report on 3–5 OSS Anchor repos (FP/FN notes published)
  ◐ Per-rule confidence scores + config/allow suppression (.anchor-prep.toml)
  ◐ Audit checklist export from reports
  ◐ Website v1.0 polish (reviewer, milestones, docs pages)
  ◐ v1.0 release binaries on GitHub (v0.2.0 today)
  ◐ VS Code extension scaffolding (optional — scan-on-save hook)

12 months dedicated upkeep (starts on M2 acceptance):
  • Issue triage and bug fixes — 48-hour response for critical bugs
  • False-positive tuning — monthly review cycle
  • Anchor 0.30+ and minor version compatibility — tested within 2 weeks of release
  • Documentation, release notes, and CHANGELOG updates
  • Adoption outreach — hackathons, Discord, Solana Stack tutorials, CI integrations

Adoption metrics tracked during 12-month upkeep:

| Metric                          | Target (12 mo) | How we track                    |
|---------------------------------|----------------|---------------------------------|
| GitHub stars                    | ≥75            | GitHub API                      |
| Public CI integrations          | ≥15            | GitHub search anchor-prep       |
| Programs scanned (unique repos) | ≥40            | Action logs + community reports |
| Findings resolved by users      | ≥25            | Issue label fixed-by-user       |

Or equivalent traction (e.g. Solana Stack mention, Colosseum/hackathon default recommendation).

Acceptance criteria (M2 payout):
  1. 26/26 rule fixtures; cargo test -p anchor-prep passes
  2. Public benchmark report on ≥3 OSS repos with FP/FN notes
  3. Vulnerable ≥40 findings / ≥29 high+critical; clean 0 high/critical
  4. Website v1.0 with /reviewer, /m1, /m2, /integrations live
  5. Published v1.0 release binaries
  6. 12-month upkeep plan documented; adoption metrics tracking live


═══════════════════════════════════════════════════════════════
4. TEAM — WHY US
═══════════════════════════════════════════════════════════════

Solo indie developer with Solana ecosystem experience building developer tools as public goods.

Domain credibility:
  1. Shipped before funding — v0.2.0: Rust CLI (26 rules), SARIF, public website, CI templates, release binaries — working software, not a concept deck
  2. Audit-informed rules — Mapped to Sealevel Attacks, Zellic/OtterSec/Neodyme patterns, and 2025–2026 post-mortems; Phase 1 benchmark on coral-xyz/sealevel-attacks published
  3. Open-source public goods — Full-stack Rust + Next.js, MIT-licensed from day one; CONTRIBUTING.md ready for co-maintainers
  4. Reviewer-first delivery — Built /reviewer, /compare, /m1, /m2 so SF evaluators verify value in 2 min without Rust toolchain
  5. Ecosystem participation — Active in Solana developer communities; tool positioned for hackathon/Colosseum pre-submission

[Optional: add links to Anchor programs you have built or shipped publicly]

Open source: Yes — MIT license, public GitHub repository, no proprietary fork planned.


═══════════════════════════════════════════════════════════════
5. RISKS & MITIGATIONS
═══════════════════════════════════════════════════════════════

| Risk                         | Mitigation                                              |
|------------------------------|---------------------------------------------------------|
| False positives kill adoption| Baseline diff, monthly tuning, public benchmark           |
| Solo maintainer bus factor   | CONTRIBUTING.md, rule bounties, co-maintainer outreach    |
| Overlap with other OSS tools | SARIF + CI scaffold + fix guidance + pre-audit focus    |
| Anchor version churn (incl. 0.30+) | Version matrix in CI; Anchor 0.30+ tested within 2 weeks of release |
| Misses novel exploits        | Position as pre-audit complement; rules from audit reports|


═══════════════════════════════════════════════════════════════
6. TIMELINE
═══════════════════════════════════════════════════════════════

Pre-grant (done):   v0.2.0, live website, 21/26 fixtures, Phase 1 benchmark
M1 — Begin:         Accept begin deliverables → $5,000 payout
Months 1–3:         Close v1.0: fixtures, benchmark, website polish
M2 — Finish:        v1.0 release → $5,000 payout → 12-month upkeep begins
Months 4–12:        Dedicated upkeep: FP tuning, Anchor compat, adoption


═══════════════════════════════════════════════════════════════
7. GRANT REVIEWER QUICK PATH
═══════════════════════════════════════════════════════════════

1. Overview (~2 min):  https://anchor-security-prep.vercel.app/reviewer
2. Side-by-side proof: https://anchor-security-prep.vercel.app/compare
3. M1 detail:          https://anchor-security-prep.vercel.app/m1
4. M2 detail:          https://anchor-security-prep.vercel.app/m2
5. Repository:         https://github.com/panagot/Anchor-Security-Prep
