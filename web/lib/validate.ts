import type { Finding, ScanReport } from "./types";

function isFinding(value: unknown): value is Finding {
  if (!value || typeof value !== "object") return false;
  const f = value as Finding;
  return (
    typeof f.rule_id === "string" &&
    typeof f.severity === "string" &&
    typeof f.title === "string" &&
    typeof f.message === "string" &&
    typeof f.file === "string" &&
    typeof f.line === "number"
  );
}

export function isScanReport(value: unknown): value is ScanReport {
  if (!value || typeof value !== "object") return false;
  const r = value as ScanReport;
  return (
    typeof r.id === "string" &&
    typeof r.project_path === "string" &&
    Array.isArray(r.findings) &&
    r.findings.every(isFinding)
  );
}

export function highSeverityCount(report: ScanReport): number {
  return report.findings.filter((f) => f.severity === "critical" || f.severity === "high").length;
}

export function scanPassed(report: ScanReport): boolean {
  return highSeverityCount(report) === 0;
}
