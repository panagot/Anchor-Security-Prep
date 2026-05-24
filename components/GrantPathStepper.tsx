"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { sampleReportUrl } from "@/lib/demo-routes";

const STEPS = [
  { n: 1, label: "Compare", href: "/compare", match: ["/compare"] },
  { n: 2, label: "Rule detail", href: "/rules/asp001", match: ["/rules"] },
  { n: 3, label: "Full report", href: sampleReportUrl("vulnerable"), match: ["/report"] },
  { n: 4, label: "CI setup", href: "/integrations", match: ["/integrations"] },
] as const;

export function GrantPathStepper() {
  const pathname = usePathname();
  const active =
    STEPS.find((s) => s.match.some((m) => pathname === m || (m !== "/compare" && pathname.startsWith(m))))?.n ?? 0;

  return (
    <nav aria-label="Grant review progress" className="panel border-[var(--amber)]/25">
      <div className="panel-inner flex flex-wrap items-center gap-2 py-3">
        <span className="label mr-1 shrink-0 text-[var(--amber)]">Grant path</span>
        {STEPS.map((s) => {
          const isActive = s.n === active;
          const isDone = active > s.n;
          return (
            <Link
              key={s.n}
              href={s.href}
              className={`flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-[11px] transition-colors ${
                isActive
                  ? "border-[var(--amber)] bg-[var(--amber-dim)] text-[var(--amber)]"
                  : isDone
                    ? "border-[var(--phosphor)]/40 text-[var(--phosphor)] hover:border-[var(--phosphor)]"
                    : "border-[var(--line)] text-[var(--ink-muted)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center font-mono text-[10px] font-bold ${
                  isActive ? "bg-[var(--amber)] text-[var(--bg)]" : isDone ? "bg-[var(--phosphor-dim)]" : "bg-black/30"
                }`}
              >
                {s.n}
              </span>
              {s.label}
            </Link>
          );
        })}
        <Link href="/reviewer" className="ml-auto text-[10px] text-[var(--ink-faint)] hover:text-[var(--amber)]">
          Overview →
        </Link>
      </div>
    </nav>
  );
}
