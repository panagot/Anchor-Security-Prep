import type { Metadata } from "next";

import { MilestoneView } from "@/components/MilestoneView";
import { M1, M2 } from "@/lib/milestones";

export const metadata: Metadata = {
  title: "Milestone 1 — Begin",
  description:
    "Grant M1: CLI beta, public website, CI foundation — $5,000 on acceptance.",
};

export default function M1Page() {
  return <MilestoneView milestone={M1} other={M2} />;
}
