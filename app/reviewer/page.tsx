import type { Metadata } from "next";
import Link from "next/link";

import { DemoModeBanner } from "@/components/DemoModeBanner";
import { PageHeader } from "@/components/PageHeader";
import { FIXTURE_LABEL } from "@/lib/fixture-coverage";
import { ECOSYSTEM_STATS } from "@/lib/incidents";
import { M1, M2 } from "@/lib/milestones";
import { sampleReportUrl } from "@/lib/demo-routes";
import { getDemoImpactStats } from "@/lib/sample-stats";

export const metadata: Metadata = {
  title: "Solana Foundation review",
  description:
    "Developer Tooling grant review for Anchor Security Prep — value proposition, $10K ask, M1/M2 milestones, 2-minute demo.",
};

const DEMO_STEPS = [
  { n: "1", title: "Compare", href: "/compare", desc: "41 findings vs 0 high/critical — same 26 rules" },
  { n: "2", title: "Rule detail", href: "/rules/asp001", desc: "Missing signer — bad vs good pattern" },
  { n: "3", title: "Full report", href: sampleReportUrl("vulnerable"), desc: "Findings + fix hints + SARIF export" },
  { n: "4", title: "CI setup", href: "/integrations", desc: "GitHub Actions + baseline diff" },
];

function MilestoneCard({ m }: { m: typeof M1 }) {
  const done = m.deliverables.filter((d) => d.done).length;
  return (
    <div className="panel border-[var(--amber)]/40">
      <div className="panel-inner flex h-full flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="label text-[var(--amber)]">{m.id.toUpperCase()} · {m.budget}</p>
            <h3 className="display text-lg font-bold">{m.title.replace(/^Milestone \d — /, "")}</h3>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">{m.summary}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-bold text-[var(--phosphor)]">{m.progress}%</p>
            <p className="text-[10px] text-[var(--ink-faint)]">{m.statusLabel}</p>
          </div>
        </div>
        <div className="h-1.5 bg-black/40">
          <div className="h-full bg-[var(--amber)]" style={{ width: `${m.progress}%` }} />
        </div>
        <p className="text-xs text-[var(--ink-faint)]">
          {done}/{m.deliverables.length} deliverables complete · {m.acceptance.filter((a) => a.done).length}/
          {m.acceptance.length} acceptance criteria met
        </p>
        <ul className="flex-1 space-y-1.5 text-sm text-[var(--ink-muted)]">
          {m.deliverables.slice(0, 4).map((d) => (
            <li key={d.label} className="flex gap-2">
              <span className={d.done ? "text-[var(--phosphor)]" : "text-[var(--ink-faint)]"}>
                {d.done ? "✓" : "○"}
              </span>
              {d.label}
            </li>
          ))}
        </ul>
        <Link href={`/${m.id}`} className="btn btn-primary w-full text-center">
          Review {m.id.toUpperCase()} in detail →
        </Link>
      </div>
    </div>
  );
}

export default function ReviewerPage() {
  const impact = getDemoImpactStats();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <PageHeader
        refId="SF-REVIEW"
        title="Solana Foundation — Developer Tooling review"
        subtitle="Everything you need to evaluate Anchor Security Prep in ~2 minutes. If the proposal looks fundable, open M1 and M2 for deliverables, acceptance criteria, and budget detail."
      />

      <DemoModeBanner />

      {/* The ask */}
      <section className="panel border-[var(--amber)]/50">
        <div className="panel-inner space-y-4">
          <p className="label text-[var(--amber)]">The ask</p>
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-3">
              <h2 className="display text-2xl font-bold">$10,000 · MIT open source · public good</h2>
              <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
                We are building a <strong className="text-[var(--ink)]">free pre-audit static analyzer</strong> for
                Anchor programs. It catches exploit-class bugs (missing signers, unsafe CPI, PDA issues, token
                constraints) <em>before</em> a {ECOSYSTEM_STATS.auditCostRange} professional audit — complementing STRIDE,
                not replacing it.
              </p>
              <p className="text-sm text-[var(--ink-muted)]">
                <strong className="text-[var(--ink)]">Category:</strong> Developer Tooling ·{" "}
                <strong className="text-[var(--ink)]">License:</strong> Yes, fully open source (MIT) ·{" "}
                <strong className="text-[var(--ink)]">On-chain accounts:</strong> N/A (off-chain dev tool)
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="border border-[var(--critical)]/40 bg-[var(--critical)]/5 p-3">
                <p className="font-mono text-xl font-bold">{impact.vulnerable.highCritical}</p>
                <p className="label mt-1">high/crit found (vulnerable)</p>
              </div>
              <div className="border border-[var(--phosphor)]/40 bg-[var(--phosphor)]/5 p-3">
                <p className="font-mono text-xl font-bold">{impact.clean.highCritical}</p>
                <p className="label mt-1">high/crit (clean ref)</p>
              </div>
              <div className="border border-[var(--line)] bg-black/20 p-3">
                <p className="font-mono text-xl font-bold">26</p>
                <p className="label mt-1">active rules</p>
              </div>
              <div className="border border-[var(--line)] bg-black/20 p-3">
                <p className="font-mono text-xl font-bold">{FIXTURE_LABEL}</p>
                <p className="label mt-1">fixtures tested</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="panel">
          <div className="panel-inner">
            <p className="label mb-2 text-[var(--critical)]">Problem</p>
            <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
              Most indie Anchor devs and hackathon teams ship without pre-audit checks. Audits cost{" "}
              {ECOSYSTEM_STATS.auditCostRange}; STRIDE helps funded protocols later. There is no free, Anchor-native
              analyzer with SARIF + CI + fix guidance in one package.
            </p>
          </div>
        </div>
        <div className="panel">
          <div className="panel-inner">
            <p className="label mb-2 text-[var(--phosphor)]">Solution</p>
            <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
              Rust CLI + web dashboard. One command scans an Anchor workspace; SARIF feeds GitHub Code Scanning;{" "}
              <code className="text-[var(--amber)]">anchor-prep init</code> scaffolds CI. Side-by-side vulnerable vs
              clean demo proves value without installing anything.
            </p>
          </div>
        </div>
      </section>

      {/* 2-min demo */}
      <section className="space-y-4">
        <h2 className="display text-xl font-bold">Prove it yourself (~2 min)</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {DEMO_STEPS.map((s) => (
            <Link
              key={s.n}
              href={s.href}
              className="panel block transition-colors hover:border-[var(--amber)]/40"
            >
              <div className="panel-inner flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--amber)] text-sm font-bold text-[var(--bg)]">
                  {s.n}
                </span>
                <div>
                  <p className="font-semibold text-[var(--amber)]">{s.title}</p>
                  <p className="mt-1 text-xs text-[var(--ink-muted)]">{s.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* M1 / M2 — main CTA for approvers */}
      <section className="space-y-4">
        <div className="border-l-2 border-[var(--amber)] pl-4">
          <h2 className="display text-xl font-bold">If approving — review milestones</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            Two milestones only: <strong className="text-[var(--ink)]">$5,000 to begin</strong> (CLI + public website +
            CI foundation) and <strong className="text-[var(--ink)]">$5,000 to finish</strong> (production v1.0 +{" "}
            <strong className="text-[var(--ink)]">12 months dedicated upkeep</strong>). Each page lists deliverables,
            acceptance criteria, and live proof.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <MilestoneCard m={M1} />
          <MilestoneCard m={M2} />
        </div>
      </section>

      {/* Traction */}
      <section className="panel">
        <div className="panel-inner space-y-3">
          <h2 className="display text-base font-bold">Already shipped (v0.2.0)</h2>
          <ul className="grid gap-2 text-sm text-[var(--ink-muted)] sm:grid-cols-2">
            <li>✓ Live dashboard on Vercel — no install for reviewers</li>
            <li>✓ GitHub release v0.2.0 with linux/mac/win binaries</li>
            <li>✓ Phase 1 benchmark: sealevel-attacks (50 findings, 35 files)</li>
            <li>✓ 24 automated Rust tests ({FIXTURE_LABEL} rule fixtures)</li>
            <li>✓ SARIF export on bundled sample report</li>
            <li>✓ Baseline diff for false-positive suppression in CI</li>
          </ul>
        </div>
      </section>

      {/* Honesty */}
      <section className="panel">
        <div className="panel-inner space-y-2 text-sm text-[var(--ink-muted)]">
          <h2 className="display text-base font-bold text-[var(--ink)]">Honest limitations</h2>
          <p>
            Not a replacement for professional audit. Static heuristics with documented false-positive tradeoffs.
            {FIXTURE_LABEL} rules have golden tests today — five remaining (ASP013, ASP014, ASP016, ASP018, ASP020) close
            by M2 finish (26/26). Some secure reference programs in external benchmarks may trigger heuristic findings —
            baseline diff is the mitigation.
          </p>
        </div>
      </section>

      {/* Reviewer resources */}
      <section className="panel border-[var(--line)]">
        <div className="panel-inner space-y-3 text-sm">
          <h2 className="display text-base font-bold">Documentation</h2>
          <p className="text-[var(--ink-muted)]">
            Full proposal and benchmark methodology live in the{" "}
            <a
              href="https://github.com/panagot/Anchor-Security-Prep/tree/main/docs"
              className="text-[var(--amber)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              docs/
            </a>{" "}
            folder on GitHub.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/compare" className="btn btn-primary">
          Start 2-min demo
        </Link>
        <Link href="/m1" className="btn btn-ghost">
          M1 detail
        </Link>
        <Link href="/m2" className="btn btn-ghost">
          M2 detail
        </Link>
      </div>
    </div>
  );
}
