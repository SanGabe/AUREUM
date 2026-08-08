import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exchange_rates")
    .select("currency_code, rate_per_usd, fetched_at, provider_updated_at")
    .order("currency_code");

  if (error) {
    return NextResponse.json(
      { error: "exchange_rates_unavailable" },
      { status: 503 },
    );
  }

  const rows = data ?? [];
  const rates: Record<string, number> = { USD: 1 };

  for (const row of rows) {
    rates[row.currency_code] = Number(row.rate_per_usd);
  }

  const fetchedAt =
    rows
      .map((row) => row.fetched_at)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;

  const providerUpdatedAt =
    rows
      .map((row) => row.provider_updated_at)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;

  return NextResponse.json(
    {
      provider: "freecurrencyapi",
      base: "USD",
      fetchedAt,
      providerUpdatedAt,
      currencies: Object.keys(rates).sort(),
      rates,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=900",
      },
    },
  );
}
