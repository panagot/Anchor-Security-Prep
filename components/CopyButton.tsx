"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), 1500);
  }

  const labelText = status === "copied" ? "Copied" : status === "failed" ? "Failed" : label;

  return (
    <button
      type="button"
      onClick={copy}
      className="btn btn-ghost text-[10px]"
      aria-label={`${labelText} to clipboard`}
    >
      {labelText}
    </button>
  );
}
