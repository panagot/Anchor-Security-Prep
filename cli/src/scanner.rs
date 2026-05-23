use std::fs;
use std::path::{Path, PathBuf};

use anyhow::{Context, Result, bail};
use chrono::Utc;
use uuid::Uuid;
use walkdir::WalkDir;

use crate::config::{is_rule_enabled, load_config};
use crate::rules::all_rules;
use crate::types::{ScanReport, SourceFile};

pub fn scan_project(project_path: &Path) -> Result<ScanReport> {
    if !project_path.exists() {
        bail!("Project path does not exist: {}", project_path.display());
    }

    let config = load_config(project_path);
    let files = collect_source_files(project_path)?;
    if files.is_empty() {
        bail!(
            "No Rust source files found under {}. Expected Anchor layout with programs/**/*.rs",
            project_path.display()
        );
    }

    let rules = all_rules();
    let mut findings = Vec::new();
    for file in &files {
        for rule in &rules {
            if !is_rule_enabled(&config, rule.id()) {
                continue;
            }
            findings.extend(rule.check(file));
        }
    }

    findings.sort_by(|a, b| {
        b.severity
            .cmp(&a.severity)
            .then(a.file.cmp(&b.file))
            .then(a.line.cmp(&b.line))
    });

    Ok(ScanReport {
        id: Uuid::new_v4().to_string(),
        project_path: project_path.display().to_string(),
        scanned_at: Utc::now().to_rfc3339(),
        files_scanned: files.len(),
        rules_run: rules.len(),
        findings,
    })
}

fn collect_source_files(project_path: &Path) -> Result<Vec<SourceFile>> {
    let programs_dir = project_path.join("programs");
    let search_root = if programs_dir.is_dir() {
        programs_dir
    } else {
        project_path.to_path_buf()
    };

    let mut files = Vec::new();
    for entry in WalkDir::new(&search_root)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|e| e.file_type().is_file())
    {
        let path = entry.path();
        if path.extension().and_then(|s| s.to_str()) != Some("rs") {
            continue;
        }

        let content = fs::read_to_string(path)
            .with_context(|| format!("Failed to read {}", path.display()))?;
        let lines: Vec<String> = content.lines().map(ToString::to_string).collect();
        files.push(SourceFile {
            path: normalize_path(path),
            content,
            lines,
        });
    }

    Ok(files)
}

fn normalize_path(path: &Path) -> String {
    path.to_string_lossy().replace('\\', "/")
}

pub fn write_report_files(
    report: &ScanReport,
    output_dir: &Path,
    format: &str,
) -> Result<Vec<PathBuf>> {
    fs::create_dir_all(output_dir)?;
    let mut written = Vec::new();

    if format == "json" || format == "all" {
        let json_path = output_dir.join("report.json");
        fs::write(&json_path, serde_json::to_string_pretty(report)?)?;
        written.push(json_path);
    }
    if format == "md" || format == "all" {
        let md_path = output_dir.join("report.md");
        fs::write(&md_path, render_markdown(report))?;
        written.push(md_path);
    }
    if format == "sarif" || format == "all" {
        let sarif_path = output_dir.join("report.sarif");
        fs::write(&sarif_path, crate::sarif::to_sarif(report))?;
        written.push(sarif_path);
    }

    Ok(written)
}

pub fn save_report_by_id(report: &ScanReport, store_dir: &Path) -> Result<PathBuf> {
    fs::create_dir_all(store_dir)?;
    let path = store_dir.join(format!("{}.json", report.id));
    fs::write(&path, serde_json::to_string_pretty(report)?)?;
    Ok(path)
}

fn render_markdown(report: &ScanReport) -> String {
    let (critical, high, medium, low) = report.summary();
    let mut md = String::new();
    md.push_str("# Anchor Security Prep Report\n\n");
    md.push_str(&format!("- Report ID: `{}`\n", report.id));
    md.push_str(&format!("- Project: `{}`\n", report.project_path));
    md.push_str(&format!("- Scanned at: {}\n", report.scanned_at));
    md.push_str(&format!("- Files scanned: {}\n", report.files_scanned));
    md.push_str(&format!("- Rules run: {}\n", report.rules_run));
    md.push_str(&format!(
        "- Findings: {} critical, {} high, {} medium, {} low\n\n",
        critical, high, medium, low
    ));

    if report.findings.is_empty() {
        md.push_str("No findings.\n");
        return md;
    }

    for finding in &report.findings {
        md.push_str(&format!(
            "## [{}/{}] {} (line {})\n\n",
            finding.severity.as_str(),
            finding.rule_id,
            finding.title,
            finding.line
        ));
        md.push_str(&format!("{}\n\n", finding.message));
        md.push_str(&format!("**Fix:** {}\n\n", finding.fix_hint));
        md.push_str("```rust\n");
        md.push_str(&finding.code_snippet);
        md.push_str("\n```\n\n");
    }

    md
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    #[test]
    fn vulnerable_has_many_findings() {
        let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("../examples/vulnerable-program");
        let report = scan_project(&path).expect("scan");
        assert!(report.findings.len() >= 10);
        assert!(report.has_high_severity());
    }

    #[test]
    fn clean_has_no_high_critical() {
        let path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../examples/clean-program");
        let report = scan_project(&path).expect("scan");
        assert!(!report
            .findings
            .iter()
            .any(|f| matches!(f.severity, crate::types::Severity::Critical | crate::types::Severity::High)));
    }
}
