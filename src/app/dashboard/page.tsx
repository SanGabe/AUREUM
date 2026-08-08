import { redirect } from "next/navigation";
import {
  DashboardView,
  type DashboardData,
  type DashboardTransaction,
} from "@/components/dashboard-view";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

type Props = {
  searchParams: Promise<{
    household?: string;
    month?: string;
  }>;
};

type Membership = {
  household_id: string;
  role: string;
};

type Household = {
  id: string;
  name: string;
  default_currency: string;
  type: string;
  country_code: string;
};

function roleLabel(role: string) {
  if (role === "owner") return "Proprietário";
  if (role === "admin") return "Administrador";
  if (role === "financial_contributor") return "Colaborador Financeiro";
  return "Membro";
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function normalizeMonth(value?: string) {
  if (!value || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    return currentMonth();
  }

  const [year] = value.split("-").map(Number);
  if (year < 2000 || year > 2200) return currentMonth();

  return value;
}

function monthBounds(value: string) {
  const [year, month] = value.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  return {
    start: start.toISOString(),
    end: end.toISOString(),
    date: `${value}-01`,
  };
}

export default async function DashboardPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar?next=/dashboard");

  const params = await searchParams;
  const selectedMonth = normalizeMonth(params.month);
  const bounds = monthBounds(selectedMonth);

  const { data: membershipsRaw, error: membershipsError } = await supabase
    .from("household_members")
    .select("household_id, role")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true });

  if (membershipsError) console.error("Memberships:", membershipsError);

  const memberships = (membershipsRaw ?? []) as Membership[];
  if (!memberships.length) redirect("/onboarding");

  const ids = memberships.map((membership) => membership.household_id);

  const { data: householdRows, error: householdError } = await supabase
    .from("households")
    .select("id, name, default_currency, type, country_code")
    .in("id", ids);

  if (householdError) console.error("Núcleos:", householdError);

  const households = (householdRows ?? []) as Household[];
  if (!households.length) redirect("/onboarding");

  const selected =
    (params.household && ids.includes(params.household)
      ? households.find((household) => household.id === params.household)
      : null) ?? households[0];

  const membership = memberships.find(
    (item) => item.household_id === selected.id,
  )!;

  const currency = selected.default_currency || "BRL";

  const { data: summaryRaw, error: summaryError } = await supabase.rpc(
    "aureum_dashboard_summary_month",
    {
      target_household: selected.id,
      target_month: bounds.date,
    },
  );

  if (summaryError) console.error("Dashboard summary:", summaryError);

  const summary =
    summaryRaw && typeof summaryRaw === "object"
      ? (summaryRaw as Record<string, unknown>)
      : {};

  const { data: recentRaw, error: recentError } = await supabase
    .from("transactions")
    .select(
      "id, description, type, amount, currency, occurred_at, categories(name), accounts(name), cards(name)",
    )
    .eq("household_id", selected.id)
    .eq("status", "posted")
    .gte("occurred_at", bounds.start)
    .lt("occurred_at", bounds.end)
    .order("occurred_at", { ascending: false })
    .limit(12);

  if (recentError) console.error("Recent transactions:", recentError);

  const recent: DashboardTransaction[] = (recentRaw ?? []).map((row: any) => ({
    id: row.id,
    description: row.description,
    type: row.type,
    amount: Number(row.amount),
    currency: row.currency,
    occurredAt: row.occurred_at,
    categoryName: row.categories?.name ?? null,
    accountName: row.accounts?.name ?? null,
    cardName: row.cards?.name ?? null,
  }));

  const { data: categoryRows, error: categoryError } = await supabase.rpc(
    "aureum_dashboard_categories_month",
    {
      target_household: selected.id,
      target_month: bounds.date,
    },
  );

  if (categoryError) console.error("Dashboard categories:", categoryError);

  const categories = (categoryRows ?? []).map((row: any) => ({
    name: row.name ?? "Sem categoria",
    value: Number(row.total ?? 0),
    percent: Number(row.percentage ?? 0),
  }));

  const { data: goalRow, error: goalError } = await supabase
    .from("goals")
    .select("title, target_amount, current_amount")
    .eq("household_id", selected.id)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (goalError) console.error("Goal:", goalError);

  const data: DashboardData = {
    currency,
    consolidatedBalance: Number(summary.consolidated_balance ?? 0),
    incomeMonth: Number(summary.income_month ?? 0),
    expensesMonth: Number(summary.expenses_month ?? 0),
    cardSpendMonth: Number(summary.card_spend_month ?? 0),
    accountCount: Number(summary.account_count ?? 0),
    cardCount: Number(summary.card_count ?? 0),
    ignoredCurrencyAccounts: Number(
      summary.ignored_currency_accounts ?? 0,
    ),
    transactions: recent,
    categories,
    goal: goalRow
      ? {
          title: goalRow.title,
          currentAmount: Number(goalRow.current_amount),
          targetAmount: Number(goalRow.target_amount),
        }
      : null,
  };

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : user.email?.split("@")[0] ?? "Usuário";

  return (
    <DashboardView
      data={data}
      demo={false}
      householdId={selected.id}
      households={households.map((household) => ({
        id: household.id,
        name: household.name,
        roleLabel: roleLabel(
          memberships.find((item) => item.household_id === household.id)?.role ??
            "viewer",
        ),
      }))}
      selectedMonth={selectedMonth}
      userEmail={user.email}
      userName={fullName}
      userSubtitle={`${selected.name} • ${roleLabel(membership.role)}`}
    />
  );
}
