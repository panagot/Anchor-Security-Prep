import type { Metadata } from "next";
import Link from "next/link";

import { CopyButton } from "@/components/CopyButton";
import { TrustStrip } from "@/components/TrustStrip";
import { ECOSYSTEM_STATS } from "@/lib/incidents";
import { FIXTURE_LABEL } from "@/lib/fixture-coverage";
import { sampleReportUrl } from "@/lib/demo-routes";
import { getDemoImpactStats } from "@/lib/sample-stats";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Pre-audit static analysis for Anchor and Solana programs — 26 rules, SARIF export, GitHub Actions, MIT licensed.",
};

const QUICKSTART = `cargo build -p anchor-prep
cargo run -p anchor-prep -- scan examples/vulnerable-program --format all
cargo run -p anchor-prep -- init
npm install && npm run dev`;

export default function HomePage() {
  const impact = getDemoImpactStats();

  return (
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-6">
          <p className="label text-[var(--amber)]">Solana public good · MIT licensed · Pre-audit tooling</p>
          <h1 className="display max-w-3xl text-4xl font-extrabold md:text-6xl">
            Static analysis for Anchor programs
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--ink-muted)]">
            Catch missing signers, unsafe CPI, PDA issues, and token constraint bugs before audit or mainnet.
            Audits cost {ECOSYSTEM_STATS.auditCostRange} — this gives indie builders and hackathon teams audit-grade
            signal first.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/reviewer" className="btn btn-primary">
              Overview (~2 min)
            </Link>
            <Link href="/compare" className="btn btn-ghost">
              Vulnerable vs clean
            </Link>
            <Link href={sampleReportUrl("vulnerable")} className="btn btn-ghost">
              Sample report
            </Link>
            <Link href="/rules" className="btn btn-ghost">
              Rule catalog
            </Link>
          </div>
        </div>

        <div className="panel border-[var(--critical)]/30">
          <div className="panel-inner space-y-4">
            <p className="label text-[var(--critical)]">Demo impact — bundled examples</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="border border-[var(--critical)]/40 bg-[var(--critical)]/5 p-3">
                <p className="label mb-1 text-[var(--critical)]">Vulnerable program</p>
                <p className="font-mono text-2xl font-bold text-[var(--ink)]">{impact.vulnerable.total}</p>
                <p className="mt-1 text-[var(--ink-muted)]">
                  {impact.vulnerable.highCritical} high/critical · {impact.vulnerable.bySeverity?.critical ?? 0} critical
                </p>
              </div>
              <div className="border border-[var(--phosphor)]/40 bg-[var(--phosphor)]/5 p-3">
                <p className="label mb-1 text-[var(--phosphor)]">Clean reference</p>
                <p className="font-mono text-2xl font-bold text-[var(--ink)]">{impact.clean.total}</p>
                <p className="mt-1 text-[var(--ink-muted)]">
                  {impact.clean.highCritical} high/critical · hardened patterns
                </p>
              </div>
            </div>
            <Link href="/compare" className="text-[11px] text-[var(--amber)] hover:underline">
              See side-by-side comparison →
            </Link>
          </div>
        </div>
      </section>

      <TrustStrip />

      <section className="panel">
        <div className="panel-inner">
          <p className="label mb-3">Why now</p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Audit gap",
                body: "STRIDE helps funded protocols — most builders ship without any pre-audit check.",
                href: "/reviewer",
              },
              {
                title: "CI-native",
                body: "SARIF + GitHub Actions scaffold embeds security into every PR, not a one-off scan.",
                href: "/integrations",
              },
              {
                title: "Open & tunable",
                body: `Baseline diff suppresses known noise. MIT license, ${FIXTURE_LABEL} fixtures tested (M1: 26), growing rule set.`,
                href: "/rules",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="block border border-[var(--line)] bg-black/20 p-4 transition-colors hover:border-[var(--amber)]/40"
              >
                <h3 className="display text-sm font-bold text-[var(--amber)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-inner space-y-4">
          <h2 className="display text-xl font-bold">Quick tour (~2 min)</h2>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "1",
                title: "Compare samples",
                href: "/compare",
                outcome: `${impact.vulnerable.total} findings (${impact.vulnerable.highCritical} high/crit) vs ${impact.clean.highCritical} high/crit`,
              },
              {
                step: "2",
                title: "Inspect ASP001",
                href: "/rules/asp001",
                outcome: "Missing signer — bad vs good pattern",
              },
              {
                step: "3",
                title: "Open full report",
                href: sampleReportUrl("vulnerable"),
                outcome: "Finding detail + fix hints",
              },
              {
                step: "4",
                title: "Export & CI",
                href: "/integrations",
                outcome: "SARIF + GitHub Action",
              },
            ].map((s) => (
              <li key={s.step} className="border border-[var(--line)] bg-black/20 p-4">
                <p className="label mb-2">Step {s.step}</p>
                <Link href={s.href} className="display text-base font-semibold text-[var(--amber)] hover:underline">
                  {s.title}
                </Link>
                <p className="mt-2 text-sm text-[var(--ink-muted)]">{s.outcome}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            n: "01",
            title: "CLI + CI pipeline",
            body: "Run locally or gate pull requests. Export SARIF for GitHub Code Scanning.",
          },
          {
            n: "02",
            title: "Solana-native rules",
            body: `${ECOSYSTEM_STATS.rulesActive} rules today → ${ECOSYSTEM_STATS.rulesTarget} target. Mapped to Sealevel attack classes.`,
          },
          {
            n: "03",
            title: "Pre-audit workflow",
            body: "Baseline diffs, audit checklists, and fix guidance per finding.",
          },
        ].map((f) => (
          <div key={f.n} className="panel">
            <div className="panel-inner">
              <p className="rule-index">{f.n}</p>
              <h3 className="display -mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">{f.body}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="panel border-[var(--amber)]/30">
        <div className="panel-inner flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label text-[var(--amber)]">Public good tooling</p>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              New here? Start the 2-minute walkthrough.
            </p>
          </div>
          <Link href="/reviewer" className="btn btn-primary">
            Project overview →
          </Link>
        </div>
      </section>

      <section className="panel">
        <div className="panel-inner">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="display text-xl font-bold">Terminal quickstart</h2>
            <CopyButton text={QUICKSTART} />
          </div>
          <pre className="code-block mt-4 p-4 text-xs leading-relaxed">{QUICKSTART}</pre>
        </div>
      </section>
    </div>
  );
}
