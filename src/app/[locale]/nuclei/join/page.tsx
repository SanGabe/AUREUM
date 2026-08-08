import { notFound } from "next/navigation";
import { JoinNucleusSection } from "@/components/finance-sections";
import { parseEnglishLocale } from "@/i18n/locales";
import { resolveFinanceContext } from "@/lib/aureum/finance-context";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    household?: string;
    month?: string;
  }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);
  if (!locale) notFound();

  const context = await resolveFinanceContext(
    locale,
    await searchParams,
  );

  return <JoinNucleusSection context={context} />;
}
