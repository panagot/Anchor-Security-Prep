import { execFileSync, spawnSync } from "child_process";
import fs from "fs";
import path from "path";

import type { ScanReport } from "./types";
import { repoRoot } from "./store";

function cliBinary() {
  const root = repoRoot();
  const candidates = [
    path.join(root, "target", "debug", "anchor-prep.exe"),
    path.join(root, "target", "release", "anchor-prep.exe"),
    path.join(root, "target", "debug", "anchor-prep"),
    path.join(root, "target", "release", "anchor-prep"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error(
    "anchor-prep binary not found. From repo root run: cargo build -p anchor-prep"
  );
}

export function runScan(projectPath: string): ScanReport {
  const root = repoRoot();
  const fullPath = path.isAbsolute(projectPath) ? projectPath : path.join(root, projectPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Project path not found: ${projectPath}`);
  }

  const bin = cliBinary();
  const outDir = path.join(root, ".anchor-prep", "tmp-scan");
  fs.mkdirSync(outDir, { recursive: true });

  const result = spawnSync(bin, ["scan", fullPath, "--format", "all", "--out", outDir], {
    cwd: root,
    encoding: "utf8",
  });

  const reportPath = path.join(outDir, "report.json");
  if (!fs.existsSync(reportPath)) {
    throw new Error(result.stderr || result.stdout || "Scan failed to produce report.json");
  }

  const report = JSON.parse(fs.readFileSync(reportPath, "utf8")) as ScanReport;
  if (result.status !== 0 && result.status !== 2) {
    throw new Error(result.stderr || `anchor-prep exited with code ${result.status}`);
  }
  return report;
}

export function runRulesJson(): string {
  const bin = cliBinary();
  return execFileSync(bin, ["rules", "--json"], { cwd: repoRoot(), encoding: "utf8" });
}

export function checkCliAvailable(): { ok: boolean; message?: string } {
  try {
    cliBinary();
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "CLI unavailable" };
  }
}
