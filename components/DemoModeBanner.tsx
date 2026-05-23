import Link from "next/link";

/** Shown on Vercel / when CLI is unavailable — clarifies bundled vs live scans */
export function DemoModeBanner() {
  return (
    <div className="panel border-[var(--amber)]/30">
      <div className="panel-inner flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--ink-muted)]">
        <p>
          <span className="label text-[var(--amber)]">Demo mode</span>
          {" · "}
          Bundled sample data — no install required. Clone the repo and run{" "}
          <code className="text-[var(--amber)]">cargo build -p anchor-prep</code> for live scans.
        </p>
        <Link href="/reviewer" className="btn btn-ghost shrink-0 text-[10px]">
          Grant walkthrough
        </Link>
      </div>
    </div>
  );
}
