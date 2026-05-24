import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GrantPathStepper } from "@/components/GrantPathStepper";
import { NextStepCta } from "@/components/NextStepCta";
import { PageHeader } from "@/components/PageHeader";
import type { RuleInfo } from "@/lib/types";
import { RULE_INCIDENTS } from "@/lib/incidents";
import { sampleReportUrl } from "@/lib/demo-routes";
import { checkCliAvailable, runRulesJson } from "@/lib/scanner";import fs from "fs";
import path from "path";

const RULE_DOCS: Record<string, { why: string; bad: string; good: string }> = {
  ASP001: {
    why: "Without a Signer, anyone can call state-mutating instructions and drain vaults or change config.",
    bad: "pub user: AccountInfo<'info>",
    good: "pub authority: Signer<'info>",
  },
  ASP002: {
    why: "Raw AccountInfo bypasses Anchor's type system — attackers can substitute accounts of wrong type or owner.",
    bad: "pub vault: AccountInfo<'info>",
    good: "pub vault: Account<'info, Vault>  // or documented /// CHECK + owner constraint",
  },
  ASP003: {
    why: "Missing bump validation allows PDA seed collisions and account substitution attacks.",
    bad: "seeds = [b\"vault\"], // no bump",
    good: "seeds = [b\"vault\"], bump,",
  },
  ASP004: {
    why: "Manual lamport manipulation without Anchor close constraints enables rent theft and close bugs.",
    bad: "**dest.lamports += acct.lamports(); acct.assign(...)",
    good: "#[account(mut, close = destination)] pub target: Account<'info, T>",
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
  ASP010: {
    why: "UncheckedAccount without owner validation accepts any program-owned account.",
    bad: "pub external: UncheckedAccount<'info>  // no owner check",
    good: "constraint = external.owner == expected_program.key()",
  },
  ASP011: {
    why: "init_if_needed without Signer payer lets anyone initialize accounts on others' behalf.",
    bad: "init_if_needed, payer = payer  // payer is AccountInfo",
    good: "init_if_needed, payer = payer  // payer: Signer<'info>",
  },
  ASP015: {
    why: "Admin instructions without privileged signers allow unauthorized protocol takeover.",
    bad: "pub fn set_admin(...) // no Signer admin",
    good: "pub admin: Signer<'info> + has_one = admin",
  },
  ASP019: {
    why: "invoke_signed with unvalidated seeds allows forged PDA signatures on CPI.",
    bad: "invoke_signed(..., &[&[]])  // empty seeds",
    good: "Validate seeds match program-derived PDA before invoke_signed",
  },
  ASP021: {
    why: "Unchecked math on balances can wrap and create or destroy tokens.",
    bad: "vault.balance += amount;",
    good: "vault.balance = vault.balance.checked_add(amount).ok_or(...)?;",
  },
  ASP023: {
    why: "Pubkey::default() is often used incorrectly as a sentinel — can match unintended accounts.",
    bad: "let admin = Pubkey::default();",
    good: "Use explicit constant + validate admin != Pubkey::default()",
  },
  ASP025: {
    why: "remaining_accounts can smuggle arbitrary accounts if not validated per-item.",
    bad: "for acc in ctx.remaining_accounts.iter() { ... }",
    good: "Validate owner, discriminator, and expected key for each account",
  },
  ASP026: {
    why: "Custom accounts without #[account] lack Anchor discriminator — type confusion attacks.",
    bad: "pub struct BalanceVault { pub amount: u64 }",
    good: "#[account] pub struct BalanceVault { pub amount: u64 }",
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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const ruleId = id.toUpperCase();
  const rule = loadRules().find((r) => r.id === ruleId);
  if (!rule) return { title: "Rule not found" };
  return {
    title: `${rule.id} — ${rule.title}`,
    description: `${rule.description} · ${rule.exploit_class}`,
  };
}

export default async function RuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ruleId = id.toUpperCase();
  const rules = loadRules();
  const rule = rules.find((r) => r.id === ruleId);
  if (!rule) notFound();

  const doc = RULE_DOCS[ruleId];
  const incidents = RULE_INCIDENTS[ruleId] ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <GrantPathStepper />

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

      {incidents.length > 0 && (
        <section className="panel">
          <div className="panel-inner space-y-3">
            <h2 className="display text-lg font-bold">Real-world relevance</h2>
            <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
              {incidents.map((inc) => (
                <li key={inc.name} className="border-l-2 border-[var(--amber)] pl-3">
                  <strong className="text-[var(--ink)]">{inc.name}</strong> — {inc.impact}
                  {inc.url && (
                    <>
                      {" "}
                      <a href={inc.url} className="text-[var(--amber)] hover:underline" target="_blank" rel="noopener noreferrer">
                        Reference
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

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

      {!doc && (
        <section className="panel border-[var(--line)]">
          <div className="panel-inner text-sm text-[var(--ink-muted)]">
            Full vulnerable/hardened pattern docs ship in M1. See{" "}
            <Link href="/rules/asp001" className="text-[var(--amber)] hover:underline">
              ASP001
            </Link>{" "}
            for a complete example with bad vs good code.
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/rules" className="btn btn-ghost text-[10px]">← Rule catalog</Link>
        <Link href="/compare" className="btn btn-ghost text-[10px]">Compare samples</Link>
        <Link href={sampleReportUrl("vulnerable")} className="btn btn-primary text-[10px]">
          Findings in sample report
        </Link>
      </div>

      {doc && (
        <NextStepCta
          step="Step 2 of 4"
          next={{
            label: "Open full report",
            href: sampleReportUrl("vulnerable"),
            description: `See every ${rule.id} finding with line numbers, code context, and fix hints.`,
          }}
        />
      )}
    </div>
  );
}
