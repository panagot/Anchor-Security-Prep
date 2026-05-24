# Benchmark results



Published accuracy measurements for Anchor Security Prep. Updated: v0.2.



See [BENCHMARK.md](./BENCHMARK.md) for methodology.



---



## Phase 0 — Reference programs (author-controlled)



Scanned with 26 rules (`cargo run -p anchor-prep -- scan …`):



### examples/vulnerable-program



| Severity | Count |

|----------|------:|

| Critical | 7 |

| High | 22 |

| Medium | 9 |

| Low | 3 |

| **Total** | **41** |



**High/critical:** 29  

**Purpose:** Intentional anti-patterns for demo, CI, and documentation.



### examples/clean-program



| Severity | Count |

|----------|------:|

| Critical | 0 |

| High | 0 |

| Medium | 0 |

| Low | 1 |

| **Total** | **1** |



**High/critical:** 0  

**Purpose:** Hardened reference — demonstrates low noise on well-written code.



### Delta (signal demonstration)



| Metric | Vulnerable | Clean | Delta |

|--------|----------:|------:|------:|

| Total findings | 41 | 1 | 40 |

| High + critical | 29 | 0 | 29 |



---



## Phase 0 — Per-rule fixtures



Golden regression tests in `fixtures/asp*/bad.rs`:



| Fixture | Rule | Status |

|---------|------|--------|

| asp001 | ASP001 Missing signer | ✓ |

| asp002 | ASP002 Unchecked AccountInfo | ✓ |

| asp003 | ASP003 PDA bump | ✓ |

| asp004 | ASP004 Unsafe close | ✓ |

| asp005 | ASP005 Authority constraint | ✓ |

| asp006 | ASP006 Unvalidated CPI | ✓ |

| asp007 | ASP007 Missing mut | ✓ |

| asp008 | ASP008 Untyped sysvar | ✓ |

| asp009 | ASP009 Token constraints | ✓ |

| asp010 | ASP010 Unchecked owner | ✓ |

| asp011 | ASP011 init_if_needed | ✓ |

| asp012 | ASP012 Zero-copy | ✓ |

| asp015 | ASP015 Admin exposure | ✓ |

| asp017 | ASP017 Handler loop | ✓ |

| asp019 | ASP019 invoke_signed | ✓ |

| asp021 | ASP021 Unchecked math | ✓ |

| asp022 | ASP022 Token-2022 | ✓ |

| asp023 | ASP023 Zero pubkey | ✓ |

| asp024 | ASP024 ATA constraint | ✓ |

| asp025 | ASP025 Remaining accounts | ✓ |

| asp026 | ASP026 Discriminator | ✓ |



**Coverage:** 21 / 26 rules (81%) — 26 / 26 by M2 finish  

**Remaining:** ASP013, ASP014, ASP016, ASP018, ASP020



Run: `cargo test -p anchor-prep` (24 tests)



---



## Phase 0 — False positive controls



| Mechanism | Status |

|-----------|--------|

| `baseline save` / `baseline diff` | ✓ Fingerprint = rule + file + line; exits 1 on new findings |

| Per-rule severity in catalog | ✓ |

| Issue template for FP reports | ✓ |

| Bundled SARIF on vulnerable sample | ✓ `public/samples/vulnerable-report.sarif` |

| Confidence scores per rule | Roadmap M1 |



---



## Phase 1 — External repos (May 2026)



Scanned [coral-xyz/sealevel-attacks](https://github.com/coral-xyz/sealevel-attacks) (public Anchor attack patterns, 35 `.rs` files):



| Metric | Value |

|--------|------:|

| Files scanned | 35 |

| Total findings | 50 |

| Critical | 4 |

| High | 43 |

| Medium | 3 |

| Low | 0 |

| High + critical | 47 |



**Top rules triggered:** ASP002 (AccountInfo), ASP009 (token binding), ASP006 (CPI), ASP015 (admin), ASP017 (loops)



**Interpretation:** Heuristic rules surface expected attack-class patterns across the corpus. Some **secure/reference** variants also trigger findings (e.g. raw native patterns, admin-like names) — use `baseline diff` to suppress known noise in CI.



**Reproduce:**



```bash

git clone --depth 1 https://github.com/coral-xyz/sealevel-attacks .benchmark/sealevel-attacks

cargo run -p anchor-prep -- scan .benchmark/sealevel-attacks --format json

```



| Repo | Status | Notes |

|------|--------|-------|

| coral-xyz/sealevel-attacks | ✓ Scanned | 50 findings, 35 files |

| anchor/examples | Planned | Upstream example programs |

| Community hackathon repos | Planned | With maintainer permission |



---



## Honest limitations



1. Phase 0 uses **author-written** examples — strong for regression, not independent validation alone.

2. Phase 1 shows **heuristic recall** on public attack corpus; secure variants may include FPs — baseline diff is the mitigation.

3. Static rules **cannot** prove security — they surface likely issues for human review.

4. Rules without fixtures yet (ASP013, ASP014, ASP016, ASP018, ASP020) — planned for M2 finish.



---



## Reproduce locally



```bash

cargo test -p anchor-prep

cargo run -p anchor-prep -- scan examples/vulnerable-program --format json

cargo run -p anchor-prep -- scan examples/clean-program --format json

```



Dashboard mirrors Phase 0 via bundled reports at `/compare` (server-rendered on first paint).

