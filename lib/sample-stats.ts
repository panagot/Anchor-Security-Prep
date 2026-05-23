import fs from "fs";
import path from "path";

import type { ScanReport, Severity } from "./types";

function loadSample(name: "vulnerable-report" | "clean-report"): ScanReport | null {
  const file = path.join(process.cwd(), "public", "samples", `${name}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as ScanReport;
  } catch {
    return null;
  }
}

function countBySeverity(report: ScanReport): Record<Severity, number> {
  const counts: Record<Severity, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const f of report.findings) {
    counts[f.severity] += 1;
  }
  return counts;
}

export function getDemoImpactStats() {
  const vulnerable = loadSample("vulnerable-report");
  const clean = loadSample("clean-report");
  const vCounts = vulnerable ? countBySeverity(vulnerable) : null;
  const cCounts = clean ? countBySeverity(clean) : null;

  const highCritical = (c: Record<Severity, number>) => c.critical + c.high;

  return {
    vulnerable: {
      total: vulnerable?.findings.length ?? 0,
      bySeverity: vCounts,
      highCritical: vCounts ? highCritical(vCounts) : 0,
    },
    clean: {
      total: clean?.findings.length ?? 0,
      bySeverity: cCounts,
      highCritical: cCounts ? highCritical(cCounts) : 0,
    },
  };
}
