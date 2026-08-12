import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/legal-document";
import { EnglishMarketingShell, EnglishPageHero } from "@/components/english-marketing-shell";
import { parseEnglishLocale } from "@/i18n/locales";

export const metadata = { title: "Privacy" };
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = parseEnglishLocale((await params).locale); if (!locale) notFound();
  return <EnglishMarketingShell locale={locale}><EnglishPageHero eyebrow="PRIVACY" title="Financial data requires purpose, limits and transparency." description="How AUREUM considers data categories, purposes, safeguards and individual rights." /><LegalDocument kind="privacy" english /></EnglishMarketingShell>;
}
