import type { ScanReport } from "@/lib/types";
import { scanPassed, highSeverityCount } from "@/lib/validate";

const severityClass: Record<string, string> = {
  critical: "sev-critical",
  high: "sev-high",
  medium: "sev-medium",
  low: "sev-low",
};

export function SummaryCards({ report }: { report: ScanReport }) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const f of report.findings) counts[f.severity]++;

  const items: { key: keyof typeof counts; label: string }[] = [
    { key: "critical", label: "Critical" },
    { key: "high", label: "High" },
    { key: "medium", label: "Medium" },
    { key: "low", label: "Low" },
  ];

  const passed = scanPassed(report);
  const highCount = highSeverityCount(report);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`label ${passed ? "text-[var(--phosphor)]" : "text-[var(--critical)]"}`}>
          {passed ? "● No high/critical issues" : `● ${highCount} high/critical finding${highCount === 1 ? "" : "s"}`}
        </span>
        <span className="text-xs text-[var(--ink-faint)]">
          {report.files_scanned} files · {report.rules_run} rules · {report.scanned_at.slice(0, 19).replace("T", " ")} UTC
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((i) => (
          <div
            key={i.key}
            className={`panel stat-block ${severityClass[i.key]} p-4 ${counts[i.key] > 0 ? "has-findings" : ""}`}
          >
            <p className="label">{i.label}</p>
            <p className="stat-value mt-2">{counts[i.key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
