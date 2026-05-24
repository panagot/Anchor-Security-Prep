import Link from "next/link";

import type { Finding } from "@/lib/types";

const severityClass: Record<string, string> = {
  critical: "sev-critical",
  high: "sev-high",
  medium: "sev-medium",
  low: "sev-low",
};

export function FindingCard({
  finding,
  active,
  onClick,
}: {
  finding: Finding;
  active?: boolean;
  onClick?: () => void;
}) {
  const file = finding.file.split("/").pop();
  const sev = severityClass[finding.severity] ?? "";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active ?? false}
      aria-label={`${finding.rule_id} ${finding.severity}: ${finding.title} at ${file}:${finding.line}`}
      className={`panel w-full text-left transition-all hover:border-[var(--line-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--amber)] ${
        active ? "ring-1 ring-[var(--amber)] border-[var(--amber)]" : ""
      }`}
    >
      <div className={`panel-inner severity-rail ${sev}`}>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className={`badge ${sev}`}>{finding.severity}</span>
          <span className="font-mono text-[10px] text-[var(--amber)]">{finding.rule_id}</span>
          <span className="text-[10px] text-[var(--ink-faint)]">{finding.category}</span>
        </div>
        <h3 className="display text-sm font-semibold">{finding.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-[var(--ink-muted)]">{finding.message}</p>
        <p className="mt-2 font-mono text-[10px] text-[var(--ink-faint)]">
          {file}:{finding.line}
        </p>
      </div>
    </button>
  );
}

function highlightSnippet(snippet: string) {
  return snippet.split("\n").map((line, i) => {
    const isHighlight = line.startsWith(">");
    return (
      <span key={i} className={isHighlight ? "hl block" : "block"}>
        {line}
      </span>
    );
  });
}

export function FindingDetail({ finding }: { finding: Finding }) {
  const sev = severityClass[finding.severity] ?? "";

  return (
    <div className="panel sticky top-24">
      <div className={`panel-inner severity-rail ${sev}`}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`badge ${sev}`}>{finding.severity}</span>
          <span className="font-mono text-xs text-[var(--amber)]">{finding.rule_id}</span>
        </div>

        <h2 className="display text-xl font-bold">{finding.title}</h2>
        <Link
          href={`/rules/${finding.rule_id.toLowerCase()}`}
          className="mt-2 inline-block text-[10px] text-[var(--amber)] hover:underline"
        >
          Learn about {finding.rule_id} →
        </Link>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">{finding.message}</p>

        <div className="mt-5 border border-[var(--phosphor)] bg-[var(--phosphor-dim)] p-4">
          <p className="label mb-2 text-[var(--phosphor)]">Recommended fix</p>
          <p className="text-sm leading-relaxed">{finding.fix_hint}</p>
        </div>

        <div className="mt-5">
          <p className="label mb-2">Source context</p>
          <pre className="code-block p-4">{highlightSnippet(finding.code_snippet)}</pre>
        </div>
      </div>
    </div>
  );
}
