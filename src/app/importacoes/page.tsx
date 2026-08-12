import { ImportsSection } from "@/components/finance-sections";
import { resolveFinanceContext } from "@/lib/aureum/finance-context";
export const metadata = { title: "Importações" };
export default async function Page({ searchParams }: { searchParams: Promise<{ household?: string; month?: string; import?: string }> }) { const query = await searchParams; const context = await resolveFinanceContext("pt-BR", query); return <ImportsSection context={context} selectedImportId={query.import} />; }
