import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    application: "aureum",
    environment: process.env.VERCEL_ENV ?? "local",
    timestamp: new Date().toISOString(),
  });
}
