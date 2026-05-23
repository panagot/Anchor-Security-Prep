# Accuracy benchmark

Anchor Security Prep measures signal quality on **bundled reference programs** today and will expand to **open-source Anchor repos** during the grant period.

## Methodology

| Phase | Scope | Goal |
|-------|-------|------|
| **Phase 0** (now) | `examples/vulnerable-program`, `examples/clean-program` | Regression golden tests; demo impact stats |
| **Phase 1** (grant M1) | 10 popular OSS Anchor programs | Document false positives / confirmed patterns |
| **Phase 2** (grant M2+) | Community submissions via GitHub Issues | Monthly tuning cycle |

**Metrics tracked:**

- **True positives (TP):** Findings that match a known anti-pattern or audit finding
- **False positives (FP):** Findings dismissed with justification (logged in Issues)
- **False negatives (FN):** Known bad patterns not flagged (fixture gaps → new rules)

**Suppression:** `anchor-prep baseline save` + `baseline diff` — CI fails only on *new* findings vs baseline.

---

## Phase 0 results (bundled examples)

Scanned with **26 rules** (`cargo run -p anchor-prep -- scan …`):

### `examples/vulnerable-program`

| Severity | Count |
|----------|------:|
| Critical | 7 |
| High | 22 |
| Medium | 9 |
| Low | 3 |
| **Total** | **41** |

High/critical: **29** — intentional anti-patterns for grant demo and rule validation.

### `examples/clean-program`

| Severity | Count |
|----------|------:|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 1 |
| **Total** | **1** |

High/critical: **0** — hardened reference implementation.

### Signal ratio (demo pair)

| Metric | Value |
|--------|------:|
| Findings delta (vulnerable − clean) | 40 |
| High/critical delta | 29 |
| Rules with fixtures | 26 / 26 |

---

## Phase 1 target repos (grant period)

Candidates for public benchmark (read-only scan, FP/FN notes in GitHub Discussions):

1. [coral-xyz/anchor](https://github.com/coral-xyz/anchor) — tests & examples
2. [solana-labs/solana-program-library](https://github.com/solana-labs/solana-program-library) — token programs
3. [metaplex-foundation/mpl-token-metadata](https://github.com/metaplex-foundation/metaplex-program-library) — NFT patterns
4. Community hackathon winners (with maintainer permission)
5. Sealevel Attacks reference implementations

**Deliverable:** `docs/BENCHMARK_RESULTS.md` updated quarterly with FP rate estimate per rule category.

---

## False-positive handling

1. File issue using [False positive template](../.github/ISSUE_TEMPLATE/false-positive.yml)
2. Maintainer triages within 7 days (48h for critical tool bugs)
3. Fix: rule tuning, severity downgrade, or `baseline` documentation
4. Regression fixture added if applicable

---

## Confidence model (roadmap)

| Level | Meaning |
|-------|---------|
| **High** | Pattern match + fixture + documented exploit class |
| **Medium** | Heuristic; review recommended |
| **Low** | Informational; may need manual confirmation |

Per-rule confidence scores ship in v1.0 (grant M1).
