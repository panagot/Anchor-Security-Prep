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
  title: "Milestone 1 — Begin",
  subtitle: "CLI beta, public website, and CI foundation — $5,000 on acceptance",
  budget: "$5,000",
  progress: 85,
  statusLabel: "~85% complete (prototype shipped)",
  summary:
    "Kick off the grant with a working CLI, live public website, and CI scaffolding. Indie devs and grant reviewers can scan Anchor programs, explore findings on the web, and scaffold GitHub Actions — before v1.0 polish and the 12-month upkeep period in Milestone 2.",
  deliverables: [
    { label: "Rust CLI with 26 Anchor security rules", done: true, detail: "ASP001–ASP026 active" },
    { label: "JSON, Markdown, and SARIF 2.1 export", done: true, detail: "Bundled SARIF on sample report" },
    { label: "Core commands: scan, rules, doctor, baseline, init", done: true },
    { label: "Public website / dashboard on Vercel", done: true, detail: "anchor-security-prep.vercel.app" },
    { label: "Compare, rules catalog, report explorer, integrations pages", done: true },
    { label: "Grant reviewer walkthrough (/reviewer)", done: true, detail: "~2 min evaluation path" },
    { label: "GitHub Actions workflow template + composite action", done: true },
    { label: "Vulnerable + clean example programs", done: true, detail: "41 vs 0 high/critical demo" },
    { label: "v0.2.0 release binaries (linux / mac / win)", done: true },
    { label: "Phase 1 external benchmark", done: true, detail: "coral-xyz/sealevel-attacks" },
  ],
  acceptance: [
    { label: "Website live and accessible without install", done: true, detail: "Vercel production deploy" },
    { label: "Compare demo: 40+ findings vs 0 high/critical", done: true },
    { label: "cargo test -p anchor-prep passes", done: true, detail: "24 tests, 21/26 fixtures" },
    { label: "anchor-prep init scaffolds CI workflow", done: true },
    { label: "SARIF export on bundled sample report", done: true },
  ],
  outcomes: [
    "Solana devs discover and try the tool via the public website — no Rust install required to evaluate",
    "Teams scaffold CI with one command and get SARIF-ready scans on day one",
    "Grant reviewers verify value in under 2 minutes at /reviewer",
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
  progress: 45,
  statusLabel: "Paid on v1.0 completion + upkeep start",
  summary:
    "Complete production v1.0 across CLI, website, and CI. Then deliver 12 months of dedicated upkeep: issue triage, false-positive tuning, Anchor version compatibility, documentation, and adoption outreach. This milestone closes the grant and begins the maintenance SLA.",
  deliverables: [
    { label: "CLI v1.0 — 26/26 rule fixtures with golden tests", done: false, detail: "21/26 today" },
    { label: "Accuracy benchmark on 3+ open-source Anchor repos", done: false, detail: "Phase 1 done; expand in M2" },
    { label: "Audit checklist export from reports", done: false },
    { label: "Website v1.0 — polished reviewer, M1/M2, and docs pages", done: true, detail: "Core pages live; polish ongoing" },
    { label: "End-to-end PR → scan → SARIF → dashboard flow documented", done: true },
    { label: "40–50 rules target with audit-report grounding", done: false, detail: "26 rules today; expand during upkeep" },
    { label: "12 months dedicated upkeep — issue triage & bug fixes", done: false, detail: "Starts on M2 acceptance" },
    { label: "12 months — false-positive tuning & Anchor compat", done: false, detail: "Monthly review cycle; 2-week compat SLA" },
    { label: "12 months — documentation, releases, adoption outreach", done: false, detail: "Tutorials, Discord, hackathon integration" },
  ],
  acceptance: [
    { label: "26/26 rule fixtures; cargo test -p anchor-prep passes", done: false },
    { label: "Vulnerable ≥40 findings / ≥29 high+critical; clean 0 high/critical", done: true },
    { label: "Website v1.0 live with /reviewer, /m1, /m2, /integrations", done: true },
    { label: "Published v1.0 release binaries on GitHub", done: false, detail: "v0.2.0 today; v1.0 at finish" },
    { label: "12-month upkeep plan published in repo (CONTRIBUTING + CHANGELOG)", done: false },
    { label: "Adoption metrics tracked (stars, CI integrations, repos scanned)", done: false },
  ],
  outcomes: [
    "Production-ready tool indie devs trust before mainnet or audit",
    "Website remains the primary discovery and demo surface for the ecosystem",
    "12 months of dedicated maintenance keeps rules accurate as Anchor evolves",
    "Adoption grows through hackathons, CI integrations, and community FP feedback",
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
