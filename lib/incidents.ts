/** Maps ASP rules to documented exploit classes and public incident references. */
export interface IncidentRef {
  name: string;
  impact: string;
  url?: string;
}

export const RULE_INCIDENTS: Record<string, IncidentRef[]> = {
  ASP001: [
    { name: "Signer bypass on withdraw/admin", impact: "Unauthorized state changes and fund drains", url: "https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/INCIDENTS.md#2-signer-bypass-on-admin--withdraw-common-audit-finding" },
  ],
  ASP002: [
    { name: "Cashio-class fake collateral (2022)", impact: "Unverified account types accepted as valid collateral", url: "https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/INCIDENTS.md#1-unlimited-mint--fake-collateral-cashio-class-2022" },
  ],
  ASP003: [
    { name: "PDA bump / seed collision", impact: "Account substitution via non-canonical bumps", url: "https://www.helius.dev/blog/solana-pda" },
  ],
  ASP004: [
    { name: "Sealevel — Closing Accounts", impact: "Rent theft and lamport redirection", url: "https://github.com/coral-xyz/sealevel-attacks" },
  ],
  ASP006: [
    { name: "CPI confused deputy", impact: "Redirected program calls to malicious contracts", url: "https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/INCIDENTS.md#3-cpi--confused-deputy-sealevel-attacks" },
  ],
  ASP009: [
    { name: "Cashio-class token binding failure", impact: "Wrong-mint or wrong-type accounts accepted", url: "https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/INCIDENTS.md#1-unlimited-mint--fake-collateral-cashio-class-2022" },
  ],
  ASP010: [
    { name: "Cashio-class unchecked owner", impact: "Fake accounts without owner validation", url: "https://github.com/panagot/Anchor-Security-Prep/blob/main/docs/INCIDENTS.md#1-unlimited-mint--fake-collateral-cashio-class-2022" },
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
  fixtureCount: 21,
  fixtureTarget: 26,
} as const;
