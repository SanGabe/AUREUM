import type { AppLocale } from "@/i18n/locales";

export type CurrencyDefinition = {
  code: string;
  region: "main" | "americas" | "europe" | "asia" | "middle-east-africa";
  pt: string;
  en: string;
};

export const CURRENCY_CATALOG: CurrencyDefinition[] = [
  { code: "BRL", region: "main", pt: "Real brasileiro", en: "Brazilian Real" },
  { code: "USD", region: "main", pt: "Dólar americano", en: "US Dollar" },
  { code: "EUR", region: "main", pt: "Euro", en: "Euro" },
  { code: "GBP", region: "main", pt: "Libra esterlina", en: "British Pound" },
  { code: "ARS", region: "main", pt: "Peso argentino", en: "Argentine Peso" },
  { code: "CNY", region: "main", pt: "Yuan chinês", en: "Chinese Yuan" },
  { code: "JPY", region: "main", pt: "Iene japonês", en: "Japanese Yen" },
  { code: "CHF", region: "main", pt: "Franco suíço", en: "Swiss Franc" },
  { code: "CAD", region: "main", pt: "Dólar canadense", en: "Canadian Dollar" },

  { code: "MXN", region: "americas", pt: "Peso mexicano", en: "Mexican Peso" },
  { code: "CLP", region: "americas", pt: "Peso chileno", en: "Chilean Peso" },
  { code: "COP", region: "americas", pt: "Peso colombiano", en: "Colombian Peso" },
  { code: "UYU", region: "americas", pt: "Peso uruguaio", en: "Uruguayan Peso" },
  { code: "PEN", region: "americas", pt: "Sol peruano", en: "Peruvian Sol" },

  { code: "SEK", region: "europe", pt: "Coroa sueca", en: "Swedish Krona" },
  { code: "NOK", region: "europe", pt: "Coroa norueguesa", en: "Norwegian Krone" },
  { code: "DKK", region: "europe", pt: "Coroa dinamarquesa", en: "Danish Krone" },
  { code: "PLN", region: "europe", pt: "Zlóti polonês", en: "Polish Zloty" },
  { code: "CZK", region: "europe", pt: "Coroa tcheca", en: "Czech Koruna" },
  { code: "HUF", region: "europe", pt: "Forint húngaro", en: "Hungarian Forint" },
  { code: "RON", region: "europe", pt: "Leu romeno", en: "Romanian Leu" },
  { code: "TRY", region: "europe", pt: "Lira turca", en: "Turkish Lira" },

  { code: "AUD", region: "asia", pt: "Dólar australiano", en: "Australian Dollar" },
  { code: "NZD", region: "asia", pt: "Dólar neozelandês", en: "New Zealand Dollar" },
  { code: "KRW", region: "asia", pt: "Won sul-coreano", en: "South Korean Won" },
  { code: "INR", region: "asia", pt: "Rúpia indiana", en: "Indian Rupee" },
  { code: "SGD", region: "asia", pt: "Dólar de Singapura", en: "Singapore Dollar" },
  { code: "HKD", region: "asia", pt: "Dólar de Hong Kong", en: "Hong Kong Dollar" },
  { code: "THB", region: "asia", pt: "Baht tailandês", en: "Thai Baht" },
  { code: "MYR", region: "asia", pt: "Ringgit malaio", en: "Malaysian Ringgit" },
  { code: "IDR", region: "asia", pt: "Rupia indonésia", en: "Indonesian Rupiah" },
  { code: "PHP", region: "asia", pt: "Peso filipino", en: "Philippine Peso" },

  { code: "AED", region: "middle-east-africa", pt: "Dirham dos Emirados", en: "UAE Dirham" },
  { code: "SAR", region: "middle-east-africa", pt: "Rial saudita", en: "Saudi Riyal" },
  { code: "ILS", region: "middle-east-africa", pt: "Novo shekel israelense", en: "Israeli New Shekel" },
  { code: "ZAR", region: "middle-east-africa", pt: "Rand sul-africano", en: "South African Rand" },
];

export const MAIN_CURRENCIES = CURRENCY_CATALOG.filter(
  (currency) => currency.region === "main",
);

export function currencyLabel(code: string, locale: AppLocale) {
  const item = CURRENCY_CATALOG.find(
    (currency) => currency.code === code.toUpperCase(),
  );

  if (item) {
    return locale === "pt-BR" ? item.pt : item.en;
  }

  try {
    const names = new Intl.DisplayNames([locale], {
      type: "currency",
    });
    return names.of(code.toUpperCase()) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}
