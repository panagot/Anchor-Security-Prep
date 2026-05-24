import type { Metadata } from "next";

import { MilestoneView } from "@/components/MilestoneView";
import { M1, M2 } from "@/lib/milestones";

export const metadata: Metadata = {
  title: "Milestone 2 — Finish",
  description:
    "M2 Finish: production v1.0, website polish, and 12 months dedicated upkeep.",
};

export default function M2Page() {
  return <MilestoneView milestone={M2} other={M1} />;
}
