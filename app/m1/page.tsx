import type { Metadata } from "next";

import { MilestoneView } from "@/components/MilestoneView";
import { M1, M2 } from "@/lib/milestones";

export const metadata: Metadata = {
  title: "Milestone 1 — Begin",
  description:
    "M1 Begin: CLI beta, public website, and CI foundation.",
};

export default function M1Page() {
  return <MilestoneView milestone={M1} other={M2} />;
}
