export const metadata = { title: "Dashboard" };

import { notFound } from "next/navigation";
import { DashboardView } from "@/components/dashboard-view";
import { parseEnglishLocale } from "@/i18n/locales";
import { resolveFinanceContext, roleLabel } from "@/lib/aureum/finance-context";
import { loadDashboardData } from "@/lib/aureum/dashboard-data";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    household?: string;
    month?: string;
  }>;
};

export default async function DashboardPage({
  params,
  searchParams,
}: Props) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);
  if (!locale) notFound();

  const context = await resolveFinanceContext(
    locale,
    await searchParams,
  );

  const data = await loadDashboardData({
    supabase: context.supabase,
    householdId: context.nucleus.id,
    selectedMonth: context.selectedMonth,
    currency:
      context.nucleus.default_currency ||
      (locale === "en-GB" ? "GBP" : "USD"),
  });

  return (
    <DashboardView
      data={data}
      demo={false}
      householdId={context.nucleus.id}
      households={context.nuclei.map((nucleus) => ({
        id: nucleus.id,
        name: nucleus.name,
        roleLabel: roleLabel(
          context.memberships.find(
            (item) => item.household_id === nucleus.id,
          )?.role ?? "viewer",
          locale,
        ),
      }))}
      locale={locale}
      selectedMonth={context.selectedMonth}
      userEmail={context.user.email}
      userName={context.userName}
      userSubtitle={`${context.nucleus.name} • ${roleLabel(context.role, locale)}`}
    />
  );
}
