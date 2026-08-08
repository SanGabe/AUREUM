import type { DashboardData, DashboardTransaction } from "@/components/dashboard-view";
import { monthBounds } from "@/lib/aureum/finance-context";

export async function loadDashboardData({
  supabase,
  householdId,
  selectedMonth,
  currency,
}: {
  supabase: any;
  householdId: string;
  selectedMonth: string;
  currency: string;
}): Promise<DashboardData> {
  const bounds = monthBounds(selectedMonth);

  const [
    summaryResult,
    recentResult,
    categoryResult,
    goalResult,
    fxResult,
    analyticsResult,
  ] = await Promise.all([
    supabase.rpc("aureum_dashboard_summary_month", {
      target_household: householdId,
      target_month: bounds.date,
    }),
    supabase
      .from("transactions")
      .select(
        "id, description, type, amount, currency, occurred_at, categories(name), accounts(name), cards(name)",
      )
      .eq("household_id", householdId)
      .eq("status", "posted")
      .gte("occurred_at", bounds.start)
      .lt("occurred_at", bounds.end)
      .order("occurred_at", { ascending: false })
      .limit(12),
    supabase.rpc("aureum_dashboard_categories_month", {
      target_household: householdId,
      target_month: bounds.date,
    }),
    supabase
      .from("goals")
      .select("title, target_amount, current_amount")
      .eq("household_id", householdId)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("exchange_rates")
      .select("currency_code, rate_per_brl, fetched_at")
      .in("currency_code", ["USD", "EUR", "GBP", "ARS", "JPY", "CHF", "CAD", "CNY"])
      .order("currency_code"),
    supabase.rpc("aureum_dashboard_analytics", {
      target_household: householdId,
      target_month: bounds.date,
      months_back: 24,
    }),
  ]);

  const summary =
    summaryResult.data && typeof summaryResult.data === "object"
      ? (summaryResult.data as Record<string, unknown>)
      : {};

  const recent: DashboardTransaction[] = (recentResult.data ?? []).map(
    (row: any) => ({
      id: row.id,
      description: row.description,
      type: row.type,
      amount: Number(row.amount),
      currency: row.currency,
      occurredAt: row.occurred_at,
      categoryName: row.categories?.name ?? null,
      accountName: row.accounts?.name ?? null,
      cardName: row.cards?.name ?? null,
    }),
  );

  const categories = (categoryResult.data ?? []).map((row: any) => ({
    name: row.name ?? "Sem categoria",
    value: Number(row.total ?? 0),
    percent: Number(row.percentage ?? 0),
  }));

  const goalRow = goalResult.data;

  const exchangeRates = (fxResult.data ?? [])
    .filter((row: any) => Number(row.rate_per_brl) > 0)
    .map((row: any) => ({
      code: row.currency_code as string,
      ratePerBrl: Number(row.rate_per_brl),
    }));

  const fxFetchedAt =
    (fxResult.data ?? [])
      .map((row: any) => row.fetched_at as string | null)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;

  const analyticsRaw =
    analyticsResult.data && typeof analyticsResult.data === "object"
      ? (analyticsResult.data as Record<string, any>)
      : null;

  const analytics = analyticsRaw
    ? {
        currency: String(analyticsRaw.currency ?? currency),
        trackedAssets: Number(analyticsRaw.tracked_assets ?? 0),
        cashValue: Number(analyticsRaw.cash_value ?? 0),
        investmentValue: Number(analyticsRaw.investment_value ?? 0),
        income: Number(analyticsRaw.income ?? 0),
        expenses: Number(analyticsRaw.expenses ?? 0),
        savings: Number(analyticsRaw.savings ?? 0),
        savingsRate: Number(analyticsRaw.savings_rate ?? 0),
        monthly: (analyticsRaw.monthly ?? []).map((row: any) => ({
          month: String(row.month),
          income: Number(row.income ?? 0),
          expenses: Number(row.expenses ?? 0),
          cashFlow: Number(row.cash_flow ?? 0),
          liquidBalance: Number(row.liquid_balance ?? 0),
        })),
        expenseCategories: (analyticsRaw.expense_categories ?? []).map(
          (row: any) => ({
            name: String(row.name ?? "Sem categoria"),
            systemCode: row.system_code ? String(row.system_code) : null,
            total: Number(row.total ?? 0),
            percentage: Number(row.percentage ?? 0),
          }),
        ),
        incomeCategories: (analyticsRaw.income_categories ?? []).map(
          (row: any) => ({
            name: String(row.name ?? "Sem categoria"),
            systemCode: row.system_code ? String(row.system_code) : null,
            total: Number(row.total ?? 0),
            percentage: Number(row.percentage ?? 0),
          }),
        ),
        accountTypes: (analyticsRaw.account_types ?? []).map((row: any) => ({
          key: String(row.key ?? "other"),
          value: Number(row.value ?? 0),
        })),
        investmentTypes: (analyticsRaw.investment_types ?? []).map(
          (row: any) => ({
            key: String(row.key ?? "other"),
            value: Number(row.value ?? 0),
          }),
        ),
      }
    : null;

  return {
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
    exchangeRates,
    fxFetchedAt,
    analytics,
  };
}
