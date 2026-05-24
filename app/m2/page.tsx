import type { Metadata } from "next";

import { MilestoneView } from "@/components/MilestoneView";
import { M1, M2 } from "@/lib/milestones";

export const metadata: Metadata = {
  title: "Milestone 2 — Finish",
  description:
    "Grant M2: production v1.0, website polish, and 12 months dedicated upkeep — $5,000 on acceptance.",
};

export default function M2Page() {
  return <MilestoneView milestone={M2} other={M1} />;
}
