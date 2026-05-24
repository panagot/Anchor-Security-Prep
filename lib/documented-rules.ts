/** Rules with full bad/good pattern docs on the site (see app/rules/[id]/page.tsx). */
export const DOCUMENTED_RULE_IDS = new Set([
  "ASP001",
  "ASP002",
  "ASP003",
  "ASP004",
  "ASP006",
  "ASP009",
  "ASP010",
  "ASP011",
  "ASP015",
  "ASP019",
  "ASP021",
  "ASP023",
  "ASP025",
  "ASP026",
]);

export function hasFullRuleDoc(ruleId: string): boolean {
  return DOCUMENTED_RULE_IDS.has(ruleId.toUpperCase());
}
