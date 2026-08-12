import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  FinancialIngestionError,
  MAX_FINANCIAL_IMPORT_BYTES,
  ingestFinancialFile,
  safeFinancialFilename,
} from "@/lib/aureum/financial-ingestion";
import {
  downloadWhatsAppMedia,
  normalizeWhatsAppPhone,
  secureSecretMatches,
  whatsappLinkTokenHash,
  type WhatsAppMessage,
} from "@/lib/aureum/whatsapp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ClaimedEvent = {
  id: string;
  event_type: string;
  phone_e164: string | null;
  payload: {
    message?: WhatsAppMessage;
    metadata?: { phone_number_id?: string };
  };
  attempts: number;
};

function mediaFilename(message: WhatsAppMessage, mimeType: string) {
  if (message.document?.filename) return safeFinancialFilename(message.document.filename);
  const extensions: Record<string, string> = {
    "text/csv": "csv",
    "text/plain": "txt",
    "application/pdf": "pdf",
    "application/x-ofx": "ofx",
    "application/vnd.intu.qfx": "ofx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const extension = extensions[mimeType] ?? "bin";
  return `whatsapp-${message.id}.${extension}`;
}

async function processLinkMessage(event: ClaimedEvent) {
  const message = event.payload.message;
  const match = message?.text?.body?.trim().match(/^AUREUM\s+([A-Z0-9]{8})$/i);
  if (!match) return { status: "ignored" as const, reason: "unsupported_text" };

  const phone = normalizeWhatsAppPhone(message?.from) ?? event.phone_e164;
  if (!phone) return { status: "ignored" as const, reason: "invalid_phone" };

  const supabase = createAdminClient();
  const { data: token, error } = await supabase
    .from("whatsapp_link_tokens")
    .select("id, user_id, household_id")
    .eq("token_hash", whatsappLinkTokenHash(match[1]))
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (error) throw error;
  if (!token) return { status: "ignored" as const, reason: "invalid_or_expired_token" };

  const now = new Date().toISOString();
  const { error: contactError } = await supabase.from("whatsapp_contacts").upsert({
    user_id: token.user_id,
    household_id: token.household_id,
    phone_e164: phone,
    wa_id: message?.from ?? null,
    status: "active",
    linked_at: now,
    last_seen_at: now,
  }, { onConflict: "phone_e164" });
  if (contactError) throw contactError;

  const { error: tokenError } = await supabase
    .from("whatsapp_link_tokens")
    .update({ consumed_at: now })
    .eq("id", token.id)
    .is("consumed_at", null);
  if (tokenError) throw tokenError;

  return { status: "processed" as const, reason: "contact_linked" };
}

async function processMediaMessage(event: ClaimedEvent) {
  const message = event.payload.message;
  const media = message?.document ?? message?.image;
  if (!message || !media?.id) return { status: "ignored" as const, reason: "media_id_missing" };

  const phone = normalizeWhatsAppPhone(message.from) ?? event.phone_e164;
  if (!phone) return { status: "ignored" as const, reason: "invalid_phone" };

  const supabase = createAdminClient();
  const { data: contact, error: contactError } = await supabase
    .from("whatsapp_contacts")
    .select("id, user_id, household_id")
    .eq("phone_e164", phone)
    .eq("status", "active")
    .maybeSingle();
  if (contactError) throw contactError;
  if (!contact) return { status: "ignored" as const, reason: "unlinked_contact" };

  const downloaded = await downloadWhatsAppMedia(media.id, event.payload.metadata?.phone_number_id);
  if (downloaded.bytes.byteLength > MAX_FINANCIAL_IMPORT_BYTES) {
    throw new FinancialIngestionError("file_too_large", "A mídia excede o limite de 20 MB.", 413);
  }

  const result = await ingestFinancialFile({
    supabase,
    userId: contact.user_id,
    householdId: contact.household_id,
    filename: mediaFilename(message, downloaded.mimeType),
    mimeType: downloaded.mimeType,
    bytes: downloaded.bytes,
    channel: "whatsapp",
    metadata: {
      whatsapp_message_id: message.id,
      whatsapp_media_id: media.id,
      provider_sha256: downloaded.providerSha256,
      provider_file_size: downloaded.providerFileSize,
    },
  });

  await supabase.from("whatsapp_contacts").update({ last_seen_at: new Date().toISOString() }).eq("id", contact.id);
  return { status: "processed" as const, reason: "financial_import_created", importId: result.id };
}

async function processEvent(event: ClaimedEvent) {
  if (event.event_type === "message.text") return processLinkMessage(event);
  if (event.event_type === "message.document" || event.event_type === "message.image") {
    return processMediaMessage(event);
  }
  return { status: "ignored" as const, reason: "unsupported_message_type" };
}

export async function POST(request: Request) {
  if (!secureSecretMatches(
    request.headers.get("x-aureum-worker-secret"),
    process.env.IMPORT_WORKER_SECRET,
  )) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  const supabase = createAdminClient();
  await supabase.rpc("cleanup_whatsapp_link_tokens_v12");
  const { data, error } = await supabase.rpc("claim_whatsapp_webhook_events_v12", { batch_size: 10 });
  if (error) return NextResponse.json({ error: "event_claim_failed", detail: error.message }, { status: 500 });

  const events = (data ?? []) as ClaimedEvent[];
  const summary = { claimed: events.length, processed: 0, ignored: 0, retried: 0, failed: 0 };

  for (const event of events) {
    try {
      const result = await processEvent(event);
      const status = result.status;
      await supabase.from("whatsapp_webhook_events").update({
        status,
        processed_at: new Date().toISOString(),
        locked_at: null,
        last_error: status === "ignored" ? result.reason : null,
      }).eq("id", event.id);
      summary[status] += 1;
    } catch (eventError) {
      const message = eventError instanceof Error ? eventError.message : "Erro desconhecido.";
      const permanentlyFailed = event.attempts >= 5;
      const delayMinutes = Math.min(60, 2 ** Math.max(1, event.attempts));
      await supabase.from("whatsapp_webhook_events").update({
        status: permanentlyFailed ? "failed" : "pending",
        next_attempt_at: new Date(Date.now() + delayMinutes * 60_000).toISOString(),
        locked_at: null,
        last_error: message.slice(0, 500),
      }).eq("id", event.id);
      summary[permanentlyFailed ? "failed" : "retried"] += 1;
    }
  }

  return NextResponse.json({ ok: true, ...summary });
}
