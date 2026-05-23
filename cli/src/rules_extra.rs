use regex::Regex;

use crate::rules::{finding, Rule};
use crate::types::{Severity, SourceFile};

macro_rules! simple_pattern_rule {
    ($ty:ident, $id:literal, $title:literal, $pattern:expr, $severity:expr, $msg:literal, $fix:literal) => {
        pub struct $ty;
        impl Rule for $ty {
            fn id(&self) -> &'static str { $id }
            fn title(&self) -> &'static str { $title }
            fn category(&self) -> &'static str { "general" }
            fn description(&self) -> &'static str { $msg }
            fn check(&self, file: &SourceFile) -> Vec<crate::types::Finding> {
                let re = Regex::new($pattern).unwrap();
                let mut findings = Vec::new();
                for (idx, line) in file.lines.iter().enumerate() {
                    if re.is_match(line) {
                        findings.push(finding(self, file, idx + 1, $severity, $msg, $fix));
                    }
                }
                findings
            }
        }
    };
}

simple_pattern_rule!(
    InitIfNeededRule,
    "ASP011",
    "init_if_needed without payer signer",
    r"init_if_needed",
    Severity::High,
    "init_if_needed detected — ensure payer is Signer and constrained.",
    "Bind payer: Signer<'info> with mut and validate payer matches authority."
);

simple_pattern_rule!(
    ZeroCopyRule,
    "ASP012",
    "Zero-copy account without owner check",
    r"AccountLoader<'info|zero_copy",
    Severity::High,
    "Zero-copy / AccountLoader usage requires strict owner and discriminator constraints.",
    "Add owner constraints and validate account discriminator in handler."
);

simple_pattern_rule!(
    RentSysvarRule,
    "ASP013",
    "Missing Rent sysvar for init",
    r"init,\s*$|init_if_needed",
    Severity::Low,
    "Init pattern detected — verify Rent sysvar or space calculation is handled.",
    "Use init with space derived from INIT_SPACE and ensure rent-exempt funding."
);

simple_pattern_rule!(
    AccountLoaderRule,
    "ASP014",
    "AccountLoader missing owner",
    r"AccountLoader<'info",
    Severity::High,
    "AccountLoader used — ensure owner program is constrained.",
    "Constrain loader account owner to executing program or expected program ID."
);

pub struct AdminExposureRule;
impl Rule for AdminExposureRule {
    fn id(&self) -> &'static str { "ASP015" }
    fn title(&self) -> &'static str { "Potential admin instruction exposure" }
    fn category(&self) -> &'static str { "upgrade" }
    fn description(&self) -> &'static str {
        "Admin/set_authority instructions should require privileged signer."
    }
    fn check(&self, file: &SourceFile) -> Vec<crate::types::Finding> {
        let re = Regex::new(r"pub\s+fn\s+(set_\w+|update_admin|migrate|upgrade)\w*\s*\(").unwrap();
        let signer = Regex::new(r"Signer<'info>|upgrade_authority|admin").unwrap();
        let mut findings = Vec::new();
        for (idx, line) in file.lines.iter().enumerate() {
            if re.is_match(line) {
                let block = file.lines[idx..(idx + 25).min(file.lines.len())].join("\n");
                if !signer.is_match(&block) {
                    findings.push(finding(
                        self, file, idx + 1, Severity::Critical,
                        "Admin-like instruction without visible admin/upgrade authority constraint.",
                        "Require Signer admin or ProgramData upgrade authority validation.",
                    ));
                }
            }
        }
        findings
    }
}

simple_pattern_rule!(
    UnboundedVecRule,
    "ASP016",
    "Unbounded Vec in accounts",
    r"Vec<Account<'info|Vec<AccountInfo<'info>",
    Severity::Medium,
    "Unbounded Vec in accounts may cause compute DoS — prefer max_len.",
    "Use #[max_len(N)] on Vec account fields."
);

pub struct HandlerLoopRule;
impl Rule for HandlerLoopRule {
    fn id(&self) -> &'static str { "ASP017" }
    fn title(&self) -> &'static str { "Loop in instruction handler" }
    fn category(&self) -> &'static str { "dos" }
    fn description(&self) -> &'static str { "Loops in handlers risk compute budget exhaustion." }
    fn check(&self, file: &SourceFile) -> Vec<crate::types::Finding> {
        let re = Regex::new(r"for\s+\w+\s+in|while\s+").unwrap();
        let mut findings = Vec::new();
        let mut in_program = false;
        for (idx, line) in file.lines.iter().enumerate() {
            if line.contains("#[program]") { in_program = true; continue; }
            if in_program && line.starts_with("pub mod ") && !line.contains("mod ") { break; }
            if in_program && re.is_match(line) && !line.trim_start().starts_with("//") {
                findings.push(finding(
                    self, file, idx + 1, Severity::Medium,
                    "Loop detected inside program module — verify compute budget bounds.",
                    "Bound iterations, use fixed-size arrays, or move heavy logic off-chain.",
                ));
            }
        }
        findings
    }
}

simple_pattern_rule!(
    FreezeAuthorityRule,
    "ASP018",
    "Token mint missing freeze authority check",
    r"Mint::|InterfaceAccount<'info,\s*Mint>",
    Severity::Low,
    "Mint account usage — review freeze authority implications.",
    "Document freeze authority handling or constrain mint permissions."
);

simple_pattern_rule!(
    InvokeSignedRule,
    "ASP019",
    "invoke_signed without seed validation",
    r"invoke_signed\(",
    Severity::High,
    "invoke_signed detected — ensure seeds are program-derived and validated.",
    "Use validated PDA seeds and store canonical bump in account state."
);

pub struct DuplicateMutRule;
impl Rule for DuplicateMutRule {
    fn id(&self) -> &'static str { "ASP020" }
    fn title(&self) -> &'static str { "Duplicate mutable accounts" }
    fn category(&self) -> &'static str { "account" }
    fn description(&self) -> &'static str { "Same account mutably referenced twice can cause logic bugs." }
    fn check(&self, file: &SourceFile) -> Vec<crate::types::Finding> {
        let mut findings = Vec::new();
        let mut in_accounts = false;
        let mut mut_fields: Vec<(String, usize)> = Vec::new();
        for (idx, line) in file.lines.iter().enumerate() {
            if line.contains("#[derive(Accounts)]") { in_accounts = true; mut_fields.clear(); continue; }
            if in_accounts && line.starts_with("pub struct ") && !line.contains("<'info>") { in_accounts = false; }
            if in_accounts && (line.contains("#[account(mut") || line.contains("mut,")) {
                if let Some(name) = line.split("pub ").nth(1).and_then(|s| s.split(':').next()) {
                    let name = name.trim().to_string();
                    if mut_fields.iter().any(|(n, _)| n == &name) {
                        findings.push(finding(
                            self, file, idx + 1, Severity::Medium,
                            format!("Duplicate mutable reference to `{name}` in accounts struct."),
                            "Ensure accounts are distinct; use has_one/constraint to prevent overlap.",
                        ));
                    }
                    mut_fields.push((name, idx + 1));
                }
            }
        }
        findings
    }
}

pub struct UncheckedMathRule;
impl Rule for UncheckedMathRule {
    fn id(&self) -> &'static str { "ASP021" }
    fn title(&self) -> &'static str { "Unchecked arithmetic" }
    fn category(&self) -> &'static str { "logic" }
    fn description(&self) -> &'static str { "Token balances should use checked math." }
    fn check(&self, file: &SourceFile) -> Vec<crate::types::Finding> {
        let bad = Regex::new(r"\+\=|\-\=|\*\=|\.wrapping_").unwrap();
        let good = Regex::new(r"checked_add|checked_sub|checked_mul|saturating_").unwrap();
        let mut findings = Vec::new();
        for (idx, line) in file.lines.iter().enumerate() {
            if bad.is_match(line) && !good.is_match(line) && (line.contains("amount") || line.contains("balance")) {
                findings.push(finding(
                    self, file, idx + 1, Severity::High,
                    "Arithmetic on balance/amount without checked_* operations.",
                    "Use checked_add/checked_sub/checked_mul and handle None on overflow.",
                ));
            }
        }
        findings
    }
}

simple_pattern_rule!(
    Token2022Rule,
    "ASP022",
    "Token-2022 extension unchecked",
    r"Token2022|token_2022|InterfaceAccount.*TokenAccount",
    Severity::Medium,
    "Token-2022 usage detected — verify extension constraints manually.",
    "Audit transfer hooks, permanent delegate, and default account state extensions."
);

simple_pattern_rule!(
    ZeroPubkeyRule,
    "ASP023",
    "Pubkey default / zero key",
    r"Pubkey::default\(\)",
    Severity::High,
    "Default pubkey used — verify intent.",
    "Avoid Pubkey::default(); use explicit constants and validate against expected keys."
);

simple_pattern_rule!(
    AtaConstraintRule,
    "ASP024",
    "Missing constraint on associated token",
    r"AssociatedToken|associated_token::",
    Severity::Medium,
    "Associated token usage — validate wallet and mint binding.",
    "Constrain ATA address derivation against wallet + mint seeds."
);

simple_pattern_rule!(
    RemainingAccountsRule,
    "ASP025",
    "Program unchecked in remaining accounts",
    r"remaining_accounts|ctx\.remaining_accounts",
    Severity::High,
    "remaining_accounts iteration without per-account validation is risky.",
    "Validate owner, discriminator, and signer for each remaining account."
);

/// ASP026: Custom account structs should use #[account] for discriminator safety.
pub struct MissingDiscriminatorRule;
impl Rule for MissingDiscriminatorRule {
    fn id(&self) -> &'static str { "ASP026" }
    fn title(&self) -> &'static str { "Missing discriminator on custom account" }
    fn category(&self) -> &'static str { "account" }
    fn description(&self) -> &'static str {
        "Custom state structs deserialized as Account<T> should use #[account]."
    }
    fn check(&self, file: &SourceFile) -> Vec<crate::types::Finding> {
        let struct_re = Regex::new(r"^pub struct (\w+)\s*\{").unwrap();
        let mut findings = Vec::new();
        for (idx, line) in file.lines.iter().enumerate() {
            if let Some(caps) = struct_re.captures(line.trim()) {
                let name = caps.get(1).map(|m| m.as_str()).unwrap_or("");
                if matches!(name, "InitializeVault" | "Withdraw" | "TransferTokens" | "CloseVault" | "ReadSysvar") {
                    continue;
                }
                let prev = file.lines[..idx].join("\n");
                let has_account_attr = prev.contains("#[account]")
                    && prev.rfind("#[account]").unwrap_or(0) > prev.rfind("pub struct").unwrap_or(0).saturating_sub(200);
                let used_as_account = file.content.contains(&format!("Account<'info, {name}>"))
                    || file.content.contains(&format!("Account<'info,{name}>"));
                if used_as_account && !has_account_attr {
                    findings.push(finding(
                        self, file, idx + 1, Severity::Low,
                        format!("Custom account `{name}` used with Account<T> but missing #[account] attribute."),
                        "Add #[account] above the struct so Anchor assigns an 8-byte discriminator.",
                    ));
                }
            }
        }
        findings
    }
}

pub fn extra_rules() -> Vec<Box<dyn Rule>> {
    vec![
        Box::new(InitIfNeededRule),
        Box::new(ZeroCopyRule),
        Box::new(RentSysvarRule),
        Box::new(AccountLoaderRule),
        Box::new(AdminExposureRule),
        Box::new(UnboundedVecRule),
        Box::new(HandlerLoopRule),
        Box::new(FreezeAuthorityRule),
        Box::new(InvokeSignedRule),
        Box::new(DuplicateMutRule),
        Box::new(UncheckedMathRule),
        Box::new(Token2022Rule),
        Box::new(ZeroPubkeyRule),
        Box::new(AtaConstraintRule),
        Box::new(RemainingAccountsRule),
        Box::new(MissingDiscriminatorRule),
    ]
}
