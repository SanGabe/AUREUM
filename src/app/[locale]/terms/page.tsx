import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/legal-document";
import { EnglishMarketingShell, EnglishPageHero } from "@/components/english-marketing-shell";
import { parseEnglishLocale } from "@/i18n/locales";

export const metadata = { title: "Terms of use" };
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = parseEnglishLocale((await params).locale); if (!locale) notFound();
  return <EnglishMarketingShell locale={locale}><EnglishPageHero eyebrow="TERMS" title="Clear rules for a trusted relationship." description="Conditions of use, responsibilities and limits of AUREUM." /><LegalDocument kind="terms" english /></EnglishMarketingShell>;
}
