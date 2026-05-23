# Anchor Security Prep

**Pre-audit security for Anchor developers.** Open-source static analyzer with 26 Solana-native rules, SARIF export, GitHub Actions, and an interactive report dashboard.

Built for the Solana Foundation Developer Tooling grant program.

## Features

- **26 security rules** — signers, PDAs, CPI, tokens, DoS patterns, admin exposure
- **CLI** — `scan`, `rules`, `init`, `doctor`, `baseline`, `audit-prep`
- **SARIF + Markdown + JSON** reports
- **Web dashboard** — interactive findings explorer at `localhost:3001`
- **GitHub Action template** via `anchor-prep init`

## Quickstart

```powershell
# CLI
cd anchor-security-prep
cargo build -p anchor-prep
cargo run -p anchor-prep -- scan examples/vulnerable-program --format all
cargo run -p anchor-prep -- rules --json
cargo run -p anchor-prep -- init

# Web dashboard
cd web
npm install
npm run dev
# Open http://localhost:3001
```

## Project structure

```
anchor-security-prep/
  cli/                 # Rust scanner
  web/                 # Next.js dashboard
  examples/            # Vulnerable + clean programs
  fixtures/            # Per-rule regression snippets (ASP001–ASP026)
  templates/           # GitHub Action workflow
  docs/                # Grant + schema docs
```

## Deploy dashboard (Vercel)

1. Push this repo to [GitHub](https://github.com/panagot/Anchor-Security-Prep)
2. Import the project in [Vercel](https://vercel.com/new)
3. Set **Root Directory** to `web`
4. Deploy — Compare, Rules, and sample reports work without the CLI

Live scanning requires the Rust CLI locally. The hosted demo uses bundled sample reports.

## Grant

See [docs/GRANT.md](docs/GRANT.md) for milestone and budget breakdown.

## License

MIT
