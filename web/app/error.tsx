"use client";

import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="panel">
      <div className="panel-inner space-y-4">
        <p className="label text-[var(--critical)]">Application error</p>
        <h1 className="display text-2xl font-bold">Something went wrong</h1>
        <p className="text-sm text-[var(--ink-muted)]">{error.message}</p>
        <div className="flex gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">Try again</button>
          <Link href="/" className="btn btn-ghost">Home</Link>
        </div>
      </div>
    </div>
  );
}
