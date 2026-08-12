import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createWhatsAppLinkToken,
  whatsappLinkTokenHash,
} from "@/lib/aureum/whatsapp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as { householdId?: string };
    let membershipQuery = supabase
      .from("household_members")
      .select("household_id")
      .eq("user_id", user.id);
    if (body.householdId) membershipQuery = membershipQuery.eq("household_id", body.householdId);
    const { data: memberships, error: membershipError } = await membershipQuery.limit(1);
    if (membershipError) throw membershipError;

    const householdId = memberships?.[0]?.household_id as string | undefined;
    if (!householdId) return NextResponse.json({ error: "household_forbidden" }, { status: 403 });

    const token = createWhatsAppLinkToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const { error } = await supabase.from("whatsapp_link_tokens").insert({
      user_id: user.id,
      household_id: householdId,
      token_hash: whatsappLinkTokenHash(token),
      expires_at: expiresAt,
    });
    if (error) throw error;

    return NextResponse.json({
      ok: true,
      token,
      expiresAt,
      phrase: `AUREUM ${token}`,
    });
  } catch (error) {
    console.error("whatsapp link token failed", error);
    return NextResponse.json({ error: "whatsapp_link_failed" }, { status: 500 });
  }
}
