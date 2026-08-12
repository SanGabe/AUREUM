import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  extractWhatsAppMessages,
  normalizeWhatsAppPhone,
  verifyWhatsAppSignature,
} from "@/lib/aureum/whatsapp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (
    mode === "subscribe"
    && token
    && challenge
    && token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
  }

  return NextResponse.json({ error: "verification_failed" }, { status: 403 });
}

export async function POST(request: Request) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) return NextResponse.json({ error: "webhook_not_configured" }, { status: 503 });

  const rawBody = await request.text();
  if (!verifyWhatsAppSignature(rawBody, request.headers.get("x-hub-signature-256"), appSecret)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const messages = extractWhatsAppMessages(payload);
  if (!messages.length) return NextResponse.json({ ok: true, accepted: 0 });

  const rows = messages.map(({ message, metadata }) => ({
    meta_message_id: message.id,
    event_type: `message.${message.type ?? "unknown"}`,
    phone_e164: normalizeWhatsAppPhone(message.from),
    payload: { message, metadata },
    status: "pending",
  }));

  const supabase = createAdminClient();
  const { error } = await supabase.from("whatsapp_webhook_events").upsert(rows, {
    onConflict: "meta_message_id",
    ignoreDuplicates: true,
  });
  if (error) {
    console.error("whatsapp webhook persistence failed", error);
    return NextResponse.json({ error: "webhook_persistence_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, accepted: rows.length });
}
