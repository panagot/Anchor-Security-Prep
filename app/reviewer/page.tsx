import type { Metadata } from "next";

import Link from "next/link";

import { DemoModeBanner } from "@/components/DemoModeBanner";
import { PageHeader } from "@/components/PageHeader";
import { getDemoImpactStats } from "@/lib/sample-stats";
import { ECOSYSTEM_STATS } from "@/lib/incidents";
import { sampleReportUrl } from "@/lib/demo-routes";

export const metadata: Metadata = {
  title: "Grant reviewer walkthrough",
  description:
    "2-minute path to evaluate Anchor Security Prep — compare samples, inspect rules, view findings, CI integration.",
};

const STEPS = [
  {
    n: "1",
    title: "Compare vulnerable vs clean",
    href: "/compare",
    time: "30 sec",
    body: "Same 26 rules. 41 findings vs 0 high/critical. This is the core value proposition.",
  },
  {
    n: "2",
    title: "Inspect a critical rule",
    href: "/rules/asp001",
    time: "30 sec",
    body: "ASP001 (missing signer) — bad vs good pattern, real-world relevance, fix hint.",
  },
  {
    n: "3",
    title: "Open full report",
    href: sampleReportUrl("vulnerable"),
    time: "30 sec",
    body: "Finding explorer with severity, line numbers, code snippets, export paths.",
  },
  {
    n: "4",
    title: "CI + SARIF integration",
    href: "/integrations",
    time: "30 sec",
    body: "GitHub Actions scaffold, SARIF upload, baseline diff for FP suppression.",
  },
];

export default function ReviewerPage() {
  const impact = getDemoImpactStats();

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <PageHeader
        refId="GRANT-REVIEW"
        title="Grant reviewer walkthrough"
        subtitle="~2 minutes to evaluate Anchor Security Prep for Solana Foundation Developer Tooling funding."
      />

      <DemoModeBanner />

      <section className="panel border-[var(--amber)]/40">
        <div className="panel-inner space-y-4">
          <p className="label text-[var(--amber)]">Value proposition</p>
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
            Professional Solana audits cost {ECOSYSTEM_STATS.auditCostRange}. Most indie and hackathon teams ship without
            pre-audit checks. Anchor Security Prep is a <strong className="text-[var(--ink)]">free MIT-licensed</strong>{" "}
            static analyzer with {ECOSYSTEM_STATS.rulesActive} Anchor-native rules, SARIF/CI integration, and per-finding
            fix guidance — built to complement STRIDE and reduce audit scope.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="border border-[var(--line)] bg-black/20 p-3">
              <p className="font-mono text-xl font-bold text-[var(--critical)]">{impact.vulnerable.highCritical}</p>
              <p className="label mt-1">high/crit (vulnerable)</p>
            </div>
            <div className="border border-[var(--line)] bg-black/20 p-3">
              <p className="font-mono text-xl font-bold text-[var(--phosphor)]">{impact.clean.highCritical}</p>
              <p className="label mt-1">high/crit (clean)</p>
            </div>
            <div className="border border-[var(--line)] bg-black/20 p-3">
              <p className="font-mono text-xl font-bold text-[var(--amber)]">15/26</p>
              <p className="label mt-1">fixtures (M1: 26)</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="display text-xl font-bold">Follow these steps</h2>
        <ol className="space-y-3">
          {STEPS.map((s) => (
            <li key={s.n} className="panel">
              <Link href={s.href} className="panel-inner block transition-colors hover:bg-[var(--amber-dim)]/20">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="label mb-1">
                      Step {s.n} · {s.time}
                    </p>
                    <h3 className="display text-base font-bold text-[var(--amber)]">{s.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">{s.body}</p>
                  </div>
                  <span className="text-[var(--ink-faint)]">→</span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel">
        <div className="panel-inner space-y-3 text-xs text-[var(--ink-muted)]">
          <h2 className="display text-base font-bold text-[var(--ink)]">Evidence & honesty</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <a href="https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/BENCHMARK_RESULTS.md" className="text-[var(--amber)] hover:underline" target="_blank" rel="noopener noreferrer">
                Benchmark results
              </a>{" "}
              — Phase 0 stats, 15/26 fixtures
            </li>
            <li>
              <a href="https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/INCIDENTS.md" className="text-[var(--amber)] hover:underline" target="_blank" rel="noopener noreferrer">
                Incident mapping
              </a>{" "}
              — Cashio-class, CPI, signer bypass
            </li>
            <li>
              <a href="https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/GRANT.md" className="text-[var(--amber)] hover:underline" target="_blank" rel="noopener noreferrer">
                Grant proposal
              </a>{" "}
              — $10K budget, milestones, adoption targets
            </li>
          </ul>
          <p className="text-[var(--ink-faint)]">
            Not a replacement for professional audit. Static heuristics with documented FP tradeoffs.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/compare" className="btn btn-primary">
          Start with Compare
        </Link>
        <a
          href="https://github.com/panagot/Anchor-Security-Prep"
          className="btn btn-ghost"
          target="_blank"
          rel="noopener noreferrer"
        >
          View source
        </a>
      </div>
    </div>
  );
}
