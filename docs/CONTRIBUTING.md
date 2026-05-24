# Contributing to Anchor Security Prep

Thank you for helping improve Solana security tooling. This project is MIT-licensed and maintained as a **public good**.

## Ways to contribute

| Area | How |
|------|-----|
| **False positive reports** | [False positive issue](../../issues/new?template=false-positive.yml) |
| **New rules** | Propose via [Rule request](../../issues/new?template=rule-request.yml) + fixture PR |
| **Docs & examples** | Improve `docs/`, rule pages, vulnerable/clean examples |
| **Benchmarks** | Scan an OSS Anchor repo; share FP/FN notes (no private code) |

## Development setup

```bash
git clone https://github.com/panagot/Anchor-Security-Prep.git
cd Anchor-Security-Prep

# CLI
cargo test -p anchor-prep
cargo run -p anchor-prep -- scan examples/vulnerable-program

# Dashboard
npm install
npm run dev
```

## Adding a rule

1. Implement in `cli/src/rules.rs` or `cli/src/rules_extra.rs`
2. Add fixture under `fixtures/asp0XX/`
3. Register in `cli/src/rule_catalog.rs`
4. Add test in `cli/src/fixtures_test.rs`
5. Regenerate `public/rules.json`: `cargo run -p anchor-prep -- rules --json > public/rules.json`

## False positive policy

We take signal quality seriously. If a rule fires incorrectly:

1. Open a false-positive issue with code snippet and expected behavior
2. We triage within **7 days** (48h for tool crashes)
3. Outcomes: rule fix, severity adjustment, or baseline documentation

## Governance

Currently solo-maintained with openness to co-maintainers. Major decisions discussed in GitHub Issues/Discussions. All merges require passing CI (`cargo test`, `npm run build`).

## Code of conduct

Be respectful. Security research and constructive criticism welcome. No harassment, spam, or disclosure of unpatched live exploits without responsible coordination.

## Roadmap alignment

Contributions focus on: accuracy benchmarks, rule expansion (→ 50 rules), Anchor version compatibility, and adoption (hackathon/CI integrations).
