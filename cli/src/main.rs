mod config;
mod rule_catalog;
mod rules;
mod rules_extra;
mod sarif;
mod scanner;
mod types;

#[cfg(test)]
mod fixtures_test;

use std::fs;
use std::path::{Path, PathBuf};
use std::process::exit;

use anyhow::{Context, Result, bail};
use clap::{Parser, Subcommand, ValueEnum};
use colored::Colorize;
use serde_json::Value;

use crate::config::write_default_config;
use crate::rule_catalog::{catalog, rule_by_id};
use crate::scanner::{save_report_by_id, scan_project, write_report_files};
use crate::types::Severity;

#[derive(Parser)]
#[command(name = "anchor-prep", about = "Pre-audit security scanner for Anchor/Solana programs", version)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Copy, Clone, ValueEnum)]
enum OutputFormat {
    Json,
    Md,
    Sarif,
    All,
}

impl OutputFormat {
    fn as_str(self) -> &'static str {
        match self {
            OutputFormat::Json => "json",
            OutputFormat::Md => "md",
            OutputFormat::Sarif => "sarif",
            OutputFormat::All => "all",
        }
    }
}

#[derive(Subcommand)]
enum Commands {
    Scan {
        path: PathBuf,
        #[arg(long, value_enum, default_value = "all")]
        format: OutputFormat,
        #[arg(long, default_value = "reports")]
        out: PathBuf,
        #[arg(long, default_value = "high")]
        fail_on: String,
        #[arg(long)]
        save: bool,
    },
    Rules {
        #[arg(long)]
        json: bool,
        #[arg(long)]
        category: Option<String>,
    },
    Rule { id: String },
    Init { path: Option<PathBuf> },
    Doctor { path: Option<PathBuf> },
    Baseline {
        #[command(subcommand)]
        cmd: BaselineCmd,
    },
    Fix {
        id: String,
        #[arg(long)]
        dry_run: bool,
    },
    TestRules,
    AuditPrep { path: PathBuf },
}

#[derive(Subcommand)]
enum BaselineCmd {
    Save { path: PathBuf, #[arg(long, default_value = ".anchor-prep/baseline.json")] out: PathBuf },
    Diff { path: PathBuf, #[arg(long, default_value = ".anchor-prep/baseline.json")] baseline: PathBuf },
}

fn main() {
    if let Err(err) = run() {
        eprintln!("{} {}", "error:".red().bold(), err);
        exit(1);
    }
}

fn run() -> Result<()> {
    match Cli::parse().command {
        Commands::Scan { path, format, out, fail_on, save } => cmd_scan(&path, format, &out, &fail_on, save),
        Commands::Rules { json, category } => cmd_rules(json, category.as_deref()),
        Commands::Rule { id } => cmd_rule(&id),
        Commands::Init { path } => cmd_init(path.as_deref().unwrap_or(Path::new("."))),
        Commands::Doctor { path } => cmd_doctor(path.as_deref().unwrap_or(Path::new("."))),
        Commands::Baseline { cmd } => match cmd {
            BaselineCmd::Save { path, out } => cmd_baseline_save(&path, &out),
            BaselineCmd::Diff { path, baseline } => cmd_baseline_diff(&path, &baseline),
        },
        Commands::Fix { id, dry_run } => cmd_fix(&id, dry_run),
        Commands::TestRules => cmd_test_rules(),
        Commands::AuditPrep { path } => cmd_audit_prep(&path),
    }
}

fn cmd_scan(path: &Path, format: OutputFormat, out: &Path, fail_on: &str, save: bool) -> Result<()> {
    let report = scan_project(path)?;
    let written = write_report_files(&report, out, format.as_str())?;
    if save {
        let store = PathBuf::from(".anchor-prep/reports");
        let p = save_report_by_id(&report, &store)?;
        println!("Saved report: {}", p.display());
    }
    print_report(&report);
    println!();
    println!("{}", "Reports written:".green().bold());
    for p in written { println!("  {}", p.display()); }
    println!("\nReport ID: {}", report.id.cyan());
    if report.findings.iter().any(|f| f.severity.meets_threshold(fail_on)) {
        exit(2);
    }
    Ok(())
}

fn cmd_rules(json: bool, category: Option<&str>) -> Result<()> {
    let items: Vec<_> = catalog()
        .into_iter()
        .filter(|r| category.map(|c| r.category == c).unwrap_or(true))
        .collect();
    if json {
        println!("{}", serde_json::to_string_pretty(&items)?);
    } else {
        println!("{:<8} {:<12} {}", "ID".bold(), "CATEGORY".bold(), "TITLE".bold());
        for r in items {
            println!("{:<8} {:<12} {}", r.id, r.category, r.title);
        }
        println!("\nTotal: {} rules", catalog().len());
    }
    Ok(())
}

fn cmd_rule(id: &str) -> Result<()> {
    let meta = rule_by_id(id).ok_or_else(|| anyhow::anyhow!("Unknown rule {id}"))?;
    println!("{} — {}", meta.id.bold(), meta.title);
    println!("Category: {}", meta.category);
    println!("Severity: {}", meta.default_severity.as_str());
    println!("Exploit class: {}", meta.exploit_class);
    println!("\n{}", meta.description);
    Ok(())
}

fn cmd_init(path: &Path) -> Result<()> {
    let cfg = write_default_config(path)?;
    let action_dir = path.join(".github/workflows");
    fs::create_dir_all(&action_dir)?;
    let workflow = action_dir.join("anchor-prep.yml");
    if !workflow.exists() {
        fs::write(&workflow, include_str!("../../templates/anchor-prep.yml"))?;
    }
    println!("Created {}", cfg.display());
    println!("Created {}", workflow.display());
    Ok(())
}

fn cmd_doctor(path: &Path) -> Result<()> {
    let mut ok = true;
    println!("{}", "Anchor Security Prep Doctor".bold().cyan());
    if path.join("Anchor.toml").exists() {
        println!("[ok] Anchor.toml found");
    } else {
        println!("[warn] No Anchor.toml — will scan programs/ or path directly");
    }
    if path.join("programs").is_dir() {
        let count = fs::read_dir(path.join("programs"))?.count();
        println!("[ok] programs/ directory ({count} entries)");
    } else {
        println!("[warn] No programs/ directory");
        ok = false;
    }
    if path.join(".anchor-prep.toml").exists() {
        println!("[ok] .anchor-prep.toml configured");
    } else {
        println!("[info] Run `anchor-prep init` to scaffold config + CI");
    }
    if !ok { bail!("Project layout issues detected") }
    Ok(())
}

fn cmd_baseline_save(path: &Path, out: &Path) -> Result<()> {
    let report = scan_project(path)?;
    if let Some(parent) = out.parent() { fs::create_dir_all(parent)?; }
    fs::write(out, serde_json::to_string_pretty(&report)?)?;
    println!("Baseline saved to {}", out.display());
    Ok(())
}

fn cmd_baseline_diff(path: &Path, baseline: &Path) -> Result<()> {
    let current = scan_project(path)?;
    let raw = fs::read_to_string(baseline).context("Read baseline")?;
    let base: Value = serde_json::from_str(&raw)?;
    let base_keys: Vec<String> = base["findings"]
        .as_array()
        .unwrap_or(&vec![])
        .iter()
        .filter_map(finding_fingerprint_from_value)
        .collect();
    let cur_keys: Vec<String> = current.findings.iter().map(finding_fingerprint).collect();
    let new_findings: Vec<_> = current
        .findings
        .iter()
        .filter(|f| !base_keys.contains(&finding_fingerprint(f)))
        .collect();
    let fixed = base_keys
        .iter()
        .filter(|k| !cur_keys.contains(k))
        .count();
    println!("New findings: {}", new_findings.len());
    println!("Fixed since baseline: {fixed}");
    for f in &new_findings {
        println!("  {} {}:{} — {}", f.rule_id, f.file, f.line, f.title);
    }
    if !new_findings.is_empty() {
        exit(1);
    }
    Ok(())
}

fn finding_fingerprint(f: &crate::types::Finding) -> String {
    format!("{}:{}:{}", f.rule_id, f.file, f.line)
}

fn finding_fingerprint_from_value(v: &Value) -> Option<String> {
    let rule_id = v["rule_id"].as_str()?;
    let file = v["file"].as_str()?;
    let line = v["line"].as_u64()?;
    Some(format!("{rule_id}:{file}:{line}"))
}

fn cmd_fix(id: &str, dry_run: bool) -> Result<()> {
    let meta = rule_by_id(id).ok_or_else(|| anyhow::anyhow!("Unknown rule {id}"))?;
    println!("Fix guidance for {} — {}", meta.id, meta.title);
    println!("{}\n", meta.description);
    if dry_run {
        println!("(dry-run) No files modified. Integrate fix patterns in your accounts constraints.");
    }
    Ok(())
}

fn cmd_test_rules() -> Result<()> {
    println!("Running rule regression tests...");
    let status = std::process::Command::new("cargo")
        .args(["test", "-p", "anchor-prep"])
        .status()
        .context("cargo test")?;
    if !status.success() { exit(1); }
    Ok(())
}

fn cmd_audit_prep(path: &Path) -> Result<()> {
    let report = scan_project(path)?;
    let (c, h, m, l) = report.summary();
    let md = format!(
        "# Pre-Audit Checklist\n\nProject: `{}`\n\n## anchor-prep summary\n- Critical: {c}\n- High: {h}\n- Medium: {m}\n- Low: {l}\n\n## Recommended before audit\n- [ ] Resolve all Critical/High findings\n- [ ] Run STRIDE / audit subsidy application if eligible\n- [ ] Document known Medium/Low accepted risks\n- [ ] Fuzz test critical instructions\n- [ ] Review CPI trust boundaries\n",
        report.project_path
    );
    let out = path.join(".anchor-prep/audit-checklist.md");
    if let Some(p) = out.parent() { fs::create_dir_all(p)?; }
    fs::write(&out, md)?;
    println!("Wrote {}", out.display());
    Ok(())
}

fn print_report(report: &crate::types::ScanReport) {
    let (critical, high, medium, low) = report.summary();
    println!("{}", "Anchor Security Prep".bold().cyan());
    println!("Project: {}", report.project_path);
    println!("Files: {} | Rules: {}", report.files_scanned, report.rules_run);
    println!("Summary: {} critical, {} high, {} medium, {} low",
        critical.to_string().red(), high.to_string().bright_red(),
        medium.to_string().yellow(), low.to_string().blue());
    if report.findings.is_empty() {
        println!("{}", "No findings.".green().bold());
        return;
    }
    println!();
    for f in &report.findings {
        let sev = match f.severity {
            Severity::Critical => f.severity.as_str().red().bold(),
            Severity::High => f.severity.as_str().bright_red(),
            Severity::Medium => f.severity.as_str().yellow(),
            Severity::Low => f.severity.as_str().blue(),
        };
        let file = f.file.rsplit('/').next().unwrap_or(&f.file);
        println!("{:<10} {:<8} L{:<4} {} — {}", sev, f.rule_id, f.line, file, f.message);
    }
}
