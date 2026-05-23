"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/scan", label: "Scan" },
  { href: "/rules", label: "Rules" },
  { href: "/compare", label: "Compare" },
  { href: "/integrations", label: "Integrations" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(10,10,12,0.85)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center border border-[var(--amber)] bg-[var(--amber-dim)] text-xs font-bold text-[var(--amber)]">
            ASP
          </span>
          <div className="hidden sm:block">
            <div className="display text-base font-bold leading-none text-[var(--ink)] group-hover:text-[var(--amber)] transition-colors">
              Anchor Security Prep
            </div>
            <div className="label mt-1">Pre-audit static analysis</div>
          </div>
        </Link>

        <nav className="flex max-w-[60vw] items-center gap-4 overflow-x-auto sm:max-w-none sm:gap-5" aria-label="Main">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link shrink-0"
                data-active={active}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/scan?demo=vulnerable" className="btn btn-primary shrink-0 text-[10px]">
            Run demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
