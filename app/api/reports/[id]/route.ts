import { NextResponse } from "next/server";

import { getBundledReport, getBundledSarif } from "@/lib/static-data";
import { getReportSarif, getReport } from "@/lib/store";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = getReport(id) ?? getBundledReport(id);
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const format = url.searchParams.get("format");

  if (format === "json") {
    return new NextResponse(JSON.stringify(report, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="report-${id}.json"`,
      },
    });
  }

  if (format === "sarif") {
    const sarif = getReportSarif(id) ?? getBundledSarif(id);
    if (!sarif) {
      return NextResponse.json(
        { error: "SARIF export available for locally scanned reports. Clone the repo and run: anchor-prep scan . --format sarif" },
        { status: 404 }
      );
    }
    return new NextResponse(sarif, {
      headers: {
        "Content-Type": "application/sarif+json",
        "Content-Disposition": `attachment; filename="report-${id}.sarif"`,
      },
    });
  }

  return NextResponse.json(report);
}
