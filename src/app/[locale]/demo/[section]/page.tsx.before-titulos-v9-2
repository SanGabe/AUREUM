import { notFound } from "next/navigation";
import { DemoFinanceSection } from "@/components/demo-finance";
import type { FinanceSection } from "@/components/finance-navigation";
import { parseEnglishLocale } from "@/i18n/locales";

const MAP: Record<
  string,
  Exclude<FinanceSection, "dashboard">
> = {
  transactions: "transactions",
  categories: "categories",
  goals: "goals",
  accounts: "accounts",
  investments: "investments",
  "exchange-rates": "exchange-rates",
  approvals: "approvals",
};

export default async function DemoSectionPage({
  params,
}: {
  params: Promise<{
    locale: string;
    section: string;
  }>;
}) {
  const {
    locale: segment,
    section: slug,
  } = await params;

  const locale = parseEnglishLocale(segment);
  const section = MAP[slug];

  if (!locale || !section) notFound();

  return (
    <DemoFinanceSection
      locale={locale}
      section={section}
    />
  );
}
