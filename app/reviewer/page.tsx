import type { Metadata } from "next";

import Link from "next/link";



import { DemoModeBanner } from "@/components/DemoModeBanner";

import { GrantPathStepper } from "@/components/GrantPathStepper";

import { PageHeader } from "@/components/PageHeader";

import { TrustStrip } from "@/components/TrustStrip";

import { getDemoImpactStats } from "@/lib/sample-stats";

import { ECOSYSTEM_STATS } from "@/lib/incidents";

import { FIXTURE_LABEL } from "@/lib/fixture-coverage";
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



const CHECKLIST = [

  "Compare shows 41 vs 0 high/critical on same ruleset",

  "ASP001 has vulnerable vs hardened code patterns",

  "Sample report lists findings with fix hints",

  "Integrations page shows CLI + GitHub Actions YAML",

  `Honest about ${FIXTURE_LABEL} fixtures and audit complement (not replacement)`,

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

      <TrustStrip />



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

              <p className="font-mono text-xl font-bold text-[var(--amber)]">{FIXTURE_LABEL}</p>

              <p className="label mt-1">fixtures (M1: 26)</p>

            </div>

          </div>

        </div>

      </section>



      <GrantPathStepper />



      <section className="space-y-4">

        <h2 className="display text-xl font-bold">Follow these steps</h2>

        <ol className="space-y-3">

          {STEPS.map((s) => (

            <li key={s.n} className="panel">

              <Link href={s.href} className="panel-inner block transition-colors hover:bg-[var(--amber-dim)]/20">

                <div className="flex flex-wrap items-start justify-between gap-3">

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--amber)] font-mono text-sm font-bold text-[var(--bg)]">

                    {s.n}

                  </span>

                  <div className="min-w-0 flex-1">

                    <p className="label mb-1">{s.time}</p>

                    <h3 className="display text-base font-bold text-[var(--amber)]">{s.title}</h3>

                    <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{s.body}</p>

                  </div>

                  <span className="text-[var(--ink-faint)]">→</span>

                </div>

              </Link>

            </li>

          ))}

        </ol>

      </section>



      <section className="panel">

        <div className="panel-inner space-y-3">

          <h2 className="display text-base font-bold text-[var(--ink)]">Reviewer checklist</h2>

          <ul className="space-y-2 text-sm text-[var(--ink-muted)]">

            {CHECKLIST.map((item) => (

              <li key={item} className="flex items-start gap-2">

                <span className="mt-0.5 text-[var(--phosphor)]">✓</span>

                {item}

              </li>

            ))}

          </ul>

        </div>

      </section>



      <section className="panel">

        <div className="panel-inner space-y-3 text-sm text-[var(--ink-muted)]">

          <h2 className="display text-base font-bold text-[var(--ink)]">Evidence & honesty</h2>

          <ul className="space-y-2">

            {[

              {

                label: "Benchmark results",

                href: "https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/BENCHMARK_RESULTS.md",

                note: `Phase 0 + sealevel-attacks scan, ${FIXTURE_LABEL} fixtures`,

              },

              {

                label: "Incident mapping",

                href: "https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/INCIDENTS.md",

                note: "Cashio-class, CPI, signer bypass",

              },

              {

                label: "Grant proposal",

                href: "https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/GRANT.md",

                note: "$10K budget, milestones, adoption targets",

              },

            ].map((link) => (

              <li key={link.label} className="border border-[var(--line)] bg-black/20 px-3 py-2">

                <a href={link.href} className="text-[var(--amber)] hover:underline" target="_blank" rel="noopener noreferrer">

                  {link.label}

                </a>

                <span className="text-[var(--ink-faint)]"> — {link.note}</span>

              </li>

            ))}

          </ul>

          <p className="text-xs text-[var(--ink-faint)]">

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

