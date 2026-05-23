import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--line)] py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 text-[10px] text-[var(--ink-faint)]">
        <p>Anchor Security Prep · MIT · Solana public good</p>
        <nav className="flex flex-wrap gap-4" aria-label="Footer">
          <Link href="/reviewer" className="hover:text-[var(--amber)]">Grant review</Link>
          <Link href="/compare" className="hover:text-[var(--amber)]">Compare samples</Link>
          <Link href="/integrations" className="hover:text-[var(--amber)]">CI setup</Link>
          <a
            href="https://github.com/panagot/Anchor-Security-Prep"
            className="hover:text-[var(--amber)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
        <p>v0.2 · 26 rules · <a href="https://anchor-security-prep.vercel.app" className="hover:text-[var(--amber)]">Live demo</a></p>
      </div>
    </footer>
  );
}
