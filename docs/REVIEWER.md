# Grant reviewer guide (~2 minutes)

**Live demo:** https://anchor-security-prep.vercel.app/review  
**Repo:** https://github.com/panagot/Anchor-Security-Prep

This page is the fastest path to evaluate Anchor Security Prep for the Solana Foundation Developer Tooling grant.

---

## Step 1 — See the value (30 sec)

Open **[Compare](https://anchor-security-prep.vercel.app/compare)**:

| Program | Findings | High / Critical |
|---------|----------|-----------------|
| Intentionally vulnerable example | 41 | 29 |
| Hardened reference | 1 | 0 |

Same 26-rule engine. Different Anchor patterns. This is the core value prop: **catch exploit-class issues before a $15K–$100K audit**.

---

## Step 2 — Inspect findings (45 sec)

1. From Compare, note top critical issues (ASP001 missing signer, ASP004 unsafe close, etc.)
2. Open **[ASP001 rule doc](https://anchor-security-prep.vercel.app/rules/asp001)** — vulnerable vs hardened pattern
3. Open **[sample report](https://anchor-security-prep.vercel.app/scan?demo=vulnerable)** — fix hints per finding

---

## Step 3 — CI / SARIF story (30 sec)

Open **[Integrations](https://anchor-security-prep.vercel.app/integrations)**:

- `anchor-prep init` scaffolds GitHub Actions
- SARIF export → GitHub Code Scanning
- `baseline diff` fails CI only on **new** findings (file:line fingerprint)

---

## Step 4 — Verify claims (15 sec)

| Claim | Evidence |
|-------|----------|
| 26 rules | [Rule catalog](https://anchor-security-prep.vercel.app/rules) |
| 15/26 fixtures today | `fixtures/asp*` + `cargo test -p anchor-prep` |
| Accuracy methodology | [docs/BENCHMARK.md](./BENCHMARK.md) · [docs/BENCHMARK_RESULTS.md](./BENCHMARK_RESULTS.md) |
| Exploit mapping | [docs/INCIDENTS.md](./INCIDENTS.md) |
| Grant budget | [docs/GRANT.md](./GRANT.md) |

---

## What we are NOT claiming

- Not a replacement for professional audit
- Not formal verification — static heuristics with known FP tradeoffs
- Not all rules have golden fixtures yet (15/26 today, 26/26 by M1)

---

## Clone locally (optional)

```bash
git clone https://github.com/panagot/Anchor-Security-Prep.git
cd Anchor-Security-Prep
cargo test -p anchor-prep
cargo run -p anchor-prep -- scan examples/vulnerable-program --format all
npm install && npm run dev
```

---

## Application materials

- [docs/APPLICATION.md](./APPLICATION.md) — form field draft
- [docs/GRANT.md](./GRANT.md) — milestones & budget
