/** Bundled sample report IDs — keep in sync with public/samples/*-report.json */
export const SAMPLE_REPORT_IDS = {
  vulnerable: "e8494079-b4d7-43b7-a924-461d976fe5da",
  clean: "0134672b-ec5e-43aa-87b3-b7800bd49fc7",
} as const;

export function sampleReportUrl(kind: keyof typeof SAMPLE_REPORT_IDS = "vulnerable") {
  return `/report/${SAMPLE_REPORT_IDS[kind]}`;
}

export function isBundledReportId(id: string): boolean {
  return id === SAMPLE_REPORT_IDS.vulnerable || id === SAMPLE_REPORT_IDS.clean;
}
