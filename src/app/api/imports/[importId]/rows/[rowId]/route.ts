import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ importId: string; rowId: string }> }) {
  const { importId, rowId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const action = String(body.action ?? "");
  const { data: row } = await supabase.from("financial_import_rows").select("id, import_id").eq("id", rowId).eq("import_id", importId).maybeSingle();
  if (!row) return NextResponse.json({ error: "import_row_not_found" }, { status: 404 });

  const { data, error } = await supabase.rpc("review_financial_import_row_v13", {
    target_row_id: rowId,
    target_action: action,
    target_occurred_on: body.occurredOn || null,
    target_description: body.description || null,
    target_amount: Number.isFinite(Number(body.amount)) ? Number(body.amount) : null,
    target_type: body.type || null,
    target_category_id: body.categoryId || null,
    target_account_id: body.accountId || null,
    target_card_id: body.cardId || null,
  });
  if (error) return NextResponse.json({ error: "import_review_failed", detail: error.message }, { status: error.message.includes("forbidden") ? 403 : 400 });
  return NextResponse.json({ ok: true, result: data?.[0] ?? null });
}
