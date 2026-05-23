import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Program scan",
  description: "Run anchor-prep against an Anchor workspace or open bundled sample reports.",
};

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
