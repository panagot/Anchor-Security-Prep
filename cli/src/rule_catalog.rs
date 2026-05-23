use serde::{Deserialize, Serialize};

use crate::types::Severity;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RuleInfo {
    pub id: String,
    pub title: String,
    pub category: String,
    pub description: String,
    pub default_severity: Severity,
    pub exploit_class: String,
    pub docs_slug: String,
}

pub fn catalog() -> Vec<RuleInfo> {
    vec![
        meta("ASP001", "Missing signer validation", "account", "Sensitive instructions must require a Signer or signer=true constraint.", Severity::Critical, "Signer authorization bypass", "missing-signer"),
        meta("ASP002", "Unchecked AccountInfo usage", "account", "Raw AccountInfo bypasses Anchor type and owner checks.", Severity::High, "Account substitution", "unchecked-account-info"),
        meta("ASP003", "PDA seeds missing bump validation", "pda", "PDAs must validate canonical bump to prevent seed collisions.", Severity::High, "PDA hijacking", "pda-bump"),
        meta("ASP004", "Unsafe account close pattern", "lifecycle", "Manual lamport manipulation without Anchor close constraint.", Severity::High, "Rent theft / close bugs", "unsafe-close"),
        meta("ASP005", "Missing authority constraint", "account", "Authority accounts should use has_one or typed Signer binding.", Severity::Medium, "Privilege escalation", "authority-constraint"),
        meta("ASP006", "Unvalidated CPI target", "cpi", "CPI calls must validate program IDs explicitly.", Severity::High, "Malicious CPI injection", "cpi-validation"),
        meta("ASP007", "Missing mut on mutable account", "account", "Accounts written in handlers must be marked mut.", Severity::Medium, "Silent write failures", "missing-mut"),
        meta("ASP008", "Untyped sysvar account", "account", "Sysvars should use typed Sysvar<T> wrappers.", Severity::Medium, "Sysvar spoofing", "sysvar-typing"),
        meta("ASP009", "Token account constraint mismatch", "token", "TokenAccounts need mint/authority binding constraints.", Severity::High, "Token theft", "token-constraints"),
        meta("ASP010", "Unchecked account ownership", "account", "UncheckedAccount requires owner validation or CHECK docs.", Severity::High, "Owner confusion attacks", "unchecked-owner"),
        meta("ASP011", "init_if_needed without payer signer", "lifecycle", "init_if_needed must bind payer as Signer.", Severity::High, "Unauthorized account init", "init-if-needed"),
        meta("ASP012", "Zero-copy account without owner check", "account", "AccountLoader/zero-copy needs owner constraints.", Severity::High, "Account data corruption", "zero-copy"),
        meta("ASP013", "Missing Rent sysvar for init", "lifecycle", "Init flows referencing space should consider Rent.", Severity::Low, "Rent miscalculation", "rent-sysvar"),
        meta("ASP014", "AccountLoader missing owner", "account", "AccountLoader should constrain program owner.", Severity::High, "Loader spoofing", "account-loader"),
        meta("ASP015", "Potential admin instruction exposure", "upgrade", "Admin-only instructions should require upgrade authority or admin signer.", Severity::Critical, "Unauthorized admin action", "admin-exposure"),
        meta("ASP016", "Unbounded Vec in accounts", "dos", "Large Vec accounts without max_len may enable DoS.", Severity::Medium, "Compute exhaustion", "unbounded-vec"),
        meta("ASP017", "Loop in instruction handler", "dos", "Loops in handlers can exceed compute budget.", Severity::Medium, "Compute DoS", "handler-loop"),
        meta("ASP018", "Token mint missing freeze authority check", "token", "Mint operations should consider freeze authority risks.", Severity::Low, "Frozen asset traps", "freeze-authority"),
        meta("ASP019", "invoke_signed without seed validation", "cpi", "invoke_signed must use validated seed slices.", Severity::High, "PDA signature forgery", "invoke-signed"),
        meta("ASP020", "Duplicate mutable accounts", "account", "Same account passed mut twice can cause logic bugs.", Severity::Medium, "Double-spend patterns", "duplicate-mut"),
        meta("ASP021", "Unchecked arithmetic", "logic", "Use checked_add/sub/mul for token amounts and balances.", Severity::High, "Integer overflow", "unchecked-math"),
        meta("ASP022", "Token-2022 extension unchecked", "token", "Token-2022 extensions need explicit constraint review.", Severity::Medium, "Extension misconfig", "token-2022"),
        meta("ASP023", "Pubkey default / zero key", "logic", "Pubkey::default() used as valid key.", Severity::High, "Zero-address bugs", "zero-pubkey"),
        meta("ASP024", "Missing constraint on associated token", "token", "ATA derivations should validate wallet + mint.", Severity::Medium, "Wrong ATA acceptance", "ata-constraint"),
        meta("ASP025", "Program unchecked in remaining accounts", "cpi", "remaining_accounts iteration without validation is risky.", Severity::High, "Remaining accounts attack", "remaining-accounts"),
        meta("ASP026", "Missing discriminator on custom account", "account", "Custom accounts should use Anchor discriminator (#[account]).", Severity::Low, "Account type confusion", "discriminator"),
    ]
}

fn meta(id: &str, title: &str, category: &str, description: &str, sev: Severity, exploit: &str, slug: &str) -> RuleInfo {
    RuleInfo {
        id: id.to_string(),
        title: title.to_string(),
        category: category.to_string(),
        description: description.to_string(),
        default_severity: sev,
        exploit_class: exploit.to_string(),
        docs_slug: slug.to_string(),
    }
}

pub fn rule_by_id(id: &str) -> Option<RuleInfo> {
    catalog().into_iter().find(|r| r.id == id)
}
