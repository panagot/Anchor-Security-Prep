"use client";



import { useRouter, useSearchParams } from "next/navigation";

import { Suspense, useEffect, useState } from "react";

import Link from "next/link";



import { PageHeader } from "@/components/PageHeader";

import type { ScanReport } from "@/lib/types";

import { sampleReportUrl } from "@/lib/demo-routes";

import { isScanReport, highSeverityCount } from "@/lib/validate";



const presets = [

  { label: "Vulnerable sample", path: "examples/vulnerable-program", tag: "40+ findings" },

  { label: "Clean sample", path: "examples/clean-program", tag: "0 high/critical" },

];



function ScanPageInner() {

  const router = useRouter();

  const searchParams = useSearchParams();

  const [path, setPath] = useState("examples/vulnerable-program");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [cliOk, setCliOk] = useState<boolean | null>(null);

  const [recent, setRecent] = useState<ScanReport[]>([]);



  useEffect(() => {

    if (searchParams.get("demo") === "vulnerable") {

      setPath("examples/vulnerable-program");

    }

  }, [searchParams]);



  useEffect(() => {

    if (searchParams.get("demo") !== "vulnerable" || cliOk !== false) return;

    router.replace(sampleReportUrl("vulnerable"));

  }, [searchParams, cliOk, router]);



  useEffect(() => {

    fetch("/api/rules")

      .then((r) => setCliOk(r.ok))

      .catch(() => setCliOk(false));

    fetch("/api/reports")

      .then((r) => r.json())

      .then((data) => {

        if (!Array.isArray(data)) return setRecent([]);

        setRecent(data.filter(isScanReport).slice(0, 5));

      })

      .catch(() => setRecent([]));

  }, []);



  async function onScan(target = path) {

    setLoading(true);

    setError("");

    try {

      const res = await fetch("/api/scan", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ path: target }),

      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Scan failed");

      router.push(`/report/${data.id}`);

    } catch (e) {

      setError(e instanceof Error ? e.message : "Scan failed");

    } finally {

      setLoading(false);

    }

  }



  const cliChecking = cliOk === null;

  const scanDisabled = loading || cliChecking;



  return (

    <div className="mx-auto max-w-2xl space-y-8">

      <PageHeader

        refId="SCAN-001"

        title="Program scan"

        subtitle="Point the analyzer at an Anchor workspace. Results include severity, rule ID, source context, and fix guidance."

      />



      {cliOk === false && (

        <div className="panel">

          <div className="panel-inner space-y-3">

            <p className="label text-[var(--critical)]">CLI not ready on this host</p>

            <p className="text-xs text-[var(--ink-muted)]">Build the scanner locally for live analysis:</p>

            <pre className="code-block p-3 text-xs">cargo build -p anchor-prep</pre>

            <div className="flex flex-wrap gap-2 pt-1">

              <Link href={sampleReportUrl("vulnerable")} className="btn btn-primary text-[10px]">

                Open bundled vulnerable report

              </Link>

              <Link href="/compare" className="btn btn-ghost text-[10px]">

                Compare samples

              </Link>

            </div>

          </div>

        </div>

      )}



      <div className="panel relative overflow-hidden" aria-busy={loading}>

        {loading && <div className="scan-beam" aria-hidden />}

        <div className="panel-inner space-y-5">

          <div>

            <label htmlFor="scan-path" className="label mb-2 block">Target path</label>

            <input

              id="scan-path"

              className="w-full border border-[var(--line)] bg-black/40 px-4 py-3 font-mono text-sm outline-none focus-visible:border-[var(--amber)] focus-visible:ring-2 focus-visible:ring-[var(--amber)]/30"

              value={path}

              onChange={(e) => setPath(e.target.value)}

              placeholder="examples/vulnerable-program"

            />

          </div>



          <div>

            <p className="label mb-2">Presets</p>

            <div className="flex flex-wrap gap-2">

              {presets.map((p) => (

                <button

                  key={p.path}

                  type="button"

                  onClick={() => setPath(p.path)}

                  className={`btn btn-ghost text-[10px] ${path === p.path ? "active" : ""}`}

                >

                  {p.label}

                  <span className="text-[var(--ink-faint)]">· {p.tag}</span>

                </button>

              ))}

            </div>

          </div>



          <div className="flex flex-wrap gap-2">

            <button type="button" disabled={scanDisabled || cliOk === false} onClick={() => onScan()} className="btn btn-primary flex-1">

              {cliChecking ? "Checking scanner…" : loading ? "Analyzing source…" : "Run scan"}

            </button>

            <button

              type="button"

              disabled={scanDisabled || cliOk === false}

              onClick={() => {

                setPath("examples/vulnerable-program");

                onScan("examples/vulnerable-program");

              }}

              className="btn btn-ghost text-[10px]"

            >

              Try vulnerable sample

            </button>

          </div>



          <div aria-live="polite">

            {error && (

              <p className="border border-[var(--critical)] bg-[rgba(255,77,109,0.08)] p-3 text-xs text-[var(--critical)]">

                {error}

              </p>

            )}

          </div>

        </div>

      </div>



      <section className="space-y-3">

        <h2 className="label">Recent scans</h2>

        {recent.length === 0 ? (

          <div className="panel">

            <div className="panel-inner text-xs text-[var(--ink-muted)]">

              No scans yet — try the vulnerable sample or open the{" "}

              <Link href="/compare" className="text-[var(--amber)]">sample comparison</Link>.

            </div>

          </div>

        ) : (

          <div className="space-y-2">

            {recent.map((r) => (

              <Link key={r.id} href={`/report/${r.id}`} className="panel block hover:border-[var(--amber)]/40">

                <div className="panel-inner flex flex-wrap items-center justify-between gap-3 text-xs">

                  <span className="truncate text-[var(--ink-muted)]">{r.project_path.split(/[/\\]/).pop()}</span>

                  <span className="shrink-0 text-[var(--ink-faint)]">{r.scanned_at.slice(0, 16).replace("T", " ")}</span>

                  <span className="shrink-0 font-mono text-[var(--amber)]">

                    {r.findings.length} findings · {highSeverityCount(r)} high/crit

                  </span>

                </div>

              </Link>

            ))}

          </div>

        )}

      </section>

    </div>

  );

}



export default function ScanPage() {

  return (

    <Suspense fallback={<div className="panel animate-pulse"><div className="panel-inner h-48" /></div>}>

      <ScanPageInner />

    </Suspense>

  );

}

