import "server-only";

import { createHmac } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isValidCnpj,
  isValidCpf,
  normalizeCnpj,
  onlyDigits,
} from "@/lib/aureum/identity-validation";

export type IdentityDocumentType = "cpf" | "cnpj";

export type IdentityVerificationResult = {
  valid: boolean;
  officialVerified: boolean;
  provider: "local" | "serpro";
  status:
    | "invalid_structure"
    | "structure_valid"
    | "official_verified"
    | "official_not_verified"
    | "provider_unavailable"
    | "rate_limited";
  providerStatus?: number;
};

function fillTemplate(
  template: string,
  values: Record<string, string>,
) {
  let result = template;

  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(
      `{${key}}`,
      encodeURIComponent(value),
    );
  }

  return result;
}

function clientFingerprint(request: Request) {
  const forwarded =
    request.headers
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim() ?? "unknown";

  const secret =
    process.env.IDENTITY_RATE_LIMIT_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "aureum-local";

  return createHmac("sha256", secret)
    .update(forwarded)
    .digest("hex");
}

async function checkRemoteBudget(request: Request) {
  const admin = createAdminClient();
  const fingerprint = clientFingerprint(request);
  const now = new Date();
  const tenMinutesAgo = new Date(
    now.getTime() - 10 * 60 * 1000,
  ).toISOString();
  const today = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    ),
  ).toISOString();

  const perTenMinutes = Number(
    process.env.IDENTITY_PER_10_MINUTE_LIMIT ?? 5,
  );

  const dailyLimit = Number(
    process.env.IDENTITY_DAILY_LIMIT ?? 100,
  );

  const [recent, daily] = await Promise.all([
    admin
      .from("identity_verification_attempts")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("request_fingerprint", fingerprint)
      .gte("created_at", tenMinutesAgo),
    admin
      .from("identity_verification_attempts")
      .select("id", {
        count: "exact",
        head: true,
      })
      .gte("created_at", today),
  ]);

  if (
    (recent.count ?? 0) >= perTenMinutes ||
    (daily.count ?? 0) >= dailyLimit
  ) {
    return {
      allowed: false,
      fingerprint,
    };
  }

  return {
    allowed: true,
    fingerprint,
  };
}

async function recordAttempt(input: {
  documentType: IdentityDocumentType;
  requestFingerprint: string;
  providerStatus?: number;
  result: string;
}) {
  const admin = createAdminClient();

  await admin
    .from("identity_verification_attempts")
    .insert({
      document_type: input.documentType,
      request_fingerprint: input.requestFingerprint,
      provider: "serpro",
      provider_status: input.providerStatus ?? null,
      result: input.result,
    });
}

let serproTokenCache:
  | { token: string; expiresAt: number }
  | null = null;

async function getSerproToken() {
  if (
    serproTokenCache &&
    serproTokenCache.expiresAt >
      Date.now() + 60_000
  ) {
    return serproTokenCache.token;
  }

  const key = process.env.SERPRO_CONSUMER_KEY;
  const secret = process.env.SERPRO_CONSUMER_SECRET;

  if (!key || !secret) {
    throw new Error("SERPRO credentials are not configured.");
  }

  const auth = Buffer.from(`${key}:${secret}`).toString(
    "base64",
  );

  const response = await fetch(
    "https://gateway.apiserpro.serpro.gov.br/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `SERPRO token request failed (${response.status}).`,
    );
  }

  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!payload.access_token) {
    throw new Error("SERPRO token was not returned.");
  }

  const expiresIn = Math.max(
    60,
    Number(payload.expires_in ?? 3300),
  );

  serproTokenCache = {
    token: payload.access_token,
    expiresAt:
      Date.now() + expiresIn * 1000,
  };

  return payload.access_token;
}

function compactBirthDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "";
  }

  const [year, month, day] = value.split("-");
  return `${day}${month}${year}`;
}

async function verifyWithSerpro(input: {
  request: Request;
  documentType: IdentityDocumentType;
  document: string;
  birthDate?: string;
}): Promise<IdentityVerificationResult> {
  const template =
    input.documentType === "cpf"
      ? process.env.SERPRO_CPF_URL_TEMPLATE ??
        "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v3/cpf/{cpf}/{birthDateCompact}"
      : process.env.SERPRO_CNPJ_URL_TEMPLATE ??
        "https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/basica/{cnpj}";

  const budget = await checkRemoteBudget(input.request);

  if (!budget.allowed) {
    return {
      valid: true,
      officialVerified: false,
      provider: "serpro",
      status: "rate_limited",
    };
  }

  if (
    input.documentType === "cpf" &&
    !input.birthDate
  ) {
    return {
      valid: true,
      officialVerified: false,
      provider: "serpro",
      status: "official_not_verified",
    };
  }

  try {
    const token = await getSerproToken();

    const url = fillTemplate(template, {
      cpf: input.document,
      cnpj: input.document,
      birthDate: input.birthDate ?? "",
      birthDateCompact: compactBirthDate(
        input.birthDate,
      ),
      dataNascimento: input.birthDate ?? "",
    });

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    let payload: Record<string, unknown> | null = null;

    try {
      payload = (await response.json()) as Record<
        string,
        unknown
      >;
    } catch {
      payload = null;
    }

    const returnedDocument =
      typeof payload?.ni === "string"
        ? input.documentType === "cpf"
          ? onlyDigits(payload.ni)
          : normalizeCnpj(payload.ni)
        : "";

    const successfulStatus =
      response.status >= 200 &&
      response.status < 300;

    const verified =
      successfulStatus &&
      (!returnedDocument ||
        returnedDocument === input.document);

    await recordAttempt({
      documentType: input.documentType,
      requestFingerprint: budget.fingerprint,
      providerStatus: response.status,
      result: verified ? "verified" : "not_verified",
    });

    return {
      valid: true,
      officialVerified: verified,
      provider: "serpro",
      status: verified
        ? "official_verified"
        : "official_not_verified",
      providerStatus: response.status,
    };
  } catch {
    await recordAttempt({
      documentType: input.documentType,
      requestFingerprint: budget.fingerprint,
      result: "provider_error",
    });

    return {
      valid: true,
      officialVerified: false,
      provider: "serpro",
      status: "provider_unavailable",
    };
  }
}

export async function verifyIdentityDocument(input: {
  request: Request;
  documentType: IdentityDocumentType;
  document: string;
  birthDate?: string;
}): Promise<IdentityVerificationResult> {
  const document =
    input.documentType === "cpf"
      ? onlyDigits(input.document)
      : normalizeCnpj(input.document);

  const validStructure =
    input.documentType === "cpf"
      ? isValidCpf(document)
      : isValidCnpj(document);

  if (!validStructure) {
    return {
      valid: false,
      officialVerified: false,
      provider: "local",
      status: "invalid_structure",
    };
  }

  const provider =
    process.env.IDENTITY_PROVIDER?.toLowerCase();

  if (provider !== "serpro") {
    return {
      valid: true,
      officialVerified: false,
      provider: "local",
      status: "structure_valid",
    };
  }

  return verifyWithSerpro({
    ...input,
    document,
  });
}

export function officialVerificationRequired() {
  return (
    process.env.IDENTITY_PROVIDER?.toLowerCase() ===
      "serpro" &&
    process.env.IDENTITY_REQUIRE_OFFICIAL !== "false"
  );
}
