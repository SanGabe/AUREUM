import type { AppLocale } from "@/i18n/locales";
import styles from "./currency-rates.module.css";

export type ExchangeRateRow = {
  code: string;
  ratePerBrl: number;
};

const LABELS: Record<string, { pt: string; en: string }> = {
  USD: { pt: "Dólar americano", en: "US Dollar" },
  EUR: { pt: "Euro", en: "Euro" },
  GBP: { pt: "Libra esterlina", en: "British Pound" },
  JPY: { pt: "Iene japonês", en: "Japanese Yen" },
  CNY: { pt: "Yuan chinês", en: "Chinese Yuan" },
  CHF: { pt: "Franco suíço", en: "Swiss Franc" },
  CAD: { pt: "Dólar canadense", en: "Canadian Dollar" },
};

function number(value: number, locale: AppLocale, digits = 4) {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(value);
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
  const rows = compact ? rates.slice(0, 4) : rates;

  return (
    <div className={compact ? styles.compact : styles.full}>
      <div className={styles.rateList}>
        {rows.length ? (
          rows.map((row) => {
            const brlPerUnit = row.ratePerBrl > 0 ? 1 / row.ratePerBrl : 0;
            const label =
              LABELS[row.code]?.[locale === "pt-BR" ? "pt" : "en"] ??
              row.code;

            return (
              <div className={styles.rateRow} key={row.code}>
                <div className={styles.currencyIdentity}>
                  <span>{row.code}</span>
                  <div>
                    <strong>{label}</strong>
                    <small>
                      1 BRL = {number(row.ratePerBrl, locale, row.code === "JPY" ? 2 : 4)} {row.code}
                    </small>
                  </div>
                </div>

                <div className={styles.rateValue}>
                  <strong>
                    R$ {number(brlPerUnit, locale, row.code === "JPY" ? 5 : 4)}
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
          {locale === "pt-BR" ? "Cache atualizado em " : "Cache updated "}
          {new Intl.DateTimeFormat(locale, {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(fetchedAt))}
        </p>
      ) : null}
    </div>
  );
}
