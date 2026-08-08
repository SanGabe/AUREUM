import { notFound } from "next/navigation";
import { EnglishLanding } from "@/components/english-landing";
import { parseEnglishLocale } from "@/i18n/locales";

export default async function EnglishHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);

  if (!locale) notFound();

  return <EnglishLanding locale={locale} />;
}
