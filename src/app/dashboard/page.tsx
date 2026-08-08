import { DashboardView } from "@/components/dashboard-view";
import { resolveFinanceContext, roleLabel } from "@/lib/aureum/finance-context";
import { loadDashboardData } from "@/lib/aureum/dashboard-data";

export const metadata = { title: "Dashboard" };

type Props = {
  searchParams: Promise<{
    household?: string;
    month?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const context = await resolveFinanceContext(
    "pt-BR",
    await searchParams,
  );

  const data = await loadDashboardData({
    supabase: context.supabase,
    householdId: context.nucleus.id,
    selectedMonth: context.selectedMonth,
    currency: context.nucleus.default_currency || "BRL",
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
          "pt-BR",
        ),
      }))}
      locale="pt-BR"
      selectedMonth={context.selectedMonth}
      userEmail={context.user.email}
      userName={context.userName}
      userSubtitle={`${context.nucleus.name} • ${roleLabel(context.role, "pt-BR")}`}
    />
  );
}
