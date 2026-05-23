import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/PageHeader";
import type { RuleInfo } from "@/lib/types";
import { checkCliAvailable, runRulesJson } from "@/lib/scanner";
import fs from "fs";
import path from "path";

const RULE_DOCS: Record<string, { why: string; bad: string; good: string }> = {
  ASP001: {
    why: "Without a Signer, anyone can call state-mutating instructions and drain vaults or change config.",
    bad: "pub user: AccountInfo<'info>",
    good: "pub authority: Signer<'info>",
  },
  ASP003: {
    why: "Missing bump validation allows PDA seed collisions and account substitution attacks.",
    bad: "seeds = [b\"vault\"], // no bump",
    good: "seeds = [b\"vault\"], bump,",
  },
  ASP006: {
    why: "Unvalidated CPI lets attackers redirect calls to malicious programs.",
    bad: "CpiContext::new(untyped_program, ...)",
    good: "Program<'info, Token> + program ID check",
  },
  ASP009: {
    why: "Token accounts without mint binding can accept wrong-mint transfers.",
    bad: "pub token: Account<'info, TokenAccount>",
    good: "constraint = token.mint == expected_mint.key()",
  },
  ASP015: {
    why: "Admin instructions without privileged signers allow unauthorized protocol takeover.",
    bad: "pub fn set_admin(...) // no Signer admin",
    good: "pub admin: Signer<'info> + has_one = admin",
  },
  ASP021: {
    why: "Unchecked math on balances can wrap and create or destroy tokens.",
    bad: "vault.balance += amount;",
    good: "vault.balance = vault.balance.checked_add(amount).ok_or(...)?;",
  },
  ASP025: {
    why: "remaining_accounts can smuggle arbitrary accounts if not validated per-item.",
    bad: "for acc in ctx.remaining_accounts.iter() { ... }",
    good: "Validate owner, discriminator, and expected key for each account",
  },
};

function loadRules(): RuleInfo[] {
  const staticPath = path.join(process.cwd(), "public", "rules.json");
  if (fs.existsSync(staticPath)) {
    return JSON.parse(fs.readFileSync(staticPath, "utf8")) as RuleInfo[];
  }
  const cli = checkCliAvailable();
  if (cli.ok) {
    return JSON.parse(runRulesJson()) as RuleInfo[];
  }
  return [];
}

export function generateStaticParams() {
  const rules = loadRules();
  return rules.map((r) => ({ id: r.id.toLowerCase() }));
}

export default async function RuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ruleId = id.toUpperCase();
  const rules = loadRules();
  const rule = rules.find((r) => r.id === ruleId);
  if (!rule) notFound();

  const doc = RULE_DOCS[ruleId];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        refId={rule.id}
        title={rule.title}
        subtitle={rule.exploit_class}
      />

      <div className="panel">
        <div className="panel-inner space-y-4">
          <span className={`badge sev-${rule.default_severity}`}>{rule.default_severity}</span>
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{rule.description}</p>
          <p className="text-xs text-[var(--ink-faint)]">Category: {rule.category}</p>
        </div>
      </div>

      {doc && (
        <>
          <section className="panel">
            <div className="panel-inner space-y-3">
              <h2 className="display text-lg font-bold">Why it matters</h2>
              <p className="text-sm text-[var(--ink-muted)]">{doc.why}</p>
            </div>
          </section>
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="panel">
              <div className="panel-inner">
                <p className="label mb-2 text-[var(--critical)]">Vulnerable pattern</p>
                <pre className="code-block p-3 text-xs">{doc.bad}</pre>
              </div>
            </div>
            <div className="panel">
              <div className="panel-inner">
                <p className="label mb-2 text-[var(--phosphor)]">Hardened pattern</p>
                <pre className="code-block p-3 text-xs">{doc.good}</pre>
              </div>
            </div>
          </section>
        </>
      )}

      <div className="flex gap-3">
        <Link href="/rules" className="btn btn-ghost text-[10px]">← Rule catalog</Link>
        <Link href="/compare" className="btn btn-primary text-[10px]">See live comparison</Link>
      </div>
    </div>
  );
}
