import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  FinancialIngestionError,
  MAX_FINANCIAL_IMPORT_BYTES,
  ingestFinancialFile,
} from "@/lib/aureum/financial-ingestion";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_FINANCIAL_IMPORT_BYTES + 1024 * 1024) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file");
    const householdId = String(formData.get("householdId") ?? "");
    const currency = String(formData.get("currency") ?? "BRL").toUpperCase();

    if (!(file instanceof File) || !householdId) {
      return NextResponse.json({ error: "file_and_household_required" }, { status: 400 });
    }
    if (!/^[A-Z]{3}$/.test(currency)) {
      return NextResponse.json({ error: "invalid_currency" }, { status: 400 });
    }

    const { data: membership, error: membershipError } = await supabase
      .from("household_members")
      .select("household_id")
      .eq("household_id", householdId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (membershipError) throw membershipError;
    if (!membership) return NextResponse.json({ error: "household_forbidden" }, { status: 403 });

    const result = await ingestFinancialFile({
      supabase,
      userId: user.id,
      householdId,
      filename: file.name,
      mimeType: file.type,
      bytes: new Uint8Array(await file.arrayBuffer()),
      channel: "web",
      currency,
    });

    return NextResponse.json({ ok: true, import: result }, { status: result.status === "duplicate" ? 200 : 201 });
  } catch (error) {
    if (error instanceof FinancialIngestionError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
    }
    console.error("financial import failed", error);
    return NextResponse.json({ error: "financial_import_failed" }, { status: 500 });
  }
}
