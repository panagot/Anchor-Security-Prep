import type { Metadata } from "next";

import { MilestoneView } from "@/components/MilestoneView";
import { M1, M2 } from "@/lib/milestones";

export const metadata: Metadata = {
  title: "Milestone 2 — CI + dashboard v1.0",
  description:
    "Grant M2 deliverables: GitHub Actions, SARIF Code Scanning, live dashboard, grant reviewer path — $3,000.",
};

export default function M2Page() {
  return <MilestoneView milestone={M2} other={M1} />;
}
