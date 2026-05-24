import { ECOSYSTEM_STATS } from "@/lib/incidents";

const ITEMS = [
  { value: String(ECOSYSTEM_STATS.rulesActive), label: "Active rules" },
  { value: "MIT", label: "License" },
  { value: "SARIF", label: "CI export" },
  { value: "15/26", label: "Fixtures tested" },
] as const;

export function TrustStrip() {
  return (
    <div className="flex flex-wrap gap-6 border-y border-[var(--line)] py-4">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-baseline gap-2">
          <span className="display text-lg font-bold text-[var(--amber)]">{item.value}</span>
          <span className="text-xs text-[var(--ink-faint)]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
