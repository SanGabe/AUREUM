import { createHash, randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export const FINANCIAL_IMPORTS_BUCKET = "financial-imports";
export const MAX_FINANCIAL_IMPORT_BYTES = 20 * 1024 * 1024;
export const MAX_STAGED_ROWS = 5_000;

export type FinancialSourceType =
  | "csv"
  | "txt"
  | "pdf"
  | "ofx"
  | "xlsx"
  | "image"
  | "unknown";

export type FinancialImportChannel = "web" | "whatsapp" | "api";

type StagedFinancialRow = {
  row_index: number;
  occurred_on: string | null;
  description: string;
  amount: number | null;
  currency: string;
  proposed_type: "income" | "expense" | "transfer" | "refund" | "unknown";
  confidence: number;
  fingerprint: string;
  review_status: "pending" | "needs_review";
  raw_payload: Record<string, string>;
};

export class FinancialIngestionError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "FinancialIngestionError";
  }
}

export function sha256(value: Uint8Array | string) {
  return createHash("sha256").update(value).digest("hex");
}

export function safeFinancialFilename(value: string) {
  const cleaned = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 140);

  return cleaned || "documento-financeiro";
}

export function inferFinancialSource(filename: string, mimeType: string): FinancialSourceType {
  const extension = filename.toLowerCase().split(".").pop() ?? "";
  const mime = mimeType.toLowerCase();

  if (extension === "csv" || mime.includes("csv")) return "csv";
  if (extension === "txt" || mime === "text/plain") return "txt";
  if (extension === "pdf" || mime === "application/pdf") return "pdf";
  if (extension === "ofx" || mime.includes("ofx")) return "ofx";
  if (["xlsx", "xls"].includes(extension) || mime.includes("spreadsheet") || mime.includes("excel")) {
    return "xlsx";
  }
  if (["jpg", "jpeg", "png", "webp"].includes(extension) || mime.startsWith("image/")) {
    return "image";
  }
  return "unknown";
}

function splitDelimitedLine(line: string, delimiter: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === delimiter && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += character;
    }
  }

  values.push(current.trim());
  return values;
}

function normalizeHeader(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function detectDelimiter(line: string) {
  const candidates = [";", ",", "\t"];
  return candidates
    .map((delimiter) => ({ delimiter, count: splitDelimitedLine(line, delimiter).length }))
    .sort((left, right) => right.count - left.count)[0]?.delimiter ?? ";";
}

function findColumn(headers: string[], candidates: string[]) {
  return headers.findIndex((header) => candidates.includes(header));
}

function parseDate(value: string) {
  const input = value.trim();
  let match = input.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (match) {
    return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
  }

  match = input.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
  if (!match) return null;
  const year = match[3].length === 2 ? `20${match[3]}` : match[3];
  return `${year}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

function parseAmount(value: string) {
  const input = value.trim();
  if (!input) return null;
  const negative = /^-/.test(input) || /^\(.*\)$/.test(input);
  const cleaned = input.replace(/[^0-9,.-]/g, "").replace(/[()-]/g, "");
  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  let normalized = cleaned;

  if (lastComma > lastDot) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (lastDot > lastComma && lastComma >= 0) {
    normalized = cleaned.replace(/,/g, "");
  } else if (lastComma >= 0) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  }

  const number = Number(normalized);
  if (!Number.isFinite(number)) return null;
  return negative ? -Math.abs(number) : number;
}

function proposedType(value: string, amount: number | null) {
  const normalized = normalizeHeader(value);
  if (/transfer/.test(normalized)) return "transfer" as const;
  if (/estorno|refund|reembolso/.test(normalized)) return "refund" as const;
  if (/credito|credit|entrada|income|receita/.test(normalized)) return "income" as const;
  if (/debito|debit|saida|expense|despesa/.test(normalized)) return "expense" as const;
  if (amount === null) return "unknown" as const;
  return amount < 0 ? ("expense" as const) : ("income" as const);
}

export function parseDelimitedFinancialText(text: string, fallbackCurrency = "BRL") {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new FinancialIngestionError("empty_delimited_file", "O arquivo não contém linhas suficientes.");
  }

  const delimiter = detectDelimiter(lines[0]);
  const firstValues = splitDelimitedLine(lines[0], delimiter);
  const normalizedFirst = firstValues.map(normalizeHeader);
  const knownHeaders = [
    "data", "date", "descricao", "description", "historico", "valor", "amount",
    "tipo", "type", "moeda", "currency",
  ];
  const hasHeader = normalizedFirst.some((header) => knownHeaders.includes(header));
  const headers = hasHeader
    ? normalizedFirst
    : firstValues.map((_, index) => ["data", "descricao", "valor"][index] ?? `coluna_${index + 1}`);
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const dateIndex = findColumn(headers, ["data", "date", "data_transacao", "transaction_date", "data_lancamento"]);
  const descriptionIndex = findColumn(headers, [
    "descricao", "description", "historico", "estabelecimento", "merchant", "memo", "detalhes",
  ]);
  const amountIndex = findColumn(headers, ["valor", "amount", "valor_transacao", "transaction_amount"]);
  const debitIndex = findColumn(headers, ["debito", "debit"]);
  const creditIndex = findColumn(headers, ["credito", "credit"]);
  const currencyIndex = findColumn(headers, ["moeda", "currency"]);
  const typeIndex = findColumn(headers, ["tipo", "type", "natureza"]);

  if (descriptionIndex < 0 || (amountIndex < 0 && debitIndex < 0 && creditIndex < 0)) {
    throw new FinancialIngestionError(
      "unsupported_delimited_columns",
      "Não foi possível identificar as colunas de descrição e valor.",
    );
  }

  const rows: StagedFinancialRow[] = [];
  for (const [lineIndex, line] of dataLines.entries()) {
    if (rows.length >= MAX_STAGED_ROWS) {
      throw new FinancialIngestionError(
        "too_many_rows",
        `O arquivo excede o limite de ${MAX_STAGED_ROWS} lançamentos por importação.`,
      );
    }

    const values = splitDelimitedLine(line, delimiter);
    const rawPayload = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
    const description = (values[descriptionIndex] ?? "").trim();
    if (!description) continue;

    let amount = amountIndex >= 0 ? parseAmount(values[amountIndex] ?? "") : null;
    if (amount === null && debitIndex >= 0) {
      const debit = parseAmount(values[debitIndex] ?? "");
      if (debit !== null) amount = -Math.abs(debit);
    }
    if (amount === null && creditIndex >= 0) {
      const credit = parseAmount(values[creditIndex] ?? "");
      if (credit !== null) amount = Math.abs(credit);
    }

    const occurredOn = dateIndex >= 0 ? parseDate(values[dateIndex] ?? "") : null;
    const currency = (currencyIndex >= 0 ? values[currencyIndex] : fallbackCurrency)
      ?.trim()
      .toUpperCase();
    const validCurrency = /^[A-Z]{3}$/.test(currency) ? currency : fallbackCurrency;
    const type = proposedType(typeIndex >= 0 ? values[typeIndex] ?? "" : "", amount);
    const fingerprint = sha256(
      `${occurredOn ?? ""}|${description.toLowerCase().replace(/\s+/g, " ")}|${amount ?? ""}|${validCurrency}`,
    );

    rows.push({
      row_index: lineIndex,
      occurred_on: occurredOn,
      description,
      amount,
      currency: validCurrency,
      proposed_type: type,
      confidence: hasHeader && occurredOn && amount !== null ? 0.92 : 0.68,
      fingerprint,
      review_status: occurredOn && amount !== null ? "pending" : "needs_review",
      raw_payload: rawPayload,
    });
  }

  if (!rows.length) {
    throw new FinancialIngestionError("no_financial_rows", "Nenhum lançamento financeiro foi reconhecido.");
  }

  return rows;
}

type IngestFinancialFileInput = {
  supabase: SupabaseClient;
  userId: string;
  householdId: string;
  filename: string;
  mimeType: string;
  bytes: Uint8Array;
  channel: FinancialImportChannel;
  currency?: string;
  metadata?: Record<string, unknown>;
};

export async function ingestFinancialFile(input: IngestFinancialFileInput) {
  if (!input.bytes.byteLength) {
    throw new FinancialIngestionError("empty_file", "O arquivo está vazio.");
  }
  if (input.bytes.byteLength > MAX_FINANCIAL_IMPORT_BYTES) {
    throw new FinancialIngestionError("file_too_large", "O arquivo excede o limite de 20 MB.", 413);
  }

  const filename = safeFinancialFilename(input.filename);
  const sourceType = inferFinancialSource(filename, input.mimeType);
  if (sourceType === "unknown") {
    throw new FinancialIngestionError("unsupported_file", "Formato de arquivo não suportado.", 415);
  }

  const contentHash = sha256(input.bytes);
  const { data: duplicate, error: duplicateError } = await input.supabase
    .from("financial_imports")
    .select("id")
    .eq("household_id", input.householdId)
    .eq("created_by", input.userId)
    .eq("content_sha256", contentHash)
    .neq("status", "duplicate")
    .limit(1)
    .maybeSingle();

  if (duplicateError) {
    throw new FinancialIngestionError("duplicate_check_failed", duplicateError.message, 500);
  }

  const importId = randomUUID();
  const commonRecord = {
    id: importId,
    household_id: input.householdId,
    created_by: input.userId,
    channel: input.channel,
    source_type: sourceType,
    original_filename: filename,
    mime_type: input.mimeType || null,
    size_bytes: input.bytes.byteLength,
    content_sha256: contentHash,
    currency: (input.currency ?? "BRL").toUpperCase(),
    metadata: input.metadata ?? {},
  };

  if (duplicate) {
    const { error } = await input.supabase.from("financial_imports").insert({
      ...commonRecord,
      status: "duplicate",
      duplicate_of: duplicate.id,
      processed_at: new Date().toISOString(),
    });
    if (error) throw new FinancialIngestionError("duplicate_record_failed", error.message, 500);
    return { id: importId, status: "duplicate" as const, duplicateOf: duplicate.id, rowCount: 0 };
  }

  const storagePath = `${input.householdId}/${input.userId}/${importId}/${filename}`;
  const { error: createError } = await input.supabase.from("financial_imports").insert({
    ...commonRecord,
    status: "queued",
    storage_bucket: FINANCIAL_IMPORTS_BUCKET,
    storage_path: storagePath,
  });
  if (createError) throw new FinancialIngestionError("import_create_failed", createError.message, 500);

  const { error: uploadError } = await input.supabase.storage
    .from(FINANCIAL_IMPORTS_BUCKET)
    .upload(storagePath, input.bytes, {
      contentType: input.mimeType || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    await input.supabase.from("financial_imports").update({
      status: "failed",
      error_code: "storage_upload_failed",
      error_message: uploadError.message.slice(0, 500),
    }).eq("id", importId);
    throw new FinancialIngestionError("storage_upload_failed", uploadError.message, 500);
  }

  if (sourceType !== "csv" && sourceType !== "txt") {
    const { error } = await input.supabase.from("financial_imports").update({
      status: "awaiting_parser",
    }).eq("id", importId);
    if (error) throw new FinancialIngestionError("import_update_failed", error.message, 500);
    return { id: importId, status: "awaiting_parser" as const, duplicateOf: null, rowCount: 0 };
  }

  try {
    const rows = parseDelimitedFinancialText(new TextDecoder("utf-8").decode(input.bytes), input.currency);
    const { error: rowsError } = await input.supabase.from("financial_import_rows").insert(
      rows.map((row) => ({ ...row, import_id: importId })),
    );
    if (rowsError) throw new FinancialIngestionError("row_staging_failed", rowsError.message, 500);

    const { error: updateError } = await input.supabase.from("financial_imports").update({
      status: "ready_for_review",
      parser_key: "generic_delimited_v1",
      row_count: rows.length,
      processed_at: new Date().toISOString(),
    }).eq("id", importId);
    if (updateError) throw new FinancialIngestionError("import_update_failed", updateError.message, 500);

    return { id: importId, status: "ready_for_review" as const, duplicateOf: null, rowCount: rows.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido no parser.";
    await input.supabase.from("financial_imports").update({
      status: "failed",
      error_code: error instanceof FinancialIngestionError ? error.code : "parser_failed",
      error_message: message.slice(0, 500),
    }).eq("id", importId);
    throw error;
  }
}
