import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CopyButton } from "@/components/CopyButton";

const CLI = `anchor-prep scan ./my-project --format all --fail-on high
anchor-prep baseline save . --out .anchor-prep/baseline.json
anchor-prep baseline diff . --baseline .anchor-prep/baseline.json
anchor-prep rules --json
anchor-prep init`;

const GHA = `name: Anchor Security Prep

on:
  pull_request:
    paths:
      - "programs/**"
      - "Anchor.toml"

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: cargo build --release -p anchor-prep
      - run: cargo run --release -p anchor-prep -- scan . --format all --fail-on high
      - uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: reports/report.sarif`;

export const metadata: Metadata = {
  title: "CI & CLI integration",
  description: "GitHub Actions scaffold, SARIF export, baseline diff — embed Anchor Security Prep in every PR.",
};

export default function IntegrationsPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        refId="INT-003"
        title="Integrations"
        subtitle="Wire Anchor Security Prep into local development, CI, and pre-audit workflows."
      />

      <section className="panel">
        <div className="panel-inner space-y-3">
          <h2 className="display text-lg font-bold">Workflow</h2>
          <div className="grid gap-2 text-xs md:grid-cols-3">
            {["Local scan", "CI gate", "SARIF export"].map((step, i) => (
              <div key={step} className="border border-[var(--line)] bg-black/20 p-3">
                <p className="label mb-1">Step {i + 1}</p>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-inner space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="display text-lg font-bold">CLI commands</h2>
            <CopyButton text={CLI} />
          </div>
          <pre className="code-block p-4 text-xs leading-relaxed">{CLI}</pre>
        </div>
      </section>

      <section className="panel">
        <div className="panel-inner space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="display text-lg font-bold">GitHub Actions</h2>
            <CopyButton text={GHA} label="Copy YAML" />
          </div>
          <p className="text-xs leading-relaxed text-[var(--ink-muted)]">
            Run <code className="text-[var(--amber)]">anchor-prep init</code> to scaffold the workflow. Use{" "}
            <code className="text-[var(--amber)]">baseline diff</code> to suppress known findings and fail only on regressions.
          </p>
          <pre className="code-block p-4 text-xs leading-relaxed overflow-x-auto">{GHA}</pre>
        </div>
      </section>
    </div>
  );
}
