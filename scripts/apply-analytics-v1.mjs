import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function file(rel) {
  return path.join(ROOT, rel);
}

function read(rel) {
  return fs.readFileSync(file(rel), "utf8").replace(/\r\n/g, "\n");
}

function write(rel, content) {
  fs.writeFileSync(file(rel), content, "utf8");
}

function replaceOnce(content, oldText, newText, rel) {
  if (content.includes(newText)) return content;

  const index = content.indexOf(oldText);
  if (index < 0) {
    throw new Error(
      `Trecho não encontrado em ${rel}:\n\n${oldText}`,
    );
  }

  return (
    content.slice(0, index) +
    newText +
    content.slice(index + oldText.length)
  );
}

function update(rel, transform) {
  const before = read(rel);
  const after = transform(before);

  if (before === after) {
    console.log(`Sem alteração: ${rel}`);
    return;
  }

  write(rel, after);
  console.log(`OK: ${rel}`);
}

// ============================================================
// 1. Dashboard data
// ============================================================

update("src/lib/aureum/dashboard-data.ts", (input) => {
  let s = input;

  s = replaceOnce(
    s,
    `    fxResult,\n  ] = await Promise.all([`,
    `    fxResult,\n    analyticsResult,\n  ] = await Promise.all([`,
    "src/lib/aureum/dashboard-data.ts",
  );

  s = replaceOnce(
    s,
    `      .in("currency_code", ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "CNY"])\n      .order("currency_code"),\n  ]);`,
    `      .in("currency_code", ["USD", "EUR", "GBP", "ARS", "JPY", "CHF", "CAD", "CNY"])\n      .order("currency_code"),\n    supabase.rpc("aureum_dashboard_analytics", {\n      target_household: householdId,\n      target_month: bounds.date,\n      months_back: 24,\n    }),\n  ]);`,
    "src/lib/aureum/dashboard-data.ts",
  );

  s = replaceOnce(
    s,
    `  const fxFetchedAt =\n    (fxResult.data ?? [])\n      .map((row: any) => row.fetched_at as string | null)\n      .filter(Boolean)\n      .sort()\n      .at(-1) ?? null;\n\n  return {`,
    `  const fxFetchedAt =\n    (fxResult.data ?? [])\n      .map((row: any) => row.fetched_at as string | null)\n      .filter(Boolean)\n      .sort()\n      .at(-1) ?? null;\n\n  const analyticsRaw =\n    analyticsResult.data && typeof analyticsResult.data === "object"\n      ? (analyticsResult.data as Record<string, any>)\n      : null;\n\n  const analytics = analyticsRaw\n    ? {\n        currency: String(analyticsRaw.currency ?? currency),\n        trackedAssets: Number(analyticsRaw.tracked_assets ?? 0),\n        cashValue: Number(analyticsRaw.cash_value ?? 0),\n        investmentValue: Number(analyticsRaw.investment_value ?? 0),\n        income: Number(analyticsRaw.income ?? 0),\n        expenses: Number(analyticsRaw.expenses ?? 0),\n        savings: Number(analyticsRaw.savings ?? 0),\n        savingsRate: Number(analyticsRaw.savings_rate ?? 0),\n        monthly: (analyticsRaw.monthly ?? []).map((row: any) => ({\n          month: String(row.month),\n          income: Number(row.income ?? 0),\n          expenses: Number(row.expenses ?? 0),\n          cashFlow: Number(row.cash_flow ?? 0),\n          liquidBalance: Number(row.liquid_balance ?? 0),\n        })),\n        expenseCategories: (analyticsRaw.expense_categories ?? []).map(\n          (row: any) => ({\n            name: String(row.name ?? "Sem categoria"),\n            systemCode: row.system_code ? String(row.system_code) : null,\n            total: Number(row.total ?? 0),\n            percentage: Number(row.percentage ?? 0),\n          }),\n        ),\n        incomeCategories: (analyticsRaw.income_categories ?? []).map(\n          (row: any) => ({\n            name: String(row.name ?? "Sem categoria"),\n            systemCode: row.system_code ? String(row.system_code) : null,\n            total: Number(row.total ?? 0),\n            percentage: Number(row.percentage ?? 0),\n          }),\n        ),\n        accountTypes: (analyticsRaw.account_types ?? []).map((row: any) => ({\n          key: String(row.key ?? "other"),\n          value: Number(row.value ?? 0),\n        })),\n        investmentTypes: (analyticsRaw.investment_types ?? []).map(\n          (row: any) => ({\n            key: String(row.key ?? "other"),\n            value: Number(row.value ?? 0),\n          }),\n        ),\n      }\n    : null;\n\n  return {`,
    "src/lib/aureum/dashboard-data.ts",
  );

  s = replaceOnce(
    s,
    `    exchangeRates,\n    fxFetchedAt,\n  };`,
    `    exchangeRates,\n    fxFetchedAt,\n    analytics,\n  };`,
    "src/lib/aureum/dashboard-data.ts",
  );

  return s;
});

// ============================================================
// 2. Dashboard view
// ============================================================

update("src/components/dashboard-view.tsx", (input) => {
  let s = input;

  if (!s.includes("@/components/dashboard-analytics")) {
    s = replaceOnce(
      s,
      `import { MobileFinanceNav } from "@/components/mobile-finance-nav";`,
      `import { MobileFinanceNav } from "@/components/mobile-finance-nav";\nimport {\n  DashboardAnalytics,\n  type DashboardAnalyticsData,\n} from "@/components/dashboard-analytics";`,
      "src/components/dashboard-view.tsx",
    );
  }

  s = replaceOnce(
    s,
    `  fxFetchedAt?: string | null;\n};`,
    `  fxFetchedAt?: string | null;\n  analytics?: DashboardAnalyticsData | null;\n};`,
    "src/components/dashboard-view.tsx",
  );

  s = replaceOnce(
    s,
    `  exchangeRates: [],\n  fxFetchedAt: null,\n};`,
    `  exchangeRates: [],\n  fxFetchedAt: null,\n  analytics: {\n    currency: "USD",\n    trackedAssets: 32800,\n    cashValue: 20418.73,\n    investmentValue: 12381.27,\n    income: 4702,\n    expenses: 2596.44,\n    savings: 2105.56,\n    savingsRate: 44.78,\n    monthly: [\n      { month: "2026-01", income: 4100, expenses: 2900, cashFlow: 1200, liquidBalance: 9800 },\n      { month: "2026-02", income: 4300, expenses: 3100, cashFlow: 1200, liquidBalance: 11000 },\n      { month: "2026-03", income: 4200, expenses: 2700, cashFlow: 1500, liquidBalance: 12500 },\n      { month: "2026-04", income: 5900, expenses: 3300, cashFlow: 2600, liquidBalance: 15100 },\n      { month: "2026-05", income: 4400, expenses: 2850, cashFlow: 1550, liquidBalance: 16650 },\n      { month: "2026-06", income: 4500, expenses: 3100, cashFlow: 1400, liquidBalance: 18050 },\n      { month: "2026-07", income: 4600, expenses: 3250, cashFlow: 1350, liquidBalance: 19400 },\n      { month: "2026-08", income: 4702, expenses: 2596.44, cashFlow: 2105.56, liquidBalance: 20418.73 },\n    ],\n    expenseCategories: [\n      { name: "Moradia", systemCode: "housing", total: 1480, percentage: 57 },\n      { name: "Supermercado", systemCode: "groceries", total: 696, percentage: 27 },\n      { name: "Transporte", systemCode: "transport", total: 240, percentage: 9 },\n      { name: "Lazer", systemCode: "leisure", total: 180.44, percentage: 7 },\n    ],\n    incomeCategories: [\n      { name: "Salário", systemCode: "salary", total: 2702, percentage: 57 },\n      { name: "Vale Alimentação", systemCode: "food_allowance", total: 1000, percentage: 21 },\n      { name: "Vale Refeição", systemCode: "meal_allowance", total: 600, percentage: 13 },\n      { name: "Bônus / Premiação", systemCode: "bonus", total: 400, percentage: 9 },\n    ],\n    accountTypes: [\n      { key: "checking", value: 12800 },\n      { key: "savings", value: 5600 },\n      { key: "food_benefit", value: 1200 },\n      { key: "wallet", value: 818.73 },\n    ],\n    investmentTypes: [\n      { key: "stock", value: 6300 },\n      { key: "fixed_income", value: 4081.27 },\n      { key: "etf", value: 2000 },\n    ],\n  },\n};`,
    "src/components/dashboard-view.tsx",
  );

  s = replaceOnce(
    s,
    `  const d = demo
    ? {
        ...demoData,
        currency: locale === "en-GB" ? "GBP" : locale === "pt-BR" ? "BRL" : "USD",
      }
    : data!;`,
    `  const demoCurrency =
    locale === "en-GB"
      ? "GBP"
      : locale === "pt-BR"
        ? "BRL"
        : "USD";

  const d = demo
    ? {
        ...demoData,
        currency: demoCurrency,
        analytics: demoData.analytics
          ? {
              ...demoData.analytics,
              currency: demoCurrency,
            }
          : null,
      }
    : data!;`,
    "src/components/dashboard-view.tsx",
  );

  s = replaceOnce(
    s,
    `          <section className={styles.summary} id="resumo">
            <article><span>{text.balance}</span><strong>{money(d.consolidatedBalance,d.currency,locale)}</strong><small>{d.accountCount} {text.accountsMainCurrency}</small></article>
            <article><span>{text.income}</span><strong className={styles.positive}>{money(d.incomeMonth,d.currency,locale)}</strong><small>{text.confirmed}</small></article>
            <article><span>{text.expenses}</span><strong className={styles.negative}>{money(d.expensesMonth,d.currency,locale)}</strong><small>{text.officialOnly}</small></article>
            <article><span>{text.cardSpend}</span><strong>{money(d.cardSpendMonth,d.currency,locale)}</strong><small>{d.cardCount} {text.cardsRegistered}</small></article>
          </section>`,
    `          <section className={styles.summary} id="resumo">
            <article>
              <span>
                {d.analytics
                  ? locale === "pt-BR"
                    ? "Patrimônio acompanhado"
                    : "Tracked assets"
                  : text.balance}
              </span>
              <strong>
                {money(
                  d.analytics?.trackedAssets ?? d.consolidatedBalance,
                  d.currency,
                  locale,
                )}
              </strong>
              <small>
                {d.analytics
                  ? locale === "pt-BR"
                    ? "Contas + investimentos"
                    : "Accounts + investments"
                  : \`\${d.accountCount} \${text.accountsMainCurrency}\`}
              </small>
            </article>

            <article>
              <span>{text.income}</span>
              <strong className={styles.positive}>
                {money(d.incomeMonth,d.currency,locale)}
              </strong>
              <small>{text.confirmed}</small>
            </article>

            <article>
              <span>{text.expenses}</span>
              <strong className={styles.negative}>
                {money(d.expensesMonth,d.currency,locale)}
              </strong>
              <small>{text.officialOnly}</small>
            </article>

            <article>
              <span>
                {d.analytics
                  ? locale === "pt-BR"
                    ? "Economia do mês"
                    : "Monthly savings"
                  : text.cardSpend}
              </span>
              <strong
                className={
                  d.analytics
                    ? d.analytics.savings >= 0
                      ? styles.positive
                      : styles.negative
                    : ""
                }
              >
                {money(
                  d.analytics?.savings ?? d.cardSpendMonth,
                  d.currency,
                  locale,
                )}
              </strong>
              <small>
                {d.analytics
                  ? \`\${locale === "pt-BR" ? "Taxa de economia" : "Savings rate"}: \${d.analytics.savingsRate.toFixed(1)}%\`
                  : \`\${d.cardCount} \${text.cardsRegistered}\`}
              </small>
            </article>
          </section>`,
    "src/components/dashboard-view.tsx",
  );

  s = replaceOnce(
    s,
    `          {d.ignoredCurrencyAccounts > 0 ? (
            <p className={styles.currencyNote}>`,
    `          {d.analytics ? (
            <DashboardAnalytics
              data={d.analytics}
              locale={locale}
              showKpis={false}
            />
          ) : null}

          {d.ignoredCurrencyAccounts > 0 ? (
            <p className={styles.currencyNote}>`,
    "src/components/dashboard-view.tsx",
  );

  return s;
});

// ============================================================

// 3. Finance forms: user-facing labels + account types
// ============================================================

update("src/components/finance-forms.tsx", (input) => {
  let s = input;

  if (!s.includes("ACCOUNT_TYPE_OPTIONS")) {
    s = replaceOnce(
      s,
      `import { CurrencySelect } from "@/components/currency-select";`,
      `import { CurrencySelect } from "@/components/currency-select";\nimport { ACCOUNT_TYPE_OPTIONS } from "@/lib/aureum/financial-labels";`,
      "src/components/finance-forms.tsx",
    );
  }

  s = s.replace(
    `{locale === "pt-BR" ? "Ambos" : "Both"}`,
    `{locale === "pt-BR" ? "Receita e despesa" : "Income and expense"}`,
  );

  const oldAccountOptions = `            <select name="type">\n              <option value="checking">{locale === "pt-BR" ? "Conta corrente" : "Checking"}</option>\n              <option value="savings">{locale === "pt-BR" ? "Poupança" : "Savings"}</option>\n              <option value="cash">{locale === "pt-BR" ? "Dinheiro" : "Cash"}</option>\n              <option value="wallet">{locale === "pt-BR" ? "Carteira digital" : "Wallet"}</option>\n              <option value="investment">{locale === "pt-BR" ? "Conta de investimentos" : "Investment account"}</option>\n              <option value="other">{locale === "pt-BR" ? "Outra" : "Other"}</option>\n            </select>`;

  const newAccountOptions = `            <select name="type">\n              {ACCOUNT_TYPE_OPTIONS.map(([value, pt, en]) => (\n                <option key={value} value={value}>\n                  {locale === "pt-BR" ? pt : en}\n                </option>\n              ))}\n            </select>`;

  s = replaceOnce(
    s,
    oldAccountOptions,
    newAccountOptions,
    "src/components/finance-forms.tsx",
  );

  return s;
});

// ============================================================
// 4. Finance sections: translated kinds and system category codes
// ============================================================

update("src/components/finance-sections.tsx", (input) => {
  let s = input;

  if (!s.includes("categoryKindLabel")) {
    s = replaceOnce(
      s,
      `import styles from "./finance-page.module.css";`,
      `import {\n  accountTypeLabel,\n  categoryDisplayLabel,\n  categoryKindLabel,\n  investmentClassLabel,\n} from "@/lib/aureum/financial-labels";\nimport styles from "./finance-page.module.css";`,
      "src/components/finance-sections.tsx",
    );
  }

  s = s.replace(
    `"id, description, type, amount, currency, occurred_at, status, origin, reimbursable, categories(name), accounts(name), cards(name)"`,
    `"id, description, type, amount, currency, occurred_at, status, origin, reimbursable, categories(name,system_code), accounts(name), cards(name)"`,
  );

  s = s.replace(
    `.select("id, name")\n        .eq("household_id", context.nucleus.id)`,
    `.select("id, name, system_code")\n        .eq("household_id", context.nucleus.id)`,
  );

  s = s.replace(
    `.select("id, name, kind, icon, created_at")`,
    `.select("id, name, kind, icon, system_code, created_at")`,
  );

  s = s.replace(
    `categoryLabel(row.categories?.name, locale)`,
    `categoryDisplayLabel({\n                          name: row.categories?.name,\n                          systemCode: row.categories?.system_code,\n                        }, locale)`,
  );

  s = s.replace(
    `<strong>{categoryLabel(row.name, locale)}</strong>`,
    `<strong>{categoryDisplayLabel({ name: row.name, systemCode: row.system_code }, locale)}</strong>`,
  );

  s = s.replace(
    `<span className={styles.tag}>{row.kind}</span>`,
    `<span className={styles.tag}>{categoryKindLabel(row.kind, locale)}</span>`,
  );

  s = s.replace(
    `{ ...item, name: categoryLabel(item.name, locale) ?? item.name }`,
    `{ ...item, name: categoryDisplayLabel({ name: item.name, systemCode: item.system_code }, locale) }`,
  );

  s = s.replace(
    `.in("currency_code", ["USD", "EUR", "GBP", "JPY", "CNY", "CHF", "CAD"])
    .order("currency_code")`,
    `.not("rate_per_brl", "is", null)
    .order("currency_code")`,
  );

  s = s.replace(
    `<span className={styles.tag}>{row.type}</span>`,
    `<span className={styles.tag}>{accountTypeLabel(row.type, locale)}</span>`,
  );

  s = s.replace(
    `<span className={styles.tag}>{row.asset_class}</span>`,
    `<span className={styles.tag}>{investmentClassLabel(row.asset_class, locale)}</span>`,
  );

  return s;
});

console.log("");
console.log("AUREUM Analytics aplicado.");
console.log("Agora execute:");
console.log("  npm.cmd run typecheck");
console.log("  npm.cmd run build");
