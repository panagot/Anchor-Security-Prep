import fs from "fs";
import path from "path";

import { SAMPLE_REPORT_IDS } from "./demo-routes";
import type { ScanReport } from "./types";
import { isScanReport } from "./validate";

const PUBLIC = path.join(process.cwd(), "public");

export function loadBundledRulesJson(): string | null {
  const file = path.join(PUBLIC, "rules.json");
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}

export function loadBundledReports(): ScanReport[] {
  const samplesDir = path.join(PUBLIC, "samples");
  if (!fs.existsSync(samplesDir)) return [];

  return fs
    .readdirSync(samplesDir)
    .filter((f) => f.endsWith("-report.json"))
    .map((f) => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(samplesDir, f), "utf8"));
        return isScanReport(data) ? data : null;
      } catch {
        return null;
      }
    })
    .filter((r): r is ScanReport => r !== null);
}

export function getBundledReport(id: string): ScanReport | null {
  return loadBundledReports().find((r) => r.id === id) ?? null;
}

export function getBundledSampleReport(kind: "vulnerable" | "clean"): ScanReport | null {
  const file = path.join(PUBLIC, "samples", `${kind}-report.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return isScanReport(data) ? data : null;
  } catch {
    return null;
  }
}

export function getBundledSarif(id: string): string | null {
  if (id !== SAMPLE_REPORT_IDS.vulnerable) return null;
  const file = path.join(PUBLIC, "samples", "vulnerable-report.sarif");
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}

export function isVercel(): boolean {
  return Boolean(process.env.VERCEL);
}
