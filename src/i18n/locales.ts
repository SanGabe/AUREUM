export type EnglishLocale = "en-US" | "en-GB";
export type AppLocale = "pt-BR" | EnglishLocale;

export const ENGLISH_LOCALE_SEGMENTS = {
  "en-us": "en-US",
  "en-gb": "en-GB",
} as const;

export function parseEnglishLocale(
  value: string,
): EnglishLocale | null {
  return ENGLISH_LOCALE_SEGMENTS[
    value.toLowerCase() as keyof typeof ENGLISH_LOCALE_SEGMENTS
  ] ?? null;
}

export function localeSegment(locale: EnglishLocale) {
  return locale === "en-GB" ? "en-gb" : "en-us";
}

export function localePrefix(locale: EnglishLocale) {
  return `/${localeSegment(locale)}`;
}

export function localeDefaultCurrency(locale: AppLocale) {
  if (locale === "en-US") return "USD";
  if (locale === "en-GB") return "GBP";
  return "BRL";
}

export function localeDefaultCountry(locale: AppLocale) {
  if (locale === "en-US") return "US";
  if (locale === "en-GB") return "GB";
  return "BR";
}

export function englishSpelling(locale: EnglishLocale) {
  const gb = locale === "en-GB";

  return {
    organize: gb ? "organise" : "organize",
    organized: gb ? "organised" : "organized",
    organizing: gb ? "organising" : "organizing",
    organization: gb ? "organisation" : "organization",
    center: gb ? "centre" : "center",
    centralized: gb ? "centralised" : "centralized",
    personalized: gb ? "personalised" : "personalized",
    favorite: gb ? "favourite" : "favorite",
  };
}
