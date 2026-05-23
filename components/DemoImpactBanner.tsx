import Link from "next/link";

import { DEMO_IMPACT } from "@/lib/demo-impact";
import { sampleReportUrl } from "@/lib/demo-routes";

/** Client-safe banner — stats from bundled samples (see lib/demo-impact.ts) */
export function DemoImpactBanner() {
  const { vulnerable, clean } = DEMO_IMPACT;

  return (
    <div className="panel border-[var(--amber)]/30">
      <div className="panel-inner flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <p className="label text-[var(--amber)]">Pre-audit value demo</p>
          <p className="mt-1 text-[var(--ink-muted)]">
            Vulnerable example:{" "}
            <strong className="font-mono text-[var(--ink)]">{vulnerable.total} findings</strong>
            {" "}({vulnerable.highCritical} high/critical) vs clean reference:{" "}
            <strong className="font-mono text-[var(--phosphor)]">{clean.highCritical} high/critical</strong>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/reviewer" className="btn btn-ghost text-[10px]">
            Grant review (~2 min)
          </Link>
          <Link href={sampleReportUrl("vulnerable")} className="btn btn-primary text-[10px]">
            Full report
          </Link>
        </div>
      </div>
    </div>
  );
}
