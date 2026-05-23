# Incident case studies

How Anchor Security Prep rules map to **documented Solana attack classes**. These are educational mappings — not claims that ASP would have prevented specific live incidents end-to-end.

---

## 1. Unlimited mint / fake collateral (Cashio-class, 2022)

**Attack class:** Attacker supplies fake collateral accounts; protocol accepts unverified account types or missing owner/signer checks.

| ASP rules | What they catch |
|-----------|-----------------|
| ASP002 | Raw `AccountInfo` without typed wrapper or `/// CHECK` |
| ASP010 | `UncheckedAccount` without owner validation |
| ASP009 | Token account without mint/authority binding |
| ASP026 | Custom account missing `#[account]` discriminator |

**Would have caught?** Partial — patterns that accept arbitrary accounts without constraints. Would **not** catch novel economic design flaws.

**Demo:** [Compare vulnerable sample](https://anchor-security-prep.vercel.app/compare) — ASP002, ASP009 fire on bundled example.

---

## 2. Signer bypass on admin / withdraw (common audit finding)

**Attack class:** State-mutating instructions callable by anyone because no `Signer` is required.

| ASP rules | What they catch |
|-----------|-----------------|
| ASP001 | Missing signer on mutating instructions |
| ASP005 | Authority-like accounts without `has_one` |
| ASP015 | Admin-only handlers without privileged signer |

**Would have caught?** **Yes** for straightforward missing-signer patterns — highest-confidence rule family.

**Fixture:** `fixtures/asp001/bad.rs` · **Rule doc:** [/rules/asp001](https://anchor-security-prep.vercel.app/rules/asp001)

---

## 3. CPI / confused deputy (Sealevel Attacks)

**Attack class:** Program invokes another program without validating the target program ID — attacker substitutes malicious program.

| ASP rules | What they catch |
|-----------|-----------------|
| ASP006 | CPI without typed `Program<'info, T>` or ID check |
| ASP019 | `invoke_signed` without validated seeds |
| ASP025 | Unchecked `remaining_accounts` iteration |

**Reference:** [coral-xyz/sealevel-attacks](https://github.com/coral-xyz/sealevel-attacks)

**Fixture:** `fixtures/asp006/bad.rs`

---

## 4. Account close / lamport drain (Sealevel — Closing Accounts)

**Attack class:** Manual lamport manipulation or improper close lets attacker steal rent or redirect funds.

| ASP rules | What they catch |
|-----------|-----------------|
| ASP004 | Manual close without Anchor `close =` constraint |

**Fixture:** `fixtures/asp004/bad.rs`

---

## 5. Integer overflow on balances

**Attack class:** Unchecked arithmetic wraps token balances — inflation or unexpected zero-out.

| ASP rules | What they catch |
|-----------|-----------------|
| ASP021 | Arithmetic on amounts without `checked_*` |

**Fixture:** `fixtures/asp021/bad.rs`

---

## Summary table

| Incident class | Primary ASP | Confidence |
|----------------|-------------|------------|
| Missing signer | ASP001, ASP015 | High |
| Fake / unchecked accounts | ASP002, ASP010 | High |
| Bad CPI target | ASP006, ASP019 | Medium–High |
| Unsafe close | ASP004 | High |
| Token binding | ASP009 | Medium |
| Remaining accounts | ASP025 | Medium |
| Unchecked math | ASP021 | Medium |

---

## Grant-period work

- Add 2–3 more named write-ups from public post-mortems
- Link each to benchmark scan results in [BENCHMARK_RESULTS.md](./BENCHMARK_RESULTS.md)
- Community submissions via [rule request template](../.github/ISSUE_TEMPLATE/rule-request.yml)
