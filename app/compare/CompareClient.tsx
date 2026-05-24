"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { CodeDiff } from "@/components/CodeDiff";
import { DemoImpactBanner } from "@/components/DemoImpactBanner";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { GrantPathStepper } from "@/components/GrantPathStepper";
import { NextStepCta } from "@/components/NextStepCta";
import { PageHeader } from "@/components/PageHeader";
import { SummaryCards } from "@/components/SummaryCards";
import type { ScanReport } from "@/lib/types";
import { EXAMPLE_PATHS } from "@/lib/constants";
import { SAMPLE_REPORT_IDS } from "@/lib/demo-routes";
import { isScanReport } from "@/lib/validate";

export type CompareResult = {
  report: ScanReport;
  reportId?: string;
  source: "live" | "sample";
};

async function fetchScan(path: string): Promise<{ report: ScanReport; id?: string }> {
  const res = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Scan failed for ${path}`);
  if (!isScanReport(data.report)) throw new Error("Invalid scan response");
  return { report: data.report, id: data.id as string | undefined };
}

async function fetchSample(kind: "vulnerable" | "clean"): Promise<ScanReport> {
  const res = await fetch(`/samples/${kind}-report.json`);
  if (!res.ok) throw new Error("Sample data unavailable");
  const data = await res.json();
  if (!isScanReport(data)) throw new Error("Invalid sample report");
  return data;
}

async function loadComparison(path: string, sample: "vulnerable" | "clean"): Promise<CompareResult> {
  try {
    const { report, id } = await fetchScan(path);
    return { report, reportId: id, source: "live" };
  } catch {
    const report = await fetchSample(sample);
    return { report, reportId: report.id, source: "sample" };
  }
}

function CompareColumn({
  label,
  badgeClass,
  path,
  result,
  loading,
  error,
  sampleId,
}: {
  label: string;
  badgeClass: string;
  path: string;
  result: CompareResult | null;
  loading: boolean;
  error: string;
  sampleId: string;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex min-h-[2rem] flex-wrap items-center gap-2">
        <span className={`badge ${badgeClass}`}>{label}</span>
        <span className="text-xs text-[var(--ink-faint)]">{path}</span>
        {result ? (
          <Link href={`/report/${result.reportId ?? sampleId}`} className="btn btn-ghost text-[10px]">
            Full report →
          </Link>
        ) : (
          <span className="invisible btn btn-ghost pointer-events-none text-[10px]" aria-hidden>
            Full report →
          </span>
        )}
      </div>
      {loading && !result ? (
        <div className="panel animate-pulse"><div className="panel-inner h-32" /></div>
      ) : result ? (
        <>
          <SummaryCards report={result.report} />
          <p className="text-xs text-[var(--ink-muted)]">{result.report.findings.length} total findings</p>
        </>
      ) : error ? (
        <div className="panel"><div className="panel-inner text-sm text-[var(--critical)]">Failed to load.</div></div>
      ) : (
        <div className="panel animate-pulse"><div className="panel-inner h-32" /></div>
      )}
    </section>
  );
}

export function CompareClient({
  initialVuln,
  initialClean,
}: {
  initialVuln: CompareResult | null;
  initialClean: CompareResult | null;
}) {
  const [vuln, setVuln] = useState<CompareResult | null>(initialVuln);
  const [clean, setClean] = useState<CompareResult | null>(initialClean);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usingSamples, setUsingSamples] = useState(
    initialVuln?.source === "sample" || initialClean?.source === "sample" || !initialVuln
  );

  const runCompare = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError("");
    }
    try {
      const [a, b] = await Promise.all([
        loadComparison(EXAMPLE_PATHS.vulnerable, "vulnerable"),
        loadComparison(EXAMPLE_PATHS.clean, "clean"),
      ]);
      setVuln(a);
      setClean(b);
      setUsingSamples(a.source === "sample" || b.source === "sample");
    } catch (e) {
      if (!silent) setError(e instanceof Error ? e.message : "Comparison failed");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    runCompare(true);
  }, [runCompare]);

  const topFindings = vuln?.report.findings
    .filter((f) => f.severity === "critical" || f.severity === "high")
    .slice(0, 3);

  const vulnHighCrit =
    vuln?.report.findings.filter((f) => f.severity === "critical" || f.severity === "high").length ?? 0;
  const cleanHighCrit =
    clean?.report.findings.filter((f) => f.severity === "critical" || f.severity === "high").length ?? 0;

  return (
    <div className="space-y-8">
      <GrantPathStepper />
      <DemoImpactBanner />

      <PageHeader
        refId="DIFF-002"
        title="Sample comparison"
        subtitle="Same 26-rule engine, different Anchor patterns — intentionally vulnerable sample vs hardened reference."
        actions={
          <button type="button" onClick={() => runCompare()} disabled={loading} className="btn btn-primary text-[10px]">
            {loading ? "Running…" : "Re-run comparison"}
          </button>
        }
      />

      {usingSamples && !loading && <DemoModeBanner />}

      {vuln && clean && (
        <div className="panel border-[var(--amber)]/30">
          <div className="panel-inner flex flex-wrap items-center justify-between gap-4 text-sm">
            <p className="text-[var(--ink-muted)]">
              <strong className="text-[var(--critical)]">{vuln.report.findings.length} findings</strong>
              {" "}({vulnHighCrit} high/critical) vs{" "}
              <strong className="text-[var(--phosphor)]">{cleanHighCrit} high/critical</strong>
              {" "}on the clean reference — same ruleset, different code patterns.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="panel">
          <div className="panel-inner border border-[var(--critical)] bg-[rgba(255,77,109,0.08)] text-sm text-[var(--critical)]">
            {error}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <CompareColumn
          label="Vulnerable"
          badgeClass="sev-critical"
          path={EXAMPLE_PATHS.vulnerable}
          result={vuln}
          loading={loading}
          error={error}
          sampleId={SAMPLE_REPORT_IDS.vulnerable}
        />
        <CompareColumn
          label="Clean"
          badgeClass="badge-pass"
          path={EXAMPLE_PATHS.clean}
          result={clean}
          loading={loading}
          error={error}
          sampleId={SAMPLE_REPORT_IDS.clean}
        />
      </div>

      {topFindings && topFindings.length > 0 && (
        <section className="panel">
          <div className="panel-inner space-y-3">
            <h2 className="display text-lg font-bold">Top issues in vulnerable sample</h2>
            <p className="text-sm text-[var(--ink-muted)]">Click a finding to read the full rule documentation.</p>
            <ul className="space-y-2 text-sm">
              {topFindings.map((f) => (
                <li key={`${f.rule_id}-${f.line}`}>
                  <Link
                    href={`/rules/${f.rule_id.toLowerCase()}`}
                    className="flex items-center gap-2 rounded px-1 py-1 transition-colors hover:bg-[var(--amber-dim)]/20"
                  >
                    <span className={`badge ${f.severity === "critical" ? "sev-critical" : "sev-high"}`}>{f.severity}</span>
                    <span className="font-mono text-[var(--amber)]">{f.rule_id}</span>
                    <span className="text-[var(--ink-muted)]">{f.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CodeDiff />

      <NextStepCta
        step="Step 1 complete"
        next={{
          label: "Inspect ASP001 rule",
          href: "/rules/asp001",
          description: "See why missing Signer checks are critical — with vulnerable vs hardened code.",
        }}
      />
    </div>
  );
}
