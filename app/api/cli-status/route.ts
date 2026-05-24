import { NextResponse } from "next/server";

import { isVercel } from "@/lib/static-data";
import { checkCliAvailable } from "@/lib/scanner";

/** Whether live CLI scans are available on this host (false on Vercel). */
export async function GET() {
  if (isVercel()) {
    return NextResponse.json({ available: false, reason: "demo_mode" });
  }
  const cli = checkCliAvailable();
  return NextResponse.json({
    available: cli.ok,
    reason: cli.ok ? null : "cli_not_built",
  });
}
