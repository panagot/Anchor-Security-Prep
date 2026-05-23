use crate::types::{Finding, Severity, SourceFile};
use regex::Regex;

pub trait Rule {
    fn id(&self) -> &'static str;
    fn title(&self) -> &'static str;
    fn category(&self) -> &'static str { "account" }
    fn description(&self) -> &'static str { self.title() }
    fn check(&self, file: &SourceFile) -> Vec<Finding>;
}

pub(crate) fn finding(
    rule: &dyn Rule,
    file: &SourceFile,
    line: usize,
    severity: Severity,
    message: impl Into<String>,
    fix_hint: impl Into<String>,
) -> Finding {
    Finding {
        rule_id: rule.id().to_string(),
        title: rule.title().to_string(),
        severity,
        file: file.path.clone(),
        line,
        message: message.into(),
        fix_hint: fix_hint.into(),
        code_snippet: file.snippet_around(line, 2),
        category: rule.category().to_string(),
    }
}

fn accounts_struct_block(file: &SourceFile, struct_name: &str) -> Option<String> {
    let struct_re = Regex::new(&format!(r"struct\s+{struct_name}\s*<'info>")).unwrap();
    let start = file.lines.iter().position(|line| struct_re.is_match(line))?;
    let mut depth = 0;
    let mut end = start;
    for (offset, line) in file.lines[start..].iter().enumerate() {
        depth += line.matches('{').count();
        depth -= line.matches('}').count();
        end = start + offset;
        if offset > 0 && depth == 0 {
            break;
        }
    }
    Some(file.lines[start..=end].join("\n"))
}

fn handler_accounts_block(file: &SourceFile, handler_line_idx: usize) -> String {
    let context_re = Regex::new(r"Context<(\w+)>").unwrap();
    let fn_re = Regex::new(r"pub\s+fn\s+\w+\s*\(").unwrap();

    let fn_start = file.lines[..=handler_line_idx]
        .iter()
        .enumerate()
        .rev()
        .find_map(|(idx, line)| fn_re.is_match(line).then_some(idx))
        .unwrap_or(handler_line_idx);

    let scan_end = (handler_line_idx + 3).min(file.lines.len());
    for line in &file.lines[fn_start..scan_end] {
        if let Some(caps) = context_re.captures(line) {
            if let Some(name) = caps.get(1) {
                if let Some(block) = accounts_struct_block(file, name.as_str()) {
                    return block;
                }
            }
        }
    }

    let end = (handler_line_idx + 40).min(file.lines.len());
    file.lines[handler_line_idx..end].join("\n")
}

pub(crate) fn account_attribute_block(file: &SourceFile, line_idx: usize) -> String {
    let mut anchor_start = None;
    for i in (0..=line_idx).rev() {
        let trimmed = file.lines[i].trim();
        if trimmed.starts_with("#[account") {
            anchor_start = Some(i);
            break;
        }
    }

    if let Some(start) = anchor_start {
        let mut depth = 0;
        let mut end = start;
        for (offset, line) in file.lines[start..].iter().enumerate() {
            depth += line.matches('(').count();
            depth -= line.matches(')').count();
            end = start + offset;
            if depth == 0 && offset > 0 {
                break;
            }
        }
        let field_end = (line_idx + 2).min(file.lines.len());
        return file.lines[start..field_end.max(end + 1)].join("\n");
    }

    let end = (line_idx + 12).min(file.lines.len());
    file.lines[line_idx..end].join("\n")
}

/// ASP001: Sensitive instructions should require a Signer account.
pub struct MissingSignerRule;

impl Rule for MissingSignerRule {
    fn id(&self) -> &'static str {
        "ASP001"
    }

    fn title(&self) -> &'static str {
        "Missing signer validation"
    }

    fn check(&self, file: &SourceFile) -> Vec<Finding> {
        let mut findings = Vec::new();
        let handler_re = Regex::new(r"pub\s+fn\s+(\w+)\s*\(").unwrap();
        let signer_re = Regex::new(r"Signer<'info>|Signer<\s*'info\s*>|\bsigner\s*=\s*true\b").unwrap();

        for (idx, line) in file.lines.iter().enumerate() {
            if let Some(caps) = handler_re.captures(line) {
                let name = caps.get(1).map(|m| m.as_str()).unwrap_or("");
                if matches!(name, "initialize" | "migrate") {
                    continue;
                }

                let handler_block = handler_accounts_block(file, idx);
                let mutates_state = handler_block.contains("mut ")
                    || handler_block.contains("#[account(mut")
                    || handler_block.contains("transfer(")
                    || handler_block.contains("mint_to")
                    || handler_block.contains("burn(")
                    || handler_block.contains("checked_sub")
                    || handler_block.contains("assign(")
                    || handler_block.contains("realloc(");

                if mutates_state && !signer_re.is_match(&handler_block) {
                    findings.push(finding(
                        self,
                        file,
                        idx + 1,
                        Severity::Critical,
                        format!(
                            "Instruction `{name}` appears to mutate state but its accounts struct has no Signer or `signer = true` constraint."
                        ),
                        "Add `Signer<'info>` to the accounts struct or constrain the authority with `signer = true`.",
                    ));
                }
            }
        }

        findings
    }
}

/// ASP002: Accounts deserialized via AccountInfo lack type/owner safety.
pub struct UncheckedAccountInfoRule;

impl Rule for UncheckedAccountInfoRule {
    fn id(&self) -> &'static str {
        "ASP002"
    }

    fn title(&self) -> &'static str {
        "Unchecked AccountInfo usage"
    }

    fn check(&self, file: &SourceFile) -> Vec<Finding> {
        let mut findings = Vec::new();
        let re = Regex::new(r"AccountInfo<'info>").unwrap();
        let safe_re = Regex::new(
            r"Account<'info|InterfaceAccount<'info|Interface<'info|Program<'info|Sysvar<'info",
        )
        .unwrap();

        for (idx, line) in file.lines.iter().enumerate() {
            if re.is_match(line) && !safe_re.is_match(line) {
                let context_start = idx.saturating_sub(5);
                let context_end = (idx + 8).min(file.lines.len());
                let context = file.lines[context_start..context_end].join("\n");

                if context.contains("/// CHECK") {
                    continue;
                }

                findings.push(finding(
                    self,
                    file,
                    idx + 1,
                    Severity::High,
                    "Raw AccountInfo used without typed wrapper or documented /// CHECK justification.",
                    "Prefer Account<T>, InterfaceAccount<T>, or add /// CHECK with explicit in-handler validation.",
                ));
            }
        }

        findings
    }
}

/// ASP003: PDA seeds should include bump seed or bump constraint.
pub struct PdaBumpRule;

impl Rule for PdaBumpRule {
    fn id(&self) -> &'static str {
        "ASP003"
    }

    fn title(&self) -> &'static str {
        "PDA seeds missing bump validation"
    }

    fn check(&self, file: &SourceFile) -> Vec<Finding> {
        let mut findings = Vec::new();
        let seeds_re = Regex::new(r"seeds\s*=\s*\[").unwrap();
        let bump_re = Regex::new(r"bump\s*=|\bbump\b|seeds\s*=\s*\[[^\]]*,\s*&\[bump\]").unwrap();

        for (idx, line) in file.lines.iter().enumerate() {
            if seeds_re.is_match(line) {
                let block = account_attribute_block(file, idx);
                if !bump_re.is_match(&block) {
                    findings.push(finding(
                        self,
                        file,
                        idx + 1,
                        Severity::High,
                        "PDA `seeds = [...]` constraint found without canonical bump validation.",
                        "Add `bump` to the accounts constraint or include `&[bump]` in seeds and store canonical bump.",
                    ));
                }
            }
        }

        findings
    }
}

/// ASP004: Closing accounts should use Anchor close attribute safely.
pub struct UnsafeCloseRule;

impl Rule for UnsafeCloseRule {
    fn id(&self) -> &'static str {
        "ASP004"
    }

    fn title(&self) -> &'static str {
        "Unsafe account close pattern"
    }

    fn check(&self, file: &SourceFile) -> Vec<Finding> {
        let mut findings = Vec::new();
        let manual_close = Regex::new(r"lamports\(\)\s*=|assign\(|realloc\(").unwrap();
        let close_attr = Regex::new(r"close\s*=").unwrap();

        for (idx, line) in file.lines.iter().enumerate() {
            if manual_close.is_match(line) {
                let window_start = idx.saturating_sub(10);
                let window_end = (idx + 10).min(file.lines.len());
                let window = file.lines[window_start..window_end].join("\n");
                if !close_attr.is_match(&window) {
                    findings.push(finding(
                        self,
                        file,
                        idx + 1,
                        Severity::High,
                        "Manual lamport/account mutation detected without Anchor `close =` constraint nearby.",
                        "Use `#[account(close = destination)]` so rent and lamports are handled safely.",
                    ));
                }
            }
        }

        findings
    }
}

/// ASP005: Authority-bearing accounts should use has_one or explicit constraints.
pub struct MissingAuthorityConstraintRule;

impl Rule for MissingAuthorityConstraintRule {
    fn id(&self) -> &'static str {
        "ASP005"
    }

    fn title(&self) -> &'static str {
        "Missing authority constraint"
    }

    fn check(&self, file: &SourceFile) -> Vec<Finding> {
        let mut findings = Vec::new();
        let authority_field = Regex::new(r"pub\s+authority:\s*AccountInfo<'info>|pub\s+authority:\s*UncheckedAccount<'info>").unwrap();
        let has_one = Regex::new(r"has_one\s*=").unwrap();

        for (idx, line) in file.lines.iter().enumerate() {
            if authority_field.is_match(line) {
                let end = (idx + 8).min(file.lines.len());
                let block = file.lines[idx..end].join("\n");
                if !has_one.is_match(&block) {
                    findings.push(finding(
                        self,
                        file,
                        idx + 1,
                        Severity::Medium,
                        "Authority-like account present without `has_one` or typed authority binding.",
                        "Use `has_one = authority` or typed Signer/Account relations to bind authorities.",
                    ));
                }
            }
        }

        findings
    }
}

/// ASP006: CPI should validate target program IDs explicitly.
pub struct UnvalidatedCpiRule;

impl Rule for UnvalidatedCpiRule {
    fn id(&self) -> &'static str {
        "ASP006"
    }

    fn title(&self) -> &'static str {
        "Unvalidated CPI target"
    }

    fn check(&self, file: &SourceFile) -> Vec<Finding> {
        let mut findings = Vec::new();
        let cpi_re = Regex::new(r"CpiContext::new|invoke_signed|invoke\(").unwrap();
        let program_check = Regex::new(r"Program<'info|program::ID|key\(\)\s*==|constraint\s*=.*program").unwrap();

        for (idx, line) in file.lines.iter().enumerate() {
            if cpi_re.is_match(line) {
                let block = handler_accounts_block(file, idx);
                if !program_check.is_match(&block) {
                    findings.push(finding(
                        self,
                        file,
                        idx + 1,
                        Severity::High,
                        "Cross-program invocation detected without nearby typed Program or explicit program ID validation.",
                        "Pass `Program<'info, TargetProgram>` in accounts or verify `program.key() == target_program::ID`.",
                    ));
                }
            }
        }

        findings
    }
}

/// ASP007: Mutable accounts should be marked with `mut`.
pub struct MissingMutRule;

impl Rule for MissingMutRule {
    fn id(&self) -> &'static str {
        "ASP007"
    }

    fn title(&self) -> &'static str {
        "Missing mut on mutable account"
    }

    fn check(&self, file: &SourceFile) -> Vec<Finding> {
        let mut findings = Vec::new();
        let account_decl = Regex::new(r"pub\s+(\w+):\s*Account<'info,\s*(\w+)>\s*,?\s*$").unwrap();

        for (idx, line) in file.lines.iter().enumerate() {
            if let Some(caps) = account_decl.captures(line.trim()) {
                let field = caps.get(1).map(|m| m.as_str()).unwrap_or("");
                let end = (idx + 20).min(file.lines.len());
                let block = file.lines[idx..end].join("\n");

                let writes_field = block.contains(&format!("{field}. "))
                    || block.contains(&format!("{field}."))
                    || block.contains(&format!("&mut {field}"));

                let has_mut = line.contains("mut") || block.contains("#[account(mut");

                if writes_field && !has_mut {
                    findings.push(finding(
                        self,
                        file,
                        idx + 1,
                        Severity::Medium,
                        format!("Account `{field}` appears mutated in instruction logic but is not marked `mut`."),
                        "Add `#[account(mut)]` or `mut` in the account declaration.",
                    ));
                }
            }
        }

        findings
    }
}

/// ASP008: Sysvar accounts should use typed Sysvar<T>.
pub struct UntypedSysvarRule;

impl Rule for UntypedSysvarRule {
    fn id(&self) -> &'static str {
        "ASP008"
    }

    fn title(&self) -> &'static str {
        "Untyped sysvar account"
    }

    fn check(&self, file: &SourceFile) -> Vec<Finding> {
        let mut findings = Vec::new();
        let sysvar_info = Regex::new(r"AccountInfo<'info>\s*,?\s*$").unwrap();

        for (idx, line) in file.lines.iter().enumerate() {
            let lower = line.to_lowercase();
            if lower.contains("sysvar") && sysvar_info.is_match(line) {
                findings.push(finding(
                    self,
                    file,
                    idx + 1,
                    Severity::Medium,
                    "Sysvar passed as raw AccountInfo instead of typed Sysvar<T>.",
                    "Use `Sysvar<'info, Rent>` or the relevant typed sysvar wrapper.",
                ));
            }
        }

        findings
    }
}

/// ASP009: Token accounts should bind mint/authority constraints.
pub struct TokenConstraintRule;

impl Rule for TokenConstraintRule {
    fn id(&self) -> &'static str {
        "ASP009"
    }

    fn title(&self) -> &'static str {
        "Token account constraint mismatch"
    }

    fn check(&self, file: &SourceFile) -> Vec<Finding> {
        let mut findings = Vec::new();
        if !file.content.contains("TokenAccount") && !file.content.contains("token::") {
            return findings;
        }

        let token_account = Regex::new(r"Account<'info,\s*TokenAccount>").unwrap();
        let mint_auth = Regex::new(r"constraint\s*=.*mint|has_one\s*=.*mint|authority\s*=|\.owner\s==").unwrap();

        for (idx, line) in file.lines.iter().enumerate() {
            if token_account.is_match(line) {
                let block = account_attribute_block(file, idx);
                if !mint_auth.is_match(&block) {
                    findings.push(finding(
                        self,
                        file,
                        idx + 1,
                        Severity::High,
                        "TokenAccount present without mint/authority binding constraints.",
                        "Constrain token account mint and authority, e.g. `constraint = token.mint == mint.key()`.",
                    ));
                }
            }
        }

        findings
    }
}

/// ASP010: UncheckedAccount without owner/key checks in handler.
pub struct UncheckedOwnerRule;

impl Rule for UncheckedOwnerRule {
    fn id(&self) -> &'static str {
        "ASP010"
    }

    fn title(&self) -> &'static str {
        "Unchecked account ownership"
    }

    fn check(&self, file: &SourceFile) -> Vec<Finding> {
        let mut findings = Vec::new();
        let unchecked = Regex::new(r"UncheckedAccount<'info>").unwrap();
        let owner_check = Regex::new(r"owner|\.key\(\)|constraint\s*=|/// CHECK").unwrap();

        for (idx, line) in file.lines.iter().enumerate() {
            if unchecked.is_match(line) {
                let end = (idx + 10).min(file.lines.len());
                let block = file.lines[idx..end].join("\n");
                if !owner_check.is_match(&block) {
                    findings.push(finding(
                        self,
                        file,
                        idx + 1,
                        Severity::High,
                        "UncheckedAccount used without owner/key validation or documented CHECK rationale.",
                        "Validate account owner/program ID in the handler or replace with typed Account<T>.",
                    ));
                }
            }
        }

        findings
    }
}

pub fn all_rules() -> Vec<Box<dyn Rule>> {
    let mut rules: Vec<Box<dyn Rule>> = vec![
        Box::new(MissingSignerRule),
        Box::new(UncheckedAccountInfoRule),
        Box::new(PdaBumpRule),
        Box::new(UnsafeCloseRule),
        Box::new(MissingAuthorityConstraintRule),
        Box::new(UnvalidatedCpiRule),
        Box::new(MissingMutRule),
        Box::new(UntypedSysvarRule),
        Box::new(TokenConstraintRule),
        Box::new(UncheckedOwnerRule),
    ];
    rules.extend(crate::rules_extra::extra_rules());
    rules
}
