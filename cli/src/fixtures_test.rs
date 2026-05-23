use std::path::PathBuf;

use crate::scanner::scan_project;

fn fixture_dir(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../fixtures")
        .join(name)
}

#[test]
fn fixture_asp001_missing_signer() {
    let report = scan_project(&fixture_dir("asp001")).expect("scan");
    assert!(report.findings.iter().any(|f| f.rule_id == "ASP001"));
}

#[test]
fn fixture_asp003_pda_bump() {
    let report = scan_project(&fixture_dir("asp003")).expect("scan");
    assert!(report.findings.iter().any(|f| f.rule_id == "ASP003"));
}

#[test]
fn fixture_asp006_cpi() {
    let report = scan_project(&fixture_dir("asp006")).expect("scan");
    assert!(report.findings.iter().any(|f| f.rule_id == "ASP006"));
}

#[test]
fn fixture_asp015_admin() {
    let report = scan_project(&fixture_dir("asp015")).expect("scan");
    assert!(report.findings.iter().any(|f| f.rule_id == "ASP015"));
}

#[test]
fn fixture_asp021_unchecked_math() {
    let report = scan_project(&fixture_dir("asp021")).expect("scan");
    assert!(report.findings.iter().any(|f| f.rule_id == "ASP021"));
}

#[test]
fn fixture_asp025_remaining() {
    let report = scan_project(&fixture_dir("asp025")).expect("scan");
    assert!(report.findings.iter().any(|f| f.rule_id == "ASP025"));
}

#[test]
fn fixture_asp026_discriminator() {
    let report = scan_project(&fixture_dir("asp026")).expect("scan");
    assert!(report.findings.iter().any(|f| f.rule_id == "ASP026"));
}

#[test]
fn all_rules_count_is_26() {
    let report = scan_project(
        &PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../examples/vulnerable-program"),
    )
    .expect("scan");
    assert_eq!(report.rules_run, 26);
    assert!(report.findings.len() >= 20);
}
