import { notFound, redirect } from "next/navigation";
import {
  DashboardView,
  type DashboardData,
  type DashboardTransaction,
} from "@/components/dashboard-view";
import { createClient } from "@/lib/supabase/server";
import { getEnglishCopy } from "@/i18n/english-copy";
import { localePrefix, parseEnglishLocale } from "@/i18n/locales";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    household?: string;
    month?: string;
  }>;
};

type Membership = {
  household_id: string;
  role: string;
};

type Nucleus = {
  id: string;
  name: string;
  default_currency: string;
  type: string;
  country_code: string;
};

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function normaliseMonth(value?: string) {
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

export default async function Page({ params, searchParams }: Props) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);
  if (!locale) notFound();

  const t = getEnglishCopy(locale);
  const prefix = localePrefix(locale);
  const query = await searchParams;
  const selectedMonth = normaliseMonth(query.month);
  const bounds = monthBounds(selectedMonth);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`${prefix}/sign-in?next=${encodeURIComponent(`${prefix}/dashboard`)}`);

  const { data: membershipsRaw } = await supabase
    .from("household_members")
    .select("household_id, role")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true });

  const memberships = (membershipsRaw ?? []) as Membership[];
  if (!memberships.length) redirect(`${prefix}/onboarding`);

  const ids = memberships.map((membership) => membership.household_id);

  const { data: nucleusRows } = await supabase
    .from("households")
    .select("id, name, default_currency, type, country_code")
    .in("id", ids);

  const nuclei = (nucleusRows ?? []) as Nucleus[];
  if (!nuclei.length) redirect(`${prefix}/onboarding`);

  const selected =
    (query.household && ids.includes(query.household)
      ? nuclei.find((nucleus) => nucleus.id === query.household)
      : null) ?? nuclei[0];

  const membership = memberships.find(
    (item) => item.household_id === selected.id,
  )!;

  function roleLabel(role: string) {
    if (role === "owner") return t.common.owner;
    if (role === "admin") return t.common.administrator;
    if (role === "financial_contributor")
      return t.common.financialContributor;
    return t.common.member;
  }

  const currency = selected.default_currency || (locale === "en-GB" ? "GBP" : "USD");

  const { data: summaryRaw } = await supabase.rpc(
    "aureum_dashboard_summary_month",
    {
      target_household: selected.id,
      target_month: bounds.date,
    },
  );

  const summary =
    summaryRaw && typeof summaryRaw === "object"
      ? (summaryRaw as Record<string, unknown>)
      : {};

  const { data: recentRaw } = await supabase
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

  const { data: categoryRows } = await supabase.rpc(
    "aureum_dashboard_categories_month",
    {
      target_household: selected.id,
      target_month: bounds.date,
    },
  );

  const categories = (categoryRows ?? []).map((row: any) => ({
    name: row.name ?? "Uncategorised",
    value: Number(row.total ?? 0),
    percent: Number(row.percentage ?? 0),
  }));

  const { data: goalRow } = await supabase
    .from("goals")
    .select("title, target_amount, current_amount")
    .eq("household_id", selected.id)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const data: DashboardData = {
    currency,
    consolidatedBalance: Number(summary.consolidated_balance ?? 0),
    incomeMonth: Number(summary.income_month ?? 0),
    expensesMonth: Number(summary.expenses_month ?? 0),
    cardSpendMonth: Number(summary.card_spend_month ?? 0),
    accountCount: Number(summary.account_count ?? 0),
    cardCount: Number(summary.card_count ?? 0),
    ignoredCurrencyAccounts: Number(summary.ignored_currency_accounts ?? 0),
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
      : user.email?.split("@")[0] ?? "User";

  return (
    <DashboardView
      data={data}
      demo={false}
      householdId={selected.id}
      households={nuclei.map((nucleus) => ({
        id: nucleus.id,
        name: nucleus.name,
        roleLabel: roleLabel(
          memberships.find((item) => item.household_id === nucleus.id)?.role ??
            "viewer",
        ),
      }))}
      locale={locale}
      selectedMonth={selectedMonth}
      userEmail={user.email}
      userName={fullName}
      userSubtitle={`${selected.name} • ${roleLabel(membership.role)}`}
    />
  );
}
