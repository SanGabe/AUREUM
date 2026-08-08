"use client";

import { useEffect, useMemo, useState } from "react";
import type { AppLocale } from "@/i18n/locales";
import {
  CURRENCY_CATALOG,
  MAIN_CURRENCIES,
  currencyLabel,
} from "@/lib/aureum/currency-catalog";

type RatesResponse = {
  base?: string;
  fetchedAt?: string | null;
  currencies?: string[];
};

const FALLBACK_LIVE = [
  "BRL",
  "USD",
  "EUR",
  "GBP",
  "CNY",
  "JPY",
  "CHF",
  "CAD",
];

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
  const [liveCodes, setLiveCodes] =
    useState<string[]>(FALLBACK_LIVE);

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

        setLiveCodes(
          Array.from(
            new Set([
              ...FALLBACK_LIVE,
              ...payload.currencies,
            ]),
          ).filter((code) => /^[A-Z]{3}$/.test(code)),
        );
      })
      .catch(() => {
        // The complete currency catalogue remains available.
      });

    return () => {
      active = false;
    };
  }, []);

  const main = useMemo(
    () =>
      MAIN_CURRENCIES.map((item) => ({
        code: item.code,
        label: `${currencyLabel(item.code, locale)} — ${item.code}`,
      })),
    [locale],
  );

  const others = useMemo(() => {
    const catalogueCodes = new Set(
      CURRENCY_CATALOG.map((currency) => currency.code),
    );

    const catalogue = CURRENCY_CATALOG.filter(
      (currency) => currency.region !== "main",
    ).map((item) => ({
      code: item.code,
      label: `${currencyLabel(item.code, locale)} — ${item.code}`,
    }));

    const providerExtras = liveCodes
      .filter((code) => !catalogueCodes.has(code))
      .sort()
      .map((code) => ({
        code,
        label: `${currencyLabel(code, locale)} — ${code}`,
      }));

    return [...catalogue, ...providerExtras];
  }, [liveCodes, locale]);

  const extra =
    value &&
    !CURRENCY_CATALOG.some(
      (currency) => currency.code === value,
    )
      ? {
          code: value,
          label: `${currencyLabel(value, locale)} — ${value}`,
        }
      : null;

  return (
    <select
      disabled={disabled}
      id={id}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    >
      <optgroup
        label={
          locale === "pt-BR"
            ? "Principais moedas"
            : "Major currencies"
        }
      >
        {main.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </optgroup>

      <optgroup
        label={
          locale === "pt-BR"
            ? "Outras moedas"
            : "Other currencies"
        }
      >
        {others.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
        {extra ? (
          <option value={extra.code}>{extra.label}</option>
        ) : null}
      </optgroup>
    </select>
  );
}
