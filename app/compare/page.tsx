import { CompareClient, type CompareResult } from "./CompareClient";
import { getBundledSampleReport } from "@/lib/static-data";

function toCompareResult(kind: "vulnerable" | "clean"): CompareResult | null {
  const report = getBundledSampleReport(kind);
  if (!report) return null;
  return { report, reportId: report.id, source: "sample" };
}

/** Server-rendered bundled samples so crawlers and first paint always show findings. */
export default function ComparePage() {
  return (
    <CompareClient
      initialVuln={toCompareResult("vulnerable")}
      initialClean={toCompareResult("clean")}
    />
  );
}
