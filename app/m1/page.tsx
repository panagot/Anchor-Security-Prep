import type { Metadata } from "next";

import { MilestoneView } from "@/components/MilestoneView";
import { M1, M2 } from "@/lib/milestones";

export const metadata: Metadata = {
  title: "Milestone 1 — CLI core v1.0",
  description:
    "Grant M1 deliverables: 26 Anchor rules, fixtures, SARIF export, release binaries, and external benchmark — $2,500.",
};

export default function M1Page() {
  return <MilestoneView milestone={M1} other={M2} />;
}
