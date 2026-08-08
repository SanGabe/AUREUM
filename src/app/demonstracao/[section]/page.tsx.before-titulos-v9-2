import { notFound } from "next/navigation";
import { DemoFinanceSection } from "@/components/demo-finance";
import type { FinanceSection } from "@/components/finance-navigation";

const MAP: Record<
  string,
  Exclude<FinanceSection, "dashboard">
> = {
  transacoes: "transactions",
  categorias: "categories",
  metas: "goals",
  contas: "accounts",
  investimentos: "investments",
  cotacoes: "exchange-rates",
  aprovacoes: "approvals",
};

export default async function DemonstrationSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const section = MAP[slug];

  if (!section) notFound();

  return (
    <DemoFinanceSection
      locale="pt-BR"
      section={section}
    />
  );
}
