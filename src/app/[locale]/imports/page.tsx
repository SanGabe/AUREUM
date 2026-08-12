import { notFound } from "next/navigation";
import { ImportsSection } from "@/components/finance-sections";
import { parseEnglishLocale } from "@/i18n/locales";
import { resolveFinanceContext } from "@/lib/aureum/finance-context";
export const metadata = { title: "Imports" };
export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ household?: string; month?: string; import?: string }> }) { const locale = parseEnglishLocale((await params).locale); if (!locale) notFound(); const query = await searchParams; const context = await resolveFinanceContext(locale, query); return <ImportsSection context={context} selectedImportId={query.import} />; }
