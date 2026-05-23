use crate::rule_catalog::catalog;
use crate::types::{ScanReport, Severity};

pub fn to_sarif(report: &ScanReport) -> String {
    let results: Vec<_> = report
        .findings
        .iter()
        .map(|f| {
            let help_uri = help_uri_for(&f.rule_id);
            serde_json::json!({
                "ruleId": f.rule_id,
                "level": severity_to_level(f.severity),
                "message": { "text": format!("{} — {}", f.title, f.message) },
                "locations": [{
                    "physicalLocation": {
                        "artifactLocation": { "uri": f.file },
                        "region": { "startLine": f.line }
                    }
                }],
                "properties": {
                    "fixHint": f.fix_hint,
                    "title": f.title,
                    "helpUri": help_uri
                }
            })
        })
        .collect();

    let rules: Vec<_> = catalog()
        .iter()
        .map(|r| {
            serde_json::json!({
                "id": r.id,
                "name": r.title,
                "shortDescription": { "text": r.description },
                "fullDescription": { "text": format!("{} — {}", r.exploit_class, r.description) },
                "helpUri": help_uri_for(&r.id),
                "defaultConfiguration": {
                    "level": severity_to_level(r.default_severity)
                }
            })
        })
        .collect();

    let doc = serde_json::json!({
        "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
        "version": "2.1.0",
        "runs": [{
            "tool": {
                "driver": {
                    "name": "anchor-prep",
                    "version": "0.2.0",
                    "informationUri": "https://github.com/anchor-security-prep/anchor-prep",
                    "rules": rules
                }
            },
            "results": results
        }]
    });

    serde_json::to_string_pretty(&doc).unwrap_or_else(|_| "{}".to_string())
}

fn help_uri_for(rule_id: &str) -> String {
    catalog()
        .iter()
        .find(|r| r.id == rule_id)
        .map(|r| format!("https://anchor-security-prep.dev/rules/{}", r.id.to_lowercase()))
        .unwrap_or_else(|| format!("https://anchor-security-prep.dev/rules/{rule_id}"))
}

fn severity_to_level(sev: Severity) -> &'static str {
    match sev {
        Severity::Critical | Severity::High => "error",
        Severity::Medium => "warning",
        Severity::Low => "note",
    }
}
