/** Maps ASP rules to documented exploit classes and public incident references. */
export interface IncidentRef {
  name: string;
  impact: string;
  url?: string;
}

export const RULE_INCIDENTS: Record<string, IncidentRef[]> = {
  ASP001: [
    { name: "Missing signer on admin/withdraw", impact: "Unauthorized state changes and fund drains", url: "https://helius.dev/blog/solana-hacks" },
  ],
  ASP003: [
    { name: "PDA bump / seed collision", impact: "Account substitution via non-canonical bumps", url: "https://www.helius.dev/blog/solana-pda" },
  ],
  ASP004: [
    { name: "Improper account close", impact: "Rent theft and lamport redirection", url: "https://github.com/coral-xyz/sealevel-attacks" },
  ],
  ASP006: [
    { name: "Arbitrary CPI / confused deputy", impact: "Redirected program calls to malicious contracts", url: "https://github.com/coral-xyz/sealevel-attacks" },
  ],
  ASP009: [
    { name: "Token constraint bypass", impact: "Wrong-mint or wrong-authority token theft", url: "https://github.com/coral-xyz/sealevel-attacks" },
  ],
  ASP015: [
    { name: "Unprotected admin instruction", impact: "Protocol takeover via set_admin-style handlers", url: "https://helius.dev/blog/solana-hacks" },
  ],
  ASP019: [
    { name: "invoke_signed seed forgery", impact: "Forged PDA signatures on CPI", url: "https://github.com/coral-xyz/sealevel-attacks" },
  ],
  ASP021: [
    { name: "Integer overflow on balances", impact: "Token inflation or balance wrap", url: "https://github.com/coral-xyz/sealevel-attacks" },
  ],
  ASP025: [
    { name: "Remaining accounts abuse", impact: "Smuggled accounts in remaining_accounts iteration", url: "https://helius.dev/blog/solana-hacks" },
  ],
};

export const ECOSYSTEM_STATS = {
  auditCostRange: "$15K–$100K+",
  rulesActive: 26,
  rulesTarget: 50,
  fixtureCount: 26,
} as const;
