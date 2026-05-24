import type { Metadata } from "next";
import Link from "next/link";

import { GrantPathStepper } from "@/components/GrantPathStepper";
import { NextStepCta } from "@/components/NextStepCta";
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

const FEATURES = [
  {
    title: "Fail on high",
    body: "Exit non-zero when critical or high findings appear — gate merges before mainnet.",
  },
  {
    title: "Baseline diff",
    body: "Suppress known findings by file:line fingerprint. CI fails only on new regressions.",
  },
  {
    title: "SARIF export",
    body: "Upload to GitHub Code Scanning — inline annotations on every pull request.",
  },
];

export const metadata: Metadata = {
  title: "CI & CLI integration",
  description: "GitHub Actions scaffold, SARIF export, baseline diff — embed Anchor Security Prep in every PR.",
};

export default function IntegrationsPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <GrantPathStepper />

      <PageHeader
        refId="INT-003"
        title="Integrations"
        subtitle="Wire Anchor Security Prep into local development, CI, and pre-audit workflows — from first commit to audit handoff."
      />

      <section className="grid gap-3 md:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="panel">
            <div className="panel-inner">
              <h3 className="display text-sm font-bold text-[var(--amber)]">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{f.body}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="panel">
        <div className="panel-inner space-y-3">
          <h2 className="display text-lg font-bold">Workflow</h2>
          <div className="grid gap-2 text-sm md:grid-cols-3">
            {[
              { step: "Local scan", detail: "anchor-prep scan . --format all" },
              { step: "CI gate", detail: "--fail-on high on every PR" },
              { step: "SARIF upload", detail: "GitHub Code Scanning annotations" },
            ].map((item, i) => (
              <div key={item.step} className="border border-[var(--line)] bg-black/20 p-3">
                <p className="label mb-1">Step {i + 1}</p>
                <p className="font-semibold text-[var(--ink)]">{item.step}</p>
                <p className="mt-1 text-xs text-[var(--ink-muted)]">{item.detail}</p>
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="display text-lg font-bold">GitHub Actions</h2>
            <CopyButton text={GHA} label="Copy YAML" />
          </div>
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
            Run <code className="text-[var(--amber)]">anchor-prep init</code> to scaffold the workflow. Live CI config in{" "}
            <a
              href="https://github.com/panagot/Anchor-Security-Prep/blob/main/.github/workflows/ci.yml"
              className="text-[var(--amber)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              .github/workflows/ci.yml
            </a>
            .
          </p>
          <pre className="code-block overflow-x-auto p-4 text-xs leading-relaxed">{GHA}</pre>
        </div>
      </section>

      <NextStepCta
        step="Step 4 complete"
        next={{
          label: "Read grant proposal",
          href: "https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/GRANT.md",
          description: "Budget, milestones, adoption targets, and Phase 1 external benchmark plan.",
        }}
      />

      <div className="flex flex-wrap gap-3">
        <Link href="/reviewer" className="btn btn-ghost text-[10px]">
          ← Back to walkthrough
        </Link>
      </div>
    </div>
  );
}
