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

/** Golden regression fixtures — keep in sync with fixtures/asp* and fixtures_test.rs */
export const FIXTURE_STATUS = "21/26 today · 26/26 by M2 finish";

export const M1: Milestone = {
  id: "m1",
  title: "Milestone 1 — Begin",
  subtitle: "CLI beta, public website, and CI foundation — $5,000 on acceptance",
  budget: "$5,000",
  progress: 85,
  statusLabel: "~85% complete (prototype shipped)",
  summary:
    "Kick off the grant with a working CLI, live public website, and CI scaffolding. 21 of 26 rules already have golden regression fixtures; remaining five (ASP013, ASP014, ASP016, ASP018, ASP020) close during M2.",
  deliverables: [
    { label: "Rust CLI with 26 Anchor security rules", done: true, detail: "ASP001–ASP026 active" },
    { label: "21/26 golden regression fixtures", done: true, detail: "cargo test -p anchor-prep — 24 tests" },
    { label: "JSON, Markdown, and SARIF 2.1 export", done: true, detail: "Bundled SARIF on sample report" },
    { label: "Core commands: scan, rules, doctor, baseline, init", done: true },
    { label: "Public website / dashboard on Vercel", done: true, detail: "anchor-security-prep.vercel.app" },
    { label: "Compare, rules catalog, report explorer, integrations pages", done: true },
    { label: "Overview walkthrough (/reviewer)", done: true, detail: "~2 min evaluation path" },
    { label: "GitHub Actions workflow template + composite action", done: true },
    { label: "Vulnerable + clean example programs", done: true, detail: "41 vs 0 high/critical demo" },
    { label: "v0.2.0 release binaries (linux / mac / win)", done: true },
    { label: "Phase 1 external benchmark", done: true, detail: "coral-xyz/sealevel-attacks" },
  ],
  acceptance: [
    { label: "Website live and accessible without install", done: true, detail: "Vercel production deploy" },
    { label: "Compare demo: 40+ findings vs 0 high/critical", done: true },
    { label: "cargo test -p anchor-prep passes", done: true, detail: "24 tests · 21/26 fixtures" },
    { label: "anchor-prep init scaffolds CI workflow", done: true },
    { label: "SARIF export on bundled sample report", done: true },
  ],
  outcomes: [
    "Solana devs discover and try the tool via the public website — no Rust install required to evaluate",
    "Teams scaffold CI with one command and get SARIF-ready scans on day one",
    "Reviewers can verify value in under 2 minutes at /reviewer",
    "Open-source repo and release binaries establish trust before v1.0 finish",
  ],
  demoLinks: [
    { label: "Grant walkthrough", href: "/reviewer" },
    { label: "Website compare", href: "/compare" },
    { label: "Rule catalog", href: "/rules" },
    { label: "CI integrations", href: "/integrations" },
  ],
};

export const M2: Milestone = {
  id: "m2",
  title: "Milestone 2 — Finish",
  subtitle: "Production v1.0 + 12 months dedicated upkeep — $5,000 on acceptance",
  budget: "$5,000",
  progress: 40,
  statusLabel: "Paid on v1.0 completion + upkeep start",
  summary:
    "Ship production v1.0: complete all 26/26 fixtures, publish a public accuracy benchmark on 3–5 OSS Anchor repos, add 10–15 high-impact rules from recent audit reports, and begin 12 months of dedicated upkeep (issue triage, FP tuning, Anchor 0.30+ compat, adoption).",
  deliverables: [
    { label: "26/26 rule fixtures with golden regression tests", done: false, detail: "21/26 today — ASP013, 014, 016, 018, 020 remaining" },
    { label: "Add 10–15 new high-impact rules (with fixtures)", done: false, detail: "Remaining accounts, account reload after CPI, Token-2022 hooks, admin migration" },
    { label: "Public accuracy benchmark report (3–5 OSS Anchor repos)", done: false, detail: "FP/FN notes published in BENCHMARK_RESULTS.md" },
    { label: "Per-rule confidence scores + config/allow suppression", done: false, detail: "High/medium/low + .anchor-prep.toml suppressions" },
    { label: "Audit checklist export from reports", done: false },
    { label: "Website v1.0 — reviewer, milestones, integrations, rule docs", done: true, detail: "Core pages live; polish ongoing" },
    { label: "v1.0 release binaries on GitHub", done: false, detail: "v0.2.0 today" },
    { label: "VS Code extension scaffolding (syntax + scan-on-save hook)", done: false, detail: "Optional high-leverage IDE surface" },
    { label: "12 months upkeep — issue triage, bugs, Anchor 0.30+ compat", done: false, detail: "48h critical SLA; 2-week minor compat" },
    { label: "12 months upkeep — FP tuning, docs, adoption outreach", done: false, detail: "Monthly review; hackathon/Discord integration" },
  ],
  acceptance: [
    { label: "26/26 fixtures; cargo test -p anchor-prep passes", done: false },
    { label: "Public benchmark report on ≥3 OSS Anchor repos with FP/FN notes", done: false },
    { label: "Vulnerable ≥40 / ≥29 high+critical; clean 0 high/critical", done: true },
    { label: "Website v1.0 live (/reviewer, /m1, /m2, /integrations)", done: true },
    { label: "v1.0 release binaries published", done: false },
    { label: "12-month upkeep plan documented; adoption metrics tracked", done: false },
  ],
  outcomes: [
    "Production-ready tool with published accuracy data indie devs can trust",
    "Expanded rule set grounded in Zellic, OtterSec, Neodyme, and 2025–2026 post-mortems",
    "12 months of dedicated maintenance keeps rules accurate as Anchor evolves",
    "Adoption grows through CI integrations, Solana Stack, and hackathon defaults",
  ],
  demoLinks: [
    { label: "Grant walkthrough", href: "/reviewer" },
    { label: "Compare demo", href: "/compare" },
    { label: "Benchmark results", href: "https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/BENCHMARK_RESULTS.md" },
  ],
};

export const GRANT_BUDGET = {
  total: "$10,000",
  m1: "$5,000",
  m2: "$5,000",
  upkeepMonths: 12,
} as const;

export const ADOPTION_TARGETS = {
  stars: 75,
  ciIntegrations: 15,
  programsScanned: 40,
  findingsResolved: 25,
  note: "or equivalent traction (Solana Stack mention, Colosseum default recommendation)",
} as const;
