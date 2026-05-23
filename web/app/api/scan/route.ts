import { NextResponse } from "next/server";

import { isVercel } from "@/lib/static-data";
import { checkCliAvailable, runScan } from "@/lib/scanner";
import { saveReport } from "@/lib/store";

export async function POST(req: Request) {
  if (isVercel()) {
    return NextResponse.json(
      {
        error:
          "Live scans run locally via the CLI. Use /compare for an instant demo, or clone the repo and run: cargo run -p anchor-prep -- scan examples/vulnerable-program",
      },
      { status: 503 }
    );
  }

  const cli = checkCliAvailable();
  if (!cli.ok) {
    return NextResponse.json({ error: cli.message }, { status: 503 });
  }

  try {
    const { path } = await req.json();
    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "path is required" }, { status: 400 });
    }
    const report = runScan(path);
    saveReport(report);
    return NextResponse.json({ id: report.id, report });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Scan failed" }, { status: 500 });
  }
}
