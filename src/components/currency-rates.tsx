import type { AppLocale } from "@/i18n/locales";
import {
  MAIN_CURRENCIES,
  currencyLabel,
} from "@/lib/aureum/currency-catalog";
import styles from "./currency-rates.module.css";

export type ExchangeRateRow = {
  code: string;
  ratePerBrl: number;
};

function number(
  value: number,
  locale: AppLocale,
  digits = 4,
) {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(value);
}

function priority(code: string) {
  const index = MAIN_CURRENCIES.findIndex(
    (currency) => currency.code === code,
  );
  return index >= 0 ? index : 999;
}

export function CurrencyRates({
  compact = false,
  fetchedAt,
  locale,
  rates,
}: {
  compact?: boolean;
  fetchedAt?: string | null;
  locale: AppLocale;
  rates: ExchangeRateRow[];
}) {
  const ordered = [...rates].sort((a, b) => {
    const byPriority =
      priority(a.code) - priority(b.code);
    if (byPriority !== 0) return byPriority;
    return a.code.localeCompare(b.code);
  });

  const rows = compact
    ? ordered.filter((row) =>
        ["USD", "EUR", "GBP", "ARS"].includes(row.code),
      ).slice(0, 4)
    : ordered;

  return (
    <div
      className={compact ? styles.compact : styles.full}
    >
      <div className={styles.rateList}>
        {rows.length ? (
          rows.map((row) => {
            const brlPerUnit =
              row.ratePerBrl > 0
                ? 1 / row.ratePerBrl
                : 0;

            return (
              <div
                className={styles.rateRow}
                key={row.code}
              >
                <div className={styles.currencyIdentity}>
                  <span>{row.code}</span>
                  <div>
                    <strong>
                      {currencyLabel(row.code, locale)}
                    </strong>
                    <small>
                      1 BRL ={" "}
                      {number(
                        row.ratePerBrl,
                        locale,
                        ["JPY", "ARS", "CLP", "COP"].includes(
                          row.code,
                        )
                          ? 2
                          : 4,
                      )}{" "}
                      {row.code}
                    </small>
                  </div>
                </div>

                <div className={styles.rateValue}>
                  <strong>
                    R${" "}
                    {number(
                      brlPerUnit,
                      locale,
                      ["JPY", "CLP", "COP"].includes(
                        row.code,
                      )
                        ? 6
                        : 4,
                    )}
                  </strong>
                  <small>
                    {locale === "pt-BR"
                      ? `por 1 ${row.code}`
                      : `per 1 ${row.code}`}
                  </small>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.empty}>
            {locale === "pt-BR"
              ? "As cotações ainda não foram sincronizadas."
              : "Exchange rates have not been synchronised yet."}
          </div>
        )}
      </div>

      {fetchedAt ? (
        <p className={styles.updated}>
          {locale === "pt-BR"
            ? "Cache atualizado em "
            : "Cache updated "}
          {new Intl.DateTimeFormat(locale, {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(fetchedAt))}
        </p>
      ) : null}
    </div>
  );
}
