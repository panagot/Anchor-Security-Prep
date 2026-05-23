use std::fs;
use std::path::{Path, PathBuf};

use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PrepConfig {
    pub fail_on: String,
    pub disabled_rules: Vec<String>,
    pub include: Vec<String>,
}

impl Default for PrepConfig {
    fn default() -> Self {
        Self {
            fail_on: "high".to_string(),
            disabled_rules: vec![],
            include: vec!["programs/**/*.rs".to_string()],
        }
    }
}

pub fn load_config(project_path: &Path) -> PrepConfig {
    let path = project_path.join(".anchor-prep.toml");
    if !path.exists() {
        return PrepConfig::default();
    }
    match fs::read_to_string(&path) {
        Ok(raw) => toml::from_str(&raw).unwrap_or_default(),
        Err(_) => PrepConfig::default(),
    }
}

pub fn write_default_config(path: &Path) -> Result<PathBuf> {
    let config_path = path.join(".anchor-prep.toml");
    let content = r#"# Anchor Security Prep configuration
fail_on = "high"
disabled_rules = []
include = ["programs/**/*.rs"]
"#;
    fs::write(&config_path, content).with_context(|| "Failed to write .anchor-prep.toml")?;
    Ok(config_path)
}

pub fn is_rule_enabled(config: &PrepConfig, rule_id: &str) -> bool {
    !config.disabled_rules.iter().any(|r| r == rule_id)
}
