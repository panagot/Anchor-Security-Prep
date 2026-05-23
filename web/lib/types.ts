export type Severity = "critical" | "high" | "medium" | "low";

export interface Finding {
  rule_id: string;
  title: string;
  severity: Severity;
  file: string;
  line: number;
  message: string;
  fix_hint: string;
  code_snippet: string;
  category: string;
}

export interface ScanReport {
  id: string;
  project_path: string;
  scanned_at: string;
  files_scanned: number;
  rules_run: number;
  findings: Finding[];
}

export interface RuleInfo {
  id: string;
  title: string;
  category: string;
  description: string;
  default_severity: Severity;
  exploit_class: string;
  docs_slug: string;
}
