import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";

import { GrantPathStepper } from "@/components/GrantPathStepper";
import { PageHeader } from "@/components/PageHeader";
import { RulesCatalog } from "@/components/RulesCatalog";
import type { RuleInfo } from "@/lib/types";
import { checkCliAvailable, runRulesJson } from "@/lib/scanner";

export const metadata: Metadata = {
  title: "Rule catalog",
  description: "26 Anchor-native security rules mapped to Sealevel attack classes — signer, PDA, CPI, token constraints.",
};

function loadStaticRules(): RuleInfo[] | null {
  const p = path.join(process.cwd(), "public", "rules.json");
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as RuleInfo[];
  } catch {
    return null;
  }
}

export default function RulesPage() {
  let rules: RuleInfo[] = [];
  let error: string | undefined;
  let source = "cli";

  const staticRules = loadStaticRules();
  if (staticRules?.length) {
    rules = staticRules;
    source = "bundled";
  } else {
    const cli = checkCliAvailable();
    if (!cli.ok) {
      error = cli.message;
    } else {
      try {
        rules = JSON.parse(runRulesJson()) as RuleInfo[];
      } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load rules";
      }
    }
  }

  return (
    <div className="space-y-8">
      <GrantPathStepper />

      <PageHeader
        refId="RULE-CAT"
        title="Rule catalog"
        subtitle={`${rules.length} static checks mapped to common Solana exploit classes — signer bypass, CPI, PDA, token binding, and more.`}
      />

      {source === "bundled" && (
        <p className="text-xs text-[var(--ink-faint)]">
          Bundled catalog (offline demo). Clone the repo for live rule updates from the CLI.
        </p>
      )}

      {error && !rules.length && (
        <div className="panel">
          <div className="panel-inner space-y-3">
            <p className="label text-[var(--critical)]">Setup required</p>
            <p className="text-sm text-[var(--ink-muted)]">{error}</p>
            <pre className="code-block p-3 text-xs">cargo build -p anchor-prep</pre>
          </div>
        </div>
      )}

      {rules.length > 0 && <RulesCatalog rules={rules} />}

      <div className="flex flex-wrap gap-3">
        <Link href="/compare" className="btn btn-ghost text-[10px]">
          See rules in action →
        </Link>
        <Link href="/reviewer" className="btn btn-ghost text-[10px]">
          Grant walkthrough
        </Link>
      </div>
    </div>
  );
}
