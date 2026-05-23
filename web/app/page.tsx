import Link from "next/link";

import { CopyButton } from "@/components/CopyButton";

const QUICKSTART = `cargo build -p anchor-prep
cargo run -p anchor-prep -- scan examples/vulnerable-program --format all
cargo run -p anchor-prep -- init
cd web && npm run dev`;

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-6">
          <p className="label text-[var(--amber)]">Solana public good · MIT licensed</p>
          <h1 className="display max-w-3xl text-4xl font-extrabold md:text-6xl">
            Static analysis for Anchor programs
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--ink-muted)]">
            Catch missing signers, unsafe CPI, PDA issues, and token constraint bugs before audit or mainnet.
            Built for developers who need audit-grade signal without audit-grade cost.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/scan?demo=vulnerable" className="btn btn-primary">
              Run demo scan
            </Link>
            <Link href="/compare" className="btn btn-ghost">
              See comparison
            </Link>
            <Link href="/rules" className="btn btn-ghost">
              Rule catalog
            </Link>
          </div>
        </div>

        <div className="panel">
          <div className="panel-inner space-y-4">
            <p className="label">Live instrument status</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                ["Rules active", "26"],
                ["Output formats", "JSON · MD · SARIF"],
                ["CI ready", "GitHub Action"],
                ["License", "Open source"],
              ].map(([k, v]) => (
                <div key={k} className="border border-[var(--line)] bg-black/20 p-3">
                  <p className="label mb-1">{k}</p>
                  <p className="font-mono text-[var(--ink)]">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-inner space-y-4">
          <h2 className="display text-xl font-bold">Grant demo path (~2 min)</h2>
          <ol className="grid gap-3 text-xs md:grid-cols-3">
            {[
              { step: "1", title: "Compare samples", href: "/compare", outcome: "40+ vs 0 high/critical" },
              { step: "2", title: "Open full report", href: "/scan?demo=vulnerable", outcome: "Finding detail + fix hints" },
              { step: "3", title: "Export & CI", href: "/integrations", outcome: "SARIF + GitHub Action" },
            ].map((s) => (
              <li key={s.step} className="border border-[var(--line)] bg-black/20 p-4">
                <p className="label mb-2">Step {s.step}</p>
                <Link href={s.href} className="display text-base font-semibold text-[var(--amber)] hover:underline">
                  {s.title}
                </Link>
                <p className="mt-2 text-[var(--ink-muted)]">{s.outcome}</p>
              </li>
            ))}
          </ol>
          <p className="text-[10px] text-[var(--ink-faint)]">Local dashboard: http://localhost:3001</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { n: "01", title: "CLI + CI pipeline", body: "Run locally or gate pull requests. Export SARIF for GitHub Code Scanning." },
          { n: "02", title: "Solana-native rules", body: "Account macros, PDAs, CPI trust boundaries, Token-2022 patterns." },
          { n: "03", title: "Pre-audit workflow", body: "Baseline diffs, audit checklists, and fix guidance per finding." },
        ].map((f) => (
          <div key={f.n} className="panel">
            <div className="panel-inner">
              <p className="rule-index">{f.n}</p>
              <h3 className="display -mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-[var(--ink-muted)]">{f.body}</p>
            </div>
          </div>
        ))}
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
