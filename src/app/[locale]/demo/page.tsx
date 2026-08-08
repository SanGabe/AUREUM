import { notFound } from "next/navigation";
import { DashboardView } from "@/components/dashboard-view";
import { parseEnglishLocale } from "@/i18n/locales";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);
  if (!locale) notFound();

  return (
    <DashboardView
      demo
      locale={locale}
      userName="Visitor"
      userSubtitle="AUREUM demo"
    />
  );
}
