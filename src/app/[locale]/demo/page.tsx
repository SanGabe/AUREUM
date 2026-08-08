export const metadata = { title: "Demo" };

import { notFound } from "next/navigation";
import { DemoDashboard } from "@/components/demo-finance";
import { parseEnglishLocale } from "@/i18n/locales";

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);

  if (!locale) notFound();

  return <DemoDashboard locale={locale} />;
}
