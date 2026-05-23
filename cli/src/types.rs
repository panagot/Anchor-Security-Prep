use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Severity {
    Low,
    Medium,
    High,
    Critical,
}

impl Severity {
    pub fn as_str(&self) -> &'static str {
        match self {
            Severity::Low => "LOW",
            Severity::Medium => "MEDIUM",
            Severity::High => "HIGH",
            Severity::Critical => "CRITICAL",
        }
    }

    pub fn meets_threshold(self, threshold: &str) -> bool {
        let min = match threshold.to_lowercase().as_str() {
            "critical" => Severity::Critical,
            "high" => Severity::High,
            "medium" => Severity::Medium,
            "low" => Severity::Low,
            _ => Severity::High,
        };
        self >= min
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Finding {
    pub rule_id: String,
    pub title: String,
    pub severity: Severity,
    pub file: String,
    pub line: usize,
    pub message: String,
    pub fix_hint: String,
    pub code_snippet: String,
    pub category: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanReport {
    pub id: String,
    pub project_path: String,
    pub scanned_at: String,
    pub files_scanned: usize,
    pub rules_run: usize,
    pub findings: Vec<Finding>,
}

impl ScanReport {
    pub fn has_high_severity(&self) -> bool {
        self.findings
            .iter()
            .any(|f| matches!(f.severity, Severity::Critical | Severity::High))
    }

    pub fn summary(&self) -> (usize, usize, usize, usize) {
        let mut critical = 0;
        let mut high = 0;
        let mut medium = 0;
        let mut low = 0;
        for f in &self.findings {
            match f.severity {
                Severity::Critical => critical += 1,
                Severity::High => high += 1,
                Severity::Medium => medium += 1,
                Severity::Low => low += 1,
            }
        }
        (critical, high, medium, low)
    }
}

#[derive(Debug, Clone)]
pub struct SourceFile {
    pub path: String,
    pub content: String,
    pub lines: Vec<String>,
}

impl SourceFile {
    pub fn snippet_around(&self, line: usize, context: usize) -> String {
        let idx = line.saturating_sub(1);
        let start = idx.saturating_sub(context);
        let end = (idx + context + 1).min(self.lines.len());
        self.lines[start..end]
            .iter()
            .enumerate()
            .map(|(i, l)| {
                let n = start + i + 1;
                if n == line {
                    format!("> {n:4} | {l}")
                } else {
                    format!("  {n:4} | {l}")
                }
            })
            .collect::<Vec<_>>()
            .join("\n")
    }
}
