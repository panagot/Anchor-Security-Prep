# Benchmark results

Published accuracy measurements for Anchor Security Prep. Updated: grant prep v0.2.

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
**Purpose:** Intentional anti-patterns for demo, CI, and grant review.

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
| asp006 | ASP006 Unvalidated CPI | ✓ |
| asp008 | ASP008 Untyped sysvar | ✓ |
| asp009 | ASP009 Token constraints | ✓ |
| asp010 | ASP010 Unchecked owner | ✓ |
| asp011 | ASP011 init_if_needed | ✓ |
| asp015 | ASP015 Admin exposure | ✓ |
| asp019 | ASP019 invoke_signed | ✓ |
| asp021 | ASP021 Unchecked math | ✓ |
| asp023 | ASP023 Zero pubkey | ✓ |
| asp025 | ASP025 Remaining accounts | ✓ |
| asp026 | ASP026 Discriminator | ✓ |

**Coverage:** 15 / 26 rules (58%) — M1 target: 26 / 26

Run: `cargo test -p anchor-prep`

---

## Phase 0 — False positive controls

| Mechanism | Status |
|-----------|--------|
| `baseline save` / `baseline diff` | ✓ Fingerprint = rule + file + line; exits 1 on new findings |
| Per-rule severity in catalog | ✓ |
| Issue template for FP reports | ✓ |
| Confidence scores per rule | Roadmap M1 |

---

## Phase 1 — External repos (planned)

| Repo | Status | Notes |
|------|--------|-------|
| coral-xyz/sealevel-attacks | Planned | Public attack patterns |
| anchor/examples | Planned | Upstream example programs |
| Community hackathon repos | Planned | With maintainer permission |

**Deliverable:** FP count + notes per repo in this file (grant M1).

---

## Honest limitations

1. Phase 0 uses **author-written** examples — strong for regression, not independent validation.
2. Static rules **cannot** prove security — they surface likely issues for human review.
3. Some rules (ASP007 missing mut) have narrow heuristics — being expanded in M1.

---

## Reproduce locally

```bash
cargo test -p anchor-prep
cargo run -p anchor-prep -- scan examples/vulnerable-program --format json
cargo run -p anchor-prep -- scan examples/clean-program --format json
```

Dashboard mirrors these via bundled reports at `/compare`.
