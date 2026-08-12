import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const LINK_TOKEN_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export type WhatsAppMessage = {
  id: string;
  from?: string;
  timestamp?: string;
  type?: string;
  text?: { body?: string };
  document?: {
    id?: string;
    filename?: string;
    mime_type?: string;
    sha256?: string;
  };
  image?: {
    id?: string;
    mime_type?: string;
    sha256?: string;
    caption?: string;
  };
};

type WhatsAppWebhookPayload = {
  entry?: Array<{
    changes?: Array<{
      value?: {
        metadata?: { phone_number_id?: string; display_phone_number?: string };
        messages?: WhatsAppMessage[];
      };
    }>;
  }>;
};

export type ExtractedWhatsAppMessage = {
  message: WhatsAppMessage;
  metadata: { phone_number_id?: string; display_phone_number?: string };
};

export function normalizeWhatsAppPhone(value: string | undefined) {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15 || digits.startsWith("0")) return null;
  return `+${digits}`;
}

export function verifyWhatsAppSignature(rawBody: string, signature: string | null, appSecret: string) {
  if (!signature?.startsWith("sha256=")) return false;
  const receivedHex = signature.slice("sha256=".length);
  if (!/^[a-f0-9]{64}$/i.test(receivedHex)) return false;

  const expected = createHmac("sha256", appSecret).update(rawBody, "utf8").digest();
  const received = Buffer.from(receivedHex, "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export function extractWhatsAppMessages(payload: unknown): ExtractedWhatsAppMessage[] {
  if (!payload || typeof payload !== "object") return [];
  const webhook = payload as WhatsAppWebhookPayload;
  const extracted: ExtractedWhatsAppMessage[] = [];

  for (const entry of webhook.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const metadata = change.value?.metadata ?? {};
      for (const message of change.value?.messages ?? []) {
        if (message?.id) extracted.push({ message, metadata });
      }
    }
  }

  return extracted;
}

export function createWhatsAppLinkToken() {
  const bytes = randomBytes(8);
  return Array.from(bytes, (byte) => LINK_TOKEN_ALPHABET[byte % LINK_TOKEN_ALPHABET.length]).join("");
}

export function whatsappLinkTokenHash(token: string) {
  const secret = process.env.WHATSAPP_LINK_TOKEN_SECRET;
  if (!secret || secret.length < 24) {
    throw new Error("WHATSAPP_LINK_TOKEN_SECRET deve ter pelo menos 24 caracteres.");
  }
  return createHmac("sha256", secret).update(token.trim().toUpperCase()).digest("hex");
}

export function secureSecretMatches(received: string | null, expected: string | undefined) {
  if (!received || !expected) return false;
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

type WhatsAppMediaMetadata = {
  id: string;
  url: string;
  mime_type?: string;
  sha256?: string;
  file_size?: number;
};

export async function downloadWhatsAppMedia(mediaId: string, webhookPhoneNumberId?: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const graphVersion = process.env.WHATSAPP_GRAPH_VERSION;
  if (!accessToken || !graphVersion || !/^v\d+\.\d+$/.test(graphVersion)) {
    throw new Error("WHATSAPP_ACCESS_TOKEN e WHATSAPP_GRAPH_VERSION não estão configurados.");
  }

  const metadataUrl = new URL(`https://graph.facebook.com/${graphVersion}/${encodeURIComponent(mediaId)}`);
  const phoneNumberId = webhookPhoneNumberId ?? process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (phoneNumberId) metadataUrl.searchParams.set("phone_number_id", phoneNumberId);

  const metadataResponse = await fetch(
    metadataUrl,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    },
  );
  if (!metadataResponse.ok) {
    throw new Error(`Falha ao consultar mídia do WhatsApp: HTTP ${metadataResponse.status}.`);
  }

  const metadata = (await metadataResponse.json()) as WhatsAppMediaMetadata;
  if (!metadata.url) throw new Error("A Meta não retornou a URL temporária da mídia.");

  const mediaResponse = await fetch(metadata.url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  if (!mediaResponse.ok) {
    throw new Error(`Falha ao baixar mídia do WhatsApp: HTTP ${mediaResponse.status}.`);
  }

  return {
    bytes: new Uint8Array(await mediaResponse.arrayBuffer()),
    mimeType: metadata.mime_type ?? mediaResponse.headers.get("content-type") ?? "application/octet-stream",
    providerSha256: metadata.sha256 ?? null,
    providerFileSize: metadata.file_size ?? null,
  };
}
