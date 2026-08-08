import { AccountsSection } from "@/components/finance-sections";
import { resolveFinanceContext } from "@/lib/aureum/finance-context";

export const metadata = { title: "Contas & Bancos" };

type Props = {
  searchParams: Promise<{
    household?: string;
    month?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const context = await resolveFinanceContext(
    "pt-BR",
    await searchParams,
  );

  return <AccountsSection context={context} />;
}
