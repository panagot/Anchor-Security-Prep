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
  const statusText = passed
    ? "● No high/critical issues"
    : `● ${highCount} high/critical finding${highCount === 1 ? "" : "s"}`;
  const metaText = `${report.files_scanned} files · ${report.rules_run} rules · ${report.scanned_at.slice(0, 19).replace("T", " ")} UTC`;

  return (
    <div className="space-y-4">
      {/* Fixed two-row header so compare columns stay aligned */}
      <div className="space-y-1">
        <p
          className={`label min-h-[2.5rem] leading-snug ${passed ? "text-[var(--phosphor)]" : "text-[var(--critical)]"}`}
        >
          {statusText}
        </p>
        <p className="text-xs text-[var(--ink-faint)]">{metaText}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((i) => (
          <div
            key={i.key}
            className={`panel stat-block ${severityClass[i.key]} flex min-h-[5.5rem] flex-col p-4 ${counts[i.key] > 0 ? "has-findings" : ""}`}
          >
            <p className="label">{i.label}</p>
            <p className="stat-value mt-2">{counts[i.key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
