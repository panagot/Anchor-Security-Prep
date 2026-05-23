import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";

import { PageHeader } from "@/components/PageHeader";
import type { RuleInfo } from "@/lib/types";
import { checkCliAvailable, runRulesJson } from "@/lib/scanner";

const severityClass: Record<string, string> = {
  critical: "sev-critical",
  high: "sev-high",
  medium: "sev-medium",
  low: "sev-low",
};

export const metadata: Metadata = {
  title: "Rule catalog",
  description: "26 Anchor-native security rules mapped to Sealevel attack classes — signer, PDA, CPI, token constraints.",
};

function loadStaticRules(): RuleInfo[] | null {
  const p = path.join(process.cwd(), "public", "rules.json");
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as RuleInfo[];
  } catch {
    return null;
  }
}

export default function RulesPage() {
  let rules: RuleInfo[] = [];
  let error: string | undefined;
  let source = "cli";

  const staticRules = loadStaticRules();
  if (staticRules?.length) {
    rules = staticRules;
    source = "bundled";
  } else {
    const cli = checkCliAvailable();
    if (!cli.ok) {
      error = cli.message;
    } else {
      try {
        rules = JSON.parse(runRulesJson()) as RuleInfo[];
      } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load rules";
      }
    }
  }

  const categories = [...new Set(rules.map((r) => r.category))];

  return (
    <div className="space-y-10">
      <PageHeader
        refId="RULE-CAT"
        title="Rule catalog"
        subtitle={`${rules.length} static checks mapped to common Solana exploit classes.`}
      />

      {source === "bundled" && (
        <p className="text-[10px] text-[var(--ink-faint)]">Showing bundled rule catalog (offline demo mode).</p>
      )}

      {error && !rules.length && (
        <div className="panel">
          <div className="panel-inner space-y-3">
            <p className="label text-[var(--critical)]">Setup required</p>
            <p className="text-sm text-[var(--ink-muted)]">{error}</p>
            <pre className="code-block p-3 text-xs">cargo build -p anchor-prep</pre>
          </div>
        </div>
      )}

      {categories.length >= 1 && (
        <nav className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <a key={cat} href={`#cat-${cat}`} className="btn btn-ghost text-[10px] capitalize">
              {cat}
            </a>
          ))}
        </nav>
      )}

      {categories.map((cat) => (
        <section key={cat} id={`cat-${cat}`} className="space-y-4 scroll-mt-24">
          <div className="flex items-baseline gap-3 border-b border-[var(--line)] pb-2">
            <h2 className="display text-xl font-bold capitalize">{cat}</h2>
            <span className="label">{rules.filter((r) => r.category === cat).length} rules</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {rules
              .filter((r) => r.category === cat)
              .map((r, idx) => (
                <Link key={r.id} href={`/rules/${r.id.toLowerCase()}`} className="panel relative block hover:border-[var(--amber)]/40">
                  <div className="panel-inner">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-mono text-sm text-[var(--amber)]">{r.id}</span>
                      <span className={`badge ${severityClass[r.default_severity] ?? ""}`}>{r.default_severity}</span>
                    </div>
                    <h3 className="display mt-3 text-base font-semibold">{r.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">{r.description}</p>
                    <p className="mt-3 border-t border-[var(--line)] pt-3 text-[10px] text-[var(--ink-faint)]">
                      Exploit class: {r.exploit_class}
                    </p>
                    <p className="rule-index absolute bottom-2 right-4 hidden md:block">{String(idx + 1).padStart(2, "0")}</p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
