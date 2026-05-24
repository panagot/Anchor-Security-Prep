export type MilestoneItem = {
  label: string;
  done: boolean;
  detail?: string;
};

export type Milestone = {
  id: "m1" | "m2";
  title: string;
  subtitle: string;
  budget: string;
  progress: number;
  statusLabel: string;
  summary: string;
  deliverables: MilestoneItem[];
  acceptance: MilestoneItem[];
  outcomes: string[];
  demoLinks: { label: string; href: string }[];
};

export const M1: Milestone = {
  id: "m1",
  title: "Milestone 1 — CLI core v1.0",
  subtitle: "Production-grade static analyzer for Anchor programs",
  budget: "$2,500",
  progress: 90,
  statusLabel: "~90% complete",
  summary:
    "Ship a reliable, open-source CLI that catches exploit-class Anchor patterns before audit. Every rule gets a golden regression test; outputs feed CI and the dashboard.",
  deliverables: [
    { label: "26 production rules", done: true, detail: "ASP001–ASP026 active in catalog" },
    { label: "Per-rule fixture regression tests", done: false, detail: "21/26 today — M1 target: 26/26" },
    { label: "Commands: scan, rules, doctor, baseline, audit-prep, init", done: true },
    { label: "JSON, Markdown, SARIF export", done: true, detail: "Bundled SARIF on vulnerable sample" },
    { label: ".anchor-prep.toml configuration", done: true },
    { label: "Expanded vulnerable + clean examples", done: true, detail: "41 vs 0 high/critical demo" },
    { label: "Published release binaries (linux / mac / win)", done: true, detail: "v0.2.0 tagged" },
    { label: "External benchmark (Phase 1)", done: true, detail: "coral-xyz/sealevel-attacks scanned" },
  ],
  acceptance: [
    { label: "cargo test -p anchor-prep passes", done: true, detail: "24 tests" },
    { label: "Vulnerable example: 40+ findings, 29 high/critical", done: true },
    { label: "Clean example: 0 high/critical", done: true },
    { label: "Release binaries on GitHub", done: true, detail: "v0.2.0 release workflow" },
  ],
  outcomes: [
    "Indie devs run one command before every audit or mainnet deploy",
    "Hackathon teams gate PRs with --fail-on high",
    "Baseline diff suppresses known noise; CI fails only on new findings",
    "Accuracy benchmark published with honest FP notes",
  ],
  demoLinks: [
    { label: "Rule catalog", href: "/rules" },
    { label: "Sample report", href: "/report/e8494079-b4d7-43b7-a924-461d976fe5da" },
    { label: "Benchmark results", href: "https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/BENCHMARK_RESULTS.md" },
  ],
};

export const M2: Milestone = {
  id: "m2",
  title: "Milestone 2 — CI + dashboard v1.0",
  subtitle: "Embed security into every PR with a reviewer-ready demo",
  budget: "$3,000",
  progress: 95,
  statusLabel: "~95% complete",
  summary:
    "Make Anchor Security Prep invisible friction in developer workflows: one init command scaffolds GitHub Actions, SARIF lands in Code Scanning, and grant reviewers can evaluate value in under two minutes — no install.",
  deliverables: [
    { label: "Composite GitHub Action", done: true, detail: "templates/ + .github/workflows/ci.yml" },
    { label: "SARIF upload with full rule catalog + helpUri", done: true },
    { label: "Web dashboard (compare, scan, report, rules)", done: true, detail: "Live on Vercel" },
    { label: "Integrations page with copy-paste CI snippets", done: true },
    { label: "Grant reviewer walkthrough (/reviewer)", done: true, detail: "~2 min guided path" },
    { label: "Server-rendered compare (no empty demo state)", done: true },
    { label: "Audit checklist export from reports", done: false, detail: "Planned — export from report JSON" },
    { label: "End-to-end PR → scan → SARIF → dashboard demo video", done: false, detail: "Planned post-grant" },
  ],
  acceptance: [
    { label: "anchor-prep init scaffolds working workflow", done: true },
    { label: "Hosted demo URL for grant reviewers", done: true, detail: "anchor-security-prep.vercel.app/reviewer" },
    { label: "Compare → report → integrations path under 2 min", done: true },
    { label: "SARIF export works on bundled sample", done: true },
  ],
  outcomes: [
    "Security signal on every Anchor PR without custom YAML expertise",
    "Reviewers see side-by-side vulnerable vs clean proof in one click",
    "SARIF annotations surface findings inline on GitHub",
    "Pre-audit workflow complements STRIDE — reduces audit scope",
  ],
  demoLinks: [
    { label: "Grant walkthrough", href: "/reviewer" },
    { label: "Compare demo", href: "/compare" },
    { label: "CI integrations", href: "/integrations" },
  ],
};
