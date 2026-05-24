# Beta feedback — outreach draft

Post to **Solana Discord** (#developer-tools or #security) and **r/solana** when ready.

---

## Title

Feedback wanted: free pre-audit static analyzer for Anchor (26 rules, SARIF, live demo)

## Body

I built **Anchor Security Prep** — an open-source (MIT) static analyzer that catches common Anchor exploit patterns *before* an audit:

- 26 rules (signers, PDAs, CPI, tokens, admin exposure, etc.)
- SARIF export for GitHub Code Scanning
- One-command CI setup (`anchor-prep init`)
- Live dashboard with vulnerable vs clean comparison

**Try it (no install):** https://anchor-security-prep.vercel.app/reviewer

**Compare demo:** https://anchor-security-prep.vercel.app/compare

**Repo:** https://github.com/panagot/Anchor-Security-Prep

```bash
cargo run -p anchor-prep -- scan examples/vulnerable-program --format all
# → 41 findings (7 critical, 22 high) on intentional bad example

cargo run -p anchor-prep -- scan examples/clean-program --format all
# → 0 high/critical on hardened reference
```

I'm applying for Solana Foundation Developer Tooling grant funding and need **honest feedback**:

1. Would you use this in CI before an audit?
2. Any false positives on your code? (open an issue — template provided)
3. What rules are missing for your workflow?

Applying as a public good to complement STRIDE/audits — not replace them. Thanks!

---

## Follow-up

- Link issue templates for FP and rule requests
- Pin GitHub Discussion for beta thread
- Track responses in grant adoption metrics
