"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { FindingCard, FindingDetail } from "@/components/FindingCard";
import { GrantPathStepper } from "@/components/GrantPathStepper";
import { NextStepCta } from "@/components/NextStepCta";
import { PageHeader } from "@/components/PageHeader";
import { SummaryCards } from "@/components/SummaryCards";
import type { Finding, ScanReport } from "@/lib/types";
import { isBundledReportId, sampleReportUrl } from "@/lib/demo-routes";
import { isScanReport } from "@/lib/validate";

type LoadState = "loading" | "ready" | "error";

function ExportButton({
  id,
  format,
  label,
}: {
  id: string;
  format: "json" | "sarif";
  label: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function download() {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`/api/reports/${id}?format=${format}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Export failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${id}.${format === "sarif" ? "sarif" : "json"}`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
      setStatus("error");
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button type="button" onClick={download} disabled={status === "loading"} className="btn btn-ghost text-[10px]">
        {status === "loading" ? "Exporting…" : label}
      </button>
      {status === "error" && error && <span className="text-[9px] text-[var(--critical)]">{error}</span>}
    </span>
  );
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const [report, setReport] = useState<ScanReport | null>(null);
  const [selected, setSelected] = useState<Finding | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [id, setId] = useState<string>("");
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    setState("loading");
    fetch(`/api/reports/${id}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Report not found");
        if (!isScanReport(data)) throw new Error("Invalid report data");
        setReport(data);
        setSelected(data.findings[0] ?? null);
        setState("ready");
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load report");
        setState("error");
      });
  }, [id]);

  const filtered = useMemo(() => {
    if (!report) return [];
    if (filter === "all") return report.findings;
    return report.findings.filter((f) => f.severity === filter);
  }, [report, filter]);

  useEffect(() => {
    if (!filtered.length) {
      setSelected(null);
      return;
    }
    const stillVisible = selected && filtered.some(
      (f) => f.rule_id === selected.rule_id && f.line === selected.line && f.file === selected.file
    );
    if (!stillVisible) setSelected(filtered[0]);
  }, [filtered, selected]);

  const counts = useMemo(() => {
    const c = { all: 0, critical: 0, high: 0, medium: 0, low: 0 };
    if (!report) return c;
    c.all = report.findings.length;
    for (const f of report.findings) c[f.severity]++;
    return c;
  }, [report]);

  if (state === "loading") {
    return (
      <div className="space-y-4">
        <div className="panel animate-pulse"><div className="panel-inner h-24" /></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="panel animate-pulse"><div className="panel-inner h-20" /></div>
          ))}
        </div>
      </div>
    );
  }

  if (state === "error" || !report) {
    return (
      <div className="panel">
        <div className="panel-inner space-y-4">
          <p className="label text-[var(--critical)]">Report unavailable</p>
          <h1 className="display text-2xl font-bold">Could not load scan report</h1>
          <p className="text-sm text-[var(--ink-muted)]">{error || "Unknown error"}</p>
          <Link href={sampleReportUrl("vulnerable")} className="btn btn-primary inline-flex">Open sample report</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <GrantPathStepper />

      <nav className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--ink-faint)]" aria-label="Breadcrumb">
        <Link href="/compare" className="hover:text-[var(--amber)]">Compare</Link>
        <span>›</span>
        <Link href="/scan" className="hover:text-[var(--amber)]">Scan</Link>
        <span>›</span>
        <span className="text-[var(--ink-muted)]">Report {id.slice(0, 8)}</span>
        <span className="ml-auto flex flex-wrap gap-2">
          <Link href="/reviewer" className="btn btn-ghost text-[10px]">Overview</Link>
          <Link href="/integrations" className="btn btn-ghost text-[10px]">CI setup →</Link>
        </span>
      </nav>

      {isBundledReportId(id) && (
        <div className="panel border-[var(--amber)]/30">
          <div className="panel-inner text-xs text-[var(--ink-muted)]">
            Bundled sample report — works without install. JSON and SARIF export included for the vulnerable sample.
          </div>
        </div>
      )}

      <PageHeader
        refId={report.id.slice(0, 8).toUpperCase()}
        title="Scan report"
        subtitle={report.project_path}
        actions={
          <>
            <ExportButton id={id} format="json" label="Export JSON" />
            <ExportButton id={id} format="sarif" label="Export SARIF" />
          </>
        }
      />

      <SummaryCards report={report} />

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by severity">
        {(["all", "critical", "high", "medium", "low"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={`btn btn-ghost text-[10px] capitalize ${filter === s ? "active" : ""}`}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="max-h-[72vh] space-y-3 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="panel">
              <div className="panel-inner text-sm text-[var(--phosphor)]">No findings in this filter.</div>
            </div>
          ) : (
            filtered.map((f) => (
              <FindingCard
                key={`${f.rule_id}-${f.file}-${f.line}`}
                finding={f}
                active={selected?.rule_id === f.rule_id && selected?.line === f.line && selected?.file === f.file}
                onClick={() => setSelected(f)}
              />
            ))
          )}
        </div>
        <div aria-live="polite" aria-atomic="true">
          {selected ? (
            <FindingDetail finding={selected} />
          ) : (
            <div className="panel">
              <div className="panel-inner text-sm text-[var(--ink-muted)]">Select a finding to inspect.</div>
            </div>
          )}
        </div>
      </div>

      <NextStepCta
        step="Step 3 of 4"
        next={{
          label: "CI & SARIF setup",
          href: "/integrations",
          description: "GitHub Actions scaffold, baseline diff, and SARIF upload for pull request gates.",
        }}
      />
    </div>
  );
}
