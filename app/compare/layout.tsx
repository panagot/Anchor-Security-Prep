import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample comparison",
  description: "Side-by-side vulnerable vs clean Anchor program scan — 41 findings vs 0 high/critical on the same 26-rule engine.",
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
