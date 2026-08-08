"use client";

import { useEffect, useMemo, useState } from "react";
import type { AppLocale } from "@/i18n/locales";

type RatesResponse = {
  base: "USD";
  fetchedAt: string | null;
  currencies: string[];
};

const FALLBACK = ["BRL", "EUR", "GBP", "USD"];

export function CurrencySelect({
  disabled,
  id,
  locale = "pt-BR",
  onChange,
  value,
}: {
  disabled?: boolean;
  id?: string;
  locale?: AppLocale;
  onChange: (value: string) => void;
  value: string;
}) {
  const [codes, setCodes] = useState<string[]>(FALLBACK);

  useEffect(() => {
    let active = true;

    fetch("/api/exchange-rates", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as RatesResponse;
      })
      .then((payload) => {
        if (!active || !payload?.currencies?.length) return;

        setCodes(
          Array.from(new Set([...payload.currencies, value]))
            .filter((code) => /^[A-Z]{3}$/.test(code))
            .sort(),
        );
      })
      .catch(() => {
        // Fallback currencies remain available when the cache is not ready.
      });

    return () => {
      active = false;
    };
  }, [value]);

  const displayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: "currency" });
    } catch {
      return null;
    }
  }, [locale]);

  const options = useMemo(
    () =>
      Array.from(new Set([...codes, value]))
        .filter(Boolean)
        .sort()
        .map((code) => {
          const name = displayNames?.of(code) ?? code;
          return {
            code,
            label: name && name !== code ? `${name} — ${code}` : code,
          };
        }),
    [codes, displayNames, value],
  );

  return (
    <select
      disabled={disabled}
      id={id}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    >
      {options.map((option) => (
        <option key={option.code} value={option.code}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
