import { NextResponse } from "next/server";

import { loadBundledReports } from "@/lib/static-data";
import { listReports } from "@/lib/store";

export async function GET() {
  const live = listReports();
  if (live.length > 0) return NextResponse.json(live);
  return NextResponse.json(loadBundledReports());
}
