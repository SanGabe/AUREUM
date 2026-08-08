import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { parseEnglishLocale } from "@/i18n/locales";

export default async function EnglishLocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);

  if (!locale) notFound();

  return <div lang={locale}>{children}</div>;
}
