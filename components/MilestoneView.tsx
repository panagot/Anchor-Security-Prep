import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";
import type { Milestone } from "@/lib/milestones";

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="label text-[var(--amber)]">Progress</span>
        <span className="font-mono text-[var(--ink)]">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden border border-[var(--line)] bg-black/40">
        <div
          className="h-full bg-[var(--amber)] transition-all"
          style={{ width: `${value}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

function ItemList({
  title,
  items,
}: {
  title: string;
  items: Milestone["deliverables"];
}) {
  return (
    <section className="panel">
      <div className="panel-inner space-y-4">
        <h2 className="display text-lg font-bold">{title}</h2>
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.label}
              className={`flex gap-3 border border-[var(--line)] p-3 ${
                item.done ? "bg-[var(--phosphor-dim)]/30" : "bg-black/20"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-[10px] font-bold ${
                  item.done
                    ? "bg-[var(--phosphor)] text-[var(--bg)]"
                    : "border border-[var(--line-strong)] text-[var(--ink-faint)]"
                }`}
                aria-hidden
              >
                {item.done ? "✓" : "○"}
              </span>
              <div>
                <p className={`text-sm font-semibold ${item.done ? "text-[var(--ink)]" : "text-[var(--ink-muted)]"}`}>
                  {item.label}
                </p>
                {item.detail && (
                  <p className="mt-1 text-xs text-[var(--ink-faint)]">{item.detail}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function MilestoneView({ milestone, other }: { milestone: Milestone; other?: Milestone }) {
  const doneCount = milestone.deliverables.filter((d) => d.done).length;

  return (
    <div className="space-y-10">
      <PageHeader
        refId={milestone.id.toUpperCase()}
        title={milestone.title}
        subtitle={milestone.subtitle}
        actions={
          <div className="text-right">
            <p className="label text-[var(--amber)]">Grant budget</p>
            <p className="display text-2xl font-bold text-[var(--ink)]">{milestone.budget}</p>
            <p className="mt-1 text-xs text-[var(--phosphor)]">{milestone.statusLabel}</p>
          </div>
        }
      />

      <div className="panel border-[var(--amber)]/30">
        <div className="panel-inner space-y-5">
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{milestone.summary}</p>
          <ProgressBar value={milestone.progress} />
          <p className="text-xs text-[var(--ink-faint)]">
            {doneCount} of {milestone.deliverables.length} deliverables complete
          </p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {milestone.outcomes.map((outcome, i) => (
          <div key={outcome} className="panel">
            <div className="panel-inner">
              <p className="label mb-2">Outcome {i + 1}</p>
              <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{outcome}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <ItemList title="Deliverables" items={milestone.deliverables} />
        <ItemList title="Acceptance criteria" items={milestone.acceptance} />
      </div>

      <section className="panel border-[var(--phosphor)]/30">
        <div className="panel-inner space-y-4">
          <h2 className="display text-lg font-bold">See it today</h2>
          <p className="text-sm text-[var(--ink-muted)]">
            Reviewers can verify shipped work now — no install required.
          </p>
          <div className="flex flex-wrap gap-2">
            {milestone.demoLinks.map((link) =>
              link.href.startsWith("http") ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="btn btn-ghost text-[10px]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label} ↗
                </a>
              ) : (
                <Link key={link.href} href={link.href} className="btn btn-primary text-[10px]">
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
        <Link href="/reviewer" className="btn btn-ghost text-[10px]">
          ← Grant walkthrough
        </Link>
        {other && (
          <Link href={`/${other.id}`} className="btn btn-ghost text-[10px]">
            View {other.id.toUpperCase()} →
          </Link>
        )}
        <a
          href="https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/GRANT.md"
          className="btn btn-ghost text-[10px]"
          target="_blank"
          rel="noopener noreferrer"
        >
          Full proposal ↗
        </a>
      </div>
    </div>
  );
}
