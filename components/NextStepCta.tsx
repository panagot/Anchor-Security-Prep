import Link from "next/link";

type NextStep = {
  label: string;
  href: string;
  description?: string;
};

export function NextStepCta({ step, next }: { step: string; next: NextStep }) {
  return (
    <section className="panel border-[var(--amber)]/30">
      <div className="panel-inner flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label text-[var(--amber)]">{step}</p>
          {next.description && (
            <p className="mt-1 max-w-md text-sm text-[var(--ink-muted)]">{next.description}</p>
          )}
        </div>
        <Link href={next.href} className="btn btn-primary shrink-0">
          {next.label} →
        </Link>
      </div>
    </section>
  );
}
