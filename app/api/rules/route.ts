import { NextResponse } from "next/server";

import { loadBundledRulesJson } from "@/lib/static-data";
import { checkCliAvailable } from "@/lib/scanner";

export async function GET() {
  const bundled = loadBundledRulesJson();
  if (bundled) {
    const cli = checkCliAvailable();
    if (!cli.ok) {
      return new NextResponse(bundled, { headers: { "Content-Type": "application/json" } });
    }
  }

  const status = checkCliAvailable();
  if (!status.ok) {
    return NextResponse.json({ error: status.message, rules: [] }, { status: 503 });
  }

  try {
    const { runRulesJson } = await import("@/lib/scanner");
    return new NextResponse(runRulesJson(), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load rules" },
      { status: 500 }
    );
  }
}
