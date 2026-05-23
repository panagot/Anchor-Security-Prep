import fs from "fs";
import path from "path";

import type { ScanReport } from "./types";

const ROOT = process.cwd();
const STORE = path.join(ROOT, ".anchor-prep", "reports");

export function ensureStore() {
  fs.mkdirSync(STORE, { recursive: true });
  fs.mkdirSync(path.join(ROOT, "reports"), { recursive: true });
}

export function saveReport(report: ScanReport) {
  ensureStore();
  const file = path.join(STORE, `${report.id}.json`);
  fs.writeFileSync(file, JSON.stringify(report, null, 2));

  // Keep latest snapshot for backwards compatibility
  fs.writeFileSync(path.join(ROOT, "reports", "report.json"), JSON.stringify(report, null, 2));

  // Copy SARIF if generated during scan
  const sarifSrc = path.join(ROOT, ".anchor-prep", "tmp-scan", "report.sarif");
  if (fs.existsSync(sarifSrc)) {
    fs.copyFileSync(sarifSrc, path.join(STORE, `${report.id}.sarif`));
    fs.copyFileSync(sarifSrc, path.join(ROOT, "reports", "report.sarif"));
  }

  return file;
}

export function getReport(id: string): ScanReport | null {
  ensureStore();
  const file = path.join(STORE, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8")) as ScanReport;
    if (!data.id || !Array.isArray(data.findings)) return null;
    return data;
  } catch {
    return null;
  }
}

export function getReportSarif(id: string): string | null {
  ensureStore();
  const perReport = path.join(STORE, `${id}.sarif`);
  if (fs.existsSync(perReport)) return fs.readFileSync(perReport, "utf8");
  const latest = path.join(ROOT, "reports", "report.sarif");
  if (fs.existsSync(latest)) return fs.readFileSync(latest, "utf8");
  return null;
}

export function listReports(): ScanReport[] {
  ensureStore();
  return fs
    .readdirSync(STORE)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(STORE, f), "utf8")) as ScanReport;
      } catch {
        return null;
      }
    })
    .filter((r): r is ScanReport => r !== null && Boolean(r.id))
    .sort((a, b) => b.scanned_at.localeCompare(a.scanned_at))
    .slice(0, 20);
}

export function repoRoot() {
  return ROOT;
}
