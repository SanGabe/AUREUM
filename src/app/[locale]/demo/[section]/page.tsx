export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    section: string;
  }>;
}) {
  const { section } = await params;

  const titles: Record<string, string> = {
    transactions: "Demo — Transactions",
    categories: "Demo — Categories",
    goals: "Demo — Goals",
    accounts: "Demo — Accounts & Banks",
    investments: "Demo — Investments",
    "exchange-rates": "Demo — Exchange rates",
    approvals: "Demo — Approvals",
  };

  return {
    title: titles[section] ?? "Demo",
  };
}

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
