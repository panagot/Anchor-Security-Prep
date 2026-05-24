"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { hasFullRuleDoc } from "@/lib/documented-rules";
import type { RuleInfo } from "@/lib/types";

const severityClass: Record<string, string> = {
  critical: "sev-critical",
  high: "sev-high",
  medium: "sev-medium",
  low: "sev-low",
};

export function RulesCatalog({ rules }: { rules: RuleInfo[] }) {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rules.filter((r) => {
      if (severity !== "all" && r.default_severity !== severity) return false;
      if (!q) return true;
      return (
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.exploit_class.toLowerCase().includes(q)
      );
    });
  }, [rules, query, severity]);

  const categories = [...new Set(filtered.map((r) => r.category))];
  const documentedCount = rules.filter((r) => hasFullRuleDoc(r.id)).length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label htmlFor="rule-search" className="label mb-2 block">
            Search rules
          </label>
          <input
            id="rule-search"
            type="search"
            placeholder="ASP001, signer, CPI, token…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-md border border-[var(--line)] bg-black/40 px-4 py-2.5 text-sm outline-none focus-visible:border-[var(--amber)] focus-visible:ring-2 focus-visible:ring-[var(--amber)]/30"
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by severity">
          {(["all", "critical", "high", "medium", "low"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeverity(s)}
              aria-pressed={severity === s}
              className={`btn btn-ghost text-[10px] capitalize ${severity === s ? "active" : ""}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-[var(--ink-muted)]">
        <span>
          <strong className="text-[var(--ink)]">{filtered.length}</strong> of {rules.length} rules
        </span>
        <span>
          <strong className="text-[var(--phosphor)]">{documentedCount}</strong> with full pattern docs
        </span>
      </div>

      {categories.length === 0 ? (
        <div className="panel">
          <div className="panel-inner text-sm text-[var(--ink-muted)]">No rules match your search.</div>
        </div>
      ) : (
        categories.map((cat) => (
          <section key={cat} id={`cat-${cat}`} className="space-y-4 scroll-mt-24">
            <div className="flex items-baseline gap-3 border-b border-[var(--line)] pb-2">
              <h2 className="display text-xl font-bold capitalize">{cat}</h2>
              <span className="label">{filtered.filter((r) => r.category === cat).length} rules</span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {filtered
                .filter((r) => r.category === cat)
                .map((r, idx) => (
                  <Link
                    key={r.id}
                    href={`/rules/${r.id.toLowerCase()}`}
                    className="panel relative block hover:border-[var(--amber)]/40"
                  >
                    <div className="panel-inner">
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-mono text-sm text-[var(--amber)]">{r.id}</span>
                        <div className="flex flex-wrap justify-end gap-1">
                          {hasFullRuleDoc(r.id) && (
                            <span className="badge badge-pass text-[9px]">Full doc</span>
                          )}
                          <span className={`badge ${severityClass[r.default_severity] ?? ""}`}>
                            {r.default_severity}
                          </span>
                        </div>
                      </div>
                      <h3 className="display mt-3 text-base font-semibold">{r.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{r.description}</p>
                      <p className="mt-3 border-t border-[var(--line)] pt-3 text-[11px] text-[var(--ink-faint)]">
                        Exploit class: {r.exploit_class}
                      </p>
                      <p className="rule-index absolute bottom-2 right-4 hidden md:block">
                        {String(idx + 1).padStart(2, "0")}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
