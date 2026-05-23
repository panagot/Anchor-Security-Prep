# ScanReport JSON Schema (v0.2)

```json
{
  "id": "uuid",
  "project_path": "string",
  "scanned_at": "RFC3339 timestamp",
  "files_scanned": 1,
  "rules_run": 25,
  "findings": [
    {
      "rule_id": "ASP001",
      "title": "string",
      "severity": "critical|high|medium|low",
      "file": "path/to/file.rs",
      "line": 42,
      "message": "string",
      "fix_hint": "string",
      "code_snippet": "string",
      "category": "account|cpi|token|..."
    }
  ]
}
```

SARIF 2.1 export available via `--format sarif`.
