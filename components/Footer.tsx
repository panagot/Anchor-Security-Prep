import Link from "next/link";

import { FIXTURE_LABEL } from "@/lib/fixture-coverage";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--line)] py-10">
      <div className="mx-auto max-w-6xl space-y-6 px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="display text-sm font-bold text-[var(--ink)]">Anchor Security Prep</p>
            <p className="mt-1 text-xs text-[var(--ink-faint)]">MIT · Solana public good · Pre-audit static analysis</p>
          </div>
          <Link href="/reviewer" className="btn btn-primary text-[10px]">
            Overview (~2 min)
          </Link>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--ink-faint)]" aria-label="Footer">
          <Link href="/m1" className="hover:text-[var(--amber)]">M1 CLI</Link>
          <Link href="/m2" className="hover:text-[var(--amber)]">M2 CI + dashboard</Link>
          <Link href="/compare" className="hover:text-[var(--amber)]">Compare</Link>
          <Link href="/rules" className="hover:text-[var(--amber)]">Rules</Link>
          <Link href="/integrations" className="hover:text-[var(--amber)]">CI setup</Link>
          <a
            href="https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/GRANT.md"
            className="hover:text-[var(--amber)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Funding proposal
          </a>
          <a
            href="https://github.com/panagot/Anchor-Security-Prep"
            className="hover:text-[var(--amber)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
        <p className="text-[10px] text-[var(--ink-faint)]">
          v0.2 · 26 rules · {FIXTURE_LABEL} fixtures ·{" "}
          <a href="https://anchor-security-prep.vercel.app" className="hover:text-[var(--amber)]">
            Live demo
          </a>
        </p>
      </div>
    </footer>
  );
}
