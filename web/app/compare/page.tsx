"use client";



import Link from "next/link";

import { useCallback, useEffect, useState } from "react";



import { CodeDiff } from "@/components/CodeDiff";
import { PageHeader } from "@/components/PageHeader";

import { SummaryCards } from "@/components/SummaryCards";

import type { ScanReport } from "@/lib/types";

import { EXAMPLE_PATHS } from "@/lib/constants";

import { isScanReport } from "@/lib/validate";



type CompareResult = {

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

    return { report, source: "sample" };

  }

}



export default function ComparePage() {

  const [vuln, setVuln] = useState<CompareResult | null>(null);

  const [clean, setClean] = useState<CompareResult | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [usingSamples, setUsingSamples] = useState(false);



  const runCompare = useCallback(async () => {

    setLoading(true);

    setError("");

    setVuln(null);

    setClean(null);

    try {

      const [a, b] = await Promise.all([

        loadComparison(EXAMPLE_PATHS.vulnerable, "vulnerable"),

        loadComparison(EXAMPLE_PATHS.clean, "clean"),

      ]);

      setVuln(a);

      setClean(b);

      setUsingSamples(a.source === "sample" || b.source === "sample");

    } catch (e) {

      setError(e instanceof Error ? e.message : "Comparison failed");

    } finally {

      setLoading(false);

    }

  }, []);



  useEffect(() => {

    runCompare();

  }, [runCompare]);



  const topFindings = vuln?.report.findings

    .filter((f) => f.severity === "critical" || f.severity === "high")

    .slice(0, 3);



  return (

    <div className="space-y-8">

      <PageHeader

        refId="DIFF-002"

        title="Sample comparison"

        subtitle="Same ruleset, different Anchor patterns — vulnerable sample vs hardened reference."

        actions={

          <button type="button" onClick={runCompare} disabled={loading} className="btn btn-primary text-[10px]">

            {loading ? "Running…" : "Re-run comparison"}

          </button>

        }

      />



      {usingSamples && !loading && (

        <div className="panel">

          <div className="panel-inner text-xs text-[var(--ink-muted)]">

            Showing bundled sample reports (CLI unavailable). Run{" "}

            <code className="text-[var(--amber)]">cargo build -p anchor-prep</code> for live scans.

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



      <div className="grid gap-8 lg:grid-cols-2">

        <section className="space-y-4">

          <div className="flex flex-wrap items-center gap-2">

            <span className="badge sev-critical">Vulnerable</span>

            <span className="text-xs text-[var(--ink-faint)]">{EXAMPLE_PATHS.vulnerable}</span>

            {vuln?.reportId && (

              <Link href={`/report/${vuln.reportId}`} className="btn btn-ghost text-[10px]">

                Full report →

              </Link>

            )}

          </div>

          {loading && !vuln ? (

            <div className="panel animate-pulse"><div className="panel-inner h-32" /></div>

          ) : vuln ? (

            <>

              <SummaryCards report={vuln.report} />

              <p className="text-xs text-[var(--ink-muted)]">{vuln.report.findings.length} total findings</p>

            </>

          ) : error ? (

            <div className="panel"><div className="panel-inner text-sm text-[var(--critical)]">Failed to load.</div></div>

          ) : (

            <div className="panel"><div className="panel-inner text-sm text-[var(--ink-muted)]">No data.</div></div>

          )}

        </section>



        <section className="space-y-4">

          <div className="flex flex-wrap items-center gap-2">

            <span className="badge badge-pass">Clean</span>

            <span className="text-xs text-[var(--ink-faint)]">{EXAMPLE_PATHS.clean}</span>

            {clean?.reportId && (

              <Link href={`/report/${clean.reportId}`} className="btn btn-ghost text-[10px]">

                Full report →

              </Link>

            )}

          </div>

          {loading && !clean ? (

            <div className="panel animate-pulse"><div className="panel-inner h-32" /></div>

          ) : clean ? (

            <>

              <SummaryCards report={clean.report} />

              <p className="text-xs text-[var(--ink-muted)]">{clean.report.findings.length} total findings</p>

            </>

          ) : error ? (

            <div className="panel"><div className="panel-inner text-sm text-[var(--critical)]">Failed to load.</div></div>

          ) : (

            <div className="panel"><div className="panel-inner text-sm text-[var(--ink-muted)]">No data.</div></div>

          )}

        </section>

      </div>



      {topFindings && topFindings.length > 0 && (

        <section className="panel">

          <div className="panel-inner space-y-3">

            <h2 className="display text-lg font-bold">Top issues in vulnerable sample</h2>

            <ul className="space-y-2 text-xs">

              {topFindings.map((f) => (

                <li key={`${f.rule_id}-${f.line}`} className="flex items-center gap-2">

                  <span className={`badge ${f.severity === "critical" ? "sev-critical" : "sev-high"}`}>{f.severity}</span>

                  <span className="font-mono text-[var(--amber)]">{f.rule_id}</span>

                  <span className="text-[var(--ink-muted)]">{f.title}</span>

                </li>

              ))}

            </ul>

          </div>

        </section>

      )}

      <CodeDiff />
    </div>
  );
}

