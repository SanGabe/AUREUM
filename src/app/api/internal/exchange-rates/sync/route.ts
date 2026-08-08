import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type FreeCurrencyResponse = {
  data?: Record<string, number>;
  meta?: {
    last_updated_at?: string;
  };
};

function authorised(request: Request) {
  const expected = process.env.FX_SYNC_SECRET;
  const received = request.headers.get("x-aureum-cron-secret");

  return Boolean(expected && received && expected === received);
}

export async function POST(request: Request) {
  if (!authorised(request)) {
    return NextResponse.json(
      { error: "unauthorised" },
      { status: 401 },
    );
  }

  const apiKey = process.env.FREECURRENCYAPI_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "FREECURRENCYAPI_KEY_missing" },
      { status: 500 },
    );
  }

  const supabase = createAdminClient();

  const { data: claim, error: claimError } =
    await supabase.rpc("claim_exchange_rate_sync");

  if (claimError) {
    return NextResponse.json(
      {
        error: "claim_failed",
        detail: claimError.message,
      },
      { status: 500 },
    );
  }

  if (!claim) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "hourly_or_daily_limit",
    });
  }

  try {
    /*
     * No `currencies=` filter on purpose:
     * the provider can return every currency available to the account
     * in this single hourly request.
     */
    const response = await fetch(
      "https://api.freecurrencyapi.com/v1/latest?base_currency=BRL",
      {
        headers: {
          Accept: "application/json",
          apikey: apiKey,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const text = await response.text();

      await supabase.rpc(
        "mark_exchange_rate_sync_failure",
        {
          error_message:
            `HTTP ${response.status}: ${text.slice(0, 400)}`,
        },
      );

      return NextResponse.json(
        {
          error: "provider_failed",
          status: response.status,
        },
        { status: 502 },
      );
    }

    const payload =
      (await response.json()) as FreeCurrencyResponse;

    const now = new Date().toISOString();
    const providerUpdatedAt =
      payload.meta?.last_updated_at ?? now;

    const ratesPerBrl: Record<string, number> = {
      BRL: 1,
      ...(payload.data ?? {}),
    };

    const usdPerBrl = Number(ratesPerBrl.USD);

    if (!Number.isFinite(usdPerBrl) || usdPerBrl <= 0) {
      await supabase.rpc(
        "mark_exchange_rate_sync_failure",
        {
          error_message:
            "Provider response did not contain a usable USD rate.",
        },
      );

      return NextResponse.json(
        { error: "missing_usd_cross_rate" },
        { status: 502 },
      );
    }

    const entries = Object.entries(ratesPerBrl).filter(
      ([code, rate]) =>
        /^[A-Z]{3}$/.test(code) &&
        Number.isFinite(Number(rate)) &&
        Number(rate) > 0,
    );

    if (!entries.length) {
      await supabase.rpc(
        "mark_exchange_rate_sync_failure",
        {
          error_message:
            "Provider returned no usable rates.",
        },
      );

      return NextResponse.json(
        { error: "empty_provider_response" },
        { status: 502 },
      );
    }

    /*
     * Keep rate_per_usd for backward compatibility while BRL becomes
     * the canonical cache base.
     *
     * Example:
     * 1 BRL = 0.18 USD
     * 1 BRL = 0.16 EUR
     * therefore 1 USD = 0.16 / 0.18 EUR.
     */
    const rows = entries.map(([code, rate]) => {
      const ratePerBrl = Number(rate);

      return {
        currency_code: code,
        base_currency: "BRL",
        rate_per_brl: ratePerBrl,
        rate_per_usd:
          code === "USD"
            ? 1
            : ratePerBrl / usdPerBrl,
        provider: "freecurrencyapi",
        provider_updated_at: providerUpdatedAt,
        fetched_at: now,
      };
    });

    const { error: upsertError } = await supabase
      .from("exchange_rates")
      .upsert(rows, {
        onConflict: "currency_code",
      });

    if (upsertError) {
      await supabase.rpc(
        "mark_exchange_rate_sync_failure",
        {
          error_message: upsertError.message,
        },
      );

      return NextResponse.json(
        {
          error: "cache_write_failed",
          detail: upsertError.message,
        },
        { status: 500 },
      );
    }

    await supabase.rpc(
      "mark_exchange_rate_sync_success",
      {
        provider_timestamp: providerUpdatedAt,
      },
    );

    return NextResponse.json({
      ok: true,
      skipped: false,
      base: "BRL",
      count: rows.length,
      currencies: rows.map((row) => row.currency_code),
      fetchedAt: now,
      providerUpdatedAt,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown sync error";

    await supabase.rpc(
      "mark_exchange_rate_sync_failure",
      {
        error_message: message.slice(0, 400),
      },
    );

    return NextResponse.json(
      { error: "sync_exception" },
      { status: 500 },
    );
  }
}
