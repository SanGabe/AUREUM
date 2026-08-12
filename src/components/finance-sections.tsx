import Link from "next/link";
import { FinanceShell } from "@/components/finance-shell";
import {
  AccountForm,
  CardForm,
  CategoryForm,
  GoalForm,
  InvestmentForm,
  TransactionForm,
} from "@/components/finance-forms";
import { CurrencyRates } from "@/components/currency-rates";
import { NucleusJoinForm } from "@/components/nucleus-join-form";
import { ApprovalActions } from "@/components/approval-actions";
import { FinancialImportWorkspace } from "@/components/financial-import-workspace";
import type { FinanceContext } from "@/lib/aureum/finance-context";
import {
  isManager,
  monthBounds,
  roleLabel,
} from "@/lib/aureum/finance-context";
import {
  accountTypeLabel,
  categoryDisplayLabel,
  categoryKindLabel,
  investmentClassLabel,
} from "@/lib/aureum/financial-labels";
import styles from "./finance-page.module.css";

function money(value: number, currency: string, locale: FinanceContext["locale"]) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function date(value: string | null | undefined, locale: FinanceContext["locale"]) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(value));
}

function dateTime(value: string | null | undefined, locale: FinanceContext["locale"]) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}


function categoryLabel(name: string | null | undefined, locale: FinanceContext["locale"]) {
  if (!name || locale === "pt-BR") return name ?? null;
  const map: Record<string, string> = {
    "Moradia": "Housing",
    "Alimentação": "Groceries",
    "Transporte": "Transport",
    "Saúde": "Health",
    "Educação": "Education",
    "Lazer": "Leisure",
    "Assinaturas": "Subscriptions",
    "Viagens": "Travel",
    "Compras": "Shopping",
    "Salário": "Salary",
    "Rendimentos": "Earnings",
    "Outros": "Other",
    "Sem categoria": "Uncategorised",
  };
  return map[name] ?? name;
}

function kindLabel(kind: string | null | undefined, locale: FinanceContext["locale"]) {
  const pt = { income: "Receita", expense: "Despesa", both: "Ambos" } as const;
  const en = { income: "Income", expense: "Expense", both: "Both" } as const;
  const key = (kind ?? "") as keyof typeof pt;
  return locale === "pt-BR" ? (pt[key] ?? kind ?? "—") : (en[key] ?? kind ?? "—");
}

function empty(locale: FinanceContext["locale"], pt: string, en: string) {
  return <div className={styles.empty}>{locale === "pt-BR" ? pt : en}</div>;
}

export async function ImportsSection({ context, selectedImportId }: { context: FinanceContext; selectedImportId?: string }) {
  const locale = context.locale;
  const importsResult = await context.supabase.from("financial_imports").select("id, original_filename, channel, source_type, status, row_count, received_at, error_message").eq("household_id", context.nucleus.id).order("received_at", { ascending: false }).limit(30);
  const imports = importsResult.data ?? [];
  const currentId = selectedImportId && imports.some((item: any) => item.id === selectedImportId) ? selectedImportId : imports.find((item: any) => item.status === "ready_for_review")?.id ?? imports[0]?.id;
  const [rowsResult, accountsResult, categoriesResult, cardsResult] = await Promise.all([
    currentId ? context.supabase.from("financial_import_rows").select("id, occurred_on, description, amount, currency, proposed_type, review_status, official_transaction_id").eq("import_id", currentId).order("row_index") : Promise.resolve({ data: [] }),
    context.supabase.from("accounts").select("id,name").eq("household_id", context.nucleus.id).eq("is_active", true).order("name"),
    context.supabase.from("categories").select("id,name").eq("household_id", context.nucleus.id).order("name"),
    context.supabase.from("cards").select("id,name").eq("household_id", context.nucleus.id).order("name"),
  ]);
  const basePath = locale === "pt-BR" ? "/importacoes" : `/${locale.toLowerCase()}/imports`;
  return <FinanceShell active="imports" context={context} eyebrow={locale === "pt-BR" ? "INGESTÃO" : "INGESTION"} title={locale === "pt-BR" ? "Extratos e faturas" : "Statements and bills"} description={locale === "pt-BR" ? "Envie documentos, confira cada linha e aprove somente o que deve entrar no histórico oficial." : "Upload documents, review every row and approve only what belongs in the official history."}>
    <div className={styles.grid2} style={{ marginBottom: 14 }}><div className={styles.card}><h2>{locale === "pt-BR" ? "Importações" : "Imports"}</h2>{imports.length ? <div style={{ display: "grid", gap: 8 }}>{imports.map((item: any) => <Link href={`${basePath}?household=${context.nucleus.id}&month=${context.selectedMonth}&import=${item.id}`} key={item.id} style={{ padding: 10, border: "1px solid var(--a-border-soft)", borderRadius: 8 }}><strong>{item.original_filename}</strong><div style={{ color: "var(--a-muted)", fontSize: 10 }}>{item.source_type} · {item.status} · {item.row_count}</div></Link>)}</div> : empty(locale, "Nenhum arquivo enviado.", "No files uploaded.")}</div><div className={styles.notice}>{locale === "pt-BR" ? "A aprovação cria a transação uma única vez. Arquivos não suportados permanecem privados aguardando parser." : "Approval creates the transaction once. Unsupported files remain private while awaiting a parser."}</div></div>
    <FinancialImportWorkspace householdId={context.nucleus.id} locale={locale} selectedImportId={currentId} rows={(rowsResult.data ?? []) as any} accounts={(accountsResult.data ?? []) as any} categories={(categoriesResult.data ?? []) as any} cards={(cardsResult.data ?? []) as any} />
  </FinanceShell>;
}

export async function TransactionsSection({
  context,
}: {
  context: FinanceContext;
}) {
  const bounds = monthBounds(context.selectedMonth);

  const [transactionsResult, categoriesResult, accountsResult, cardsResult] =
    await Promise.all([
      context.supabase
        .from("transactions")
        .select(
          "id, description, type, amount, currency, occurred_at, status, origin, reimbursable, categories(name,system_code), accounts(name), cards(name)",
        )
        .eq("household_id", context.nucleus.id)
        .gte("occurred_at", bounds.start)
        .lt("occurred_at", bounds.end)
        .order("occurred_at", { ascending: false })
        .limit(200),
      context.supabase
        .from("categories")
        .select("id, name, system_code")
        .eq("household_id", context.nucleus.id)
        .order("name"),
      context.supabase
        .from("accounts")
        .select("id, name")
        .eq("household_id", context.nucleus.id)
        .eq("is_active", true)
        .order("name"),
      context.supabase
        .from("cards")
        .select("id, name")
        .eq("household_id", context.nucleus.id)
        .eq("is_active", true)
        .order("name"),
    ]);

  const rows = transactionsResult.data ?? [];
  const locale = context.locale;

  return (
    <FinanceShell
      active="transactions"
      context={context}
      description={
        locale === "pt-BR"
          ? "Consulte o histórico do período e registre receitas, despesas e transferências."
          : "Review the selected period and record income, expenses and transfers."
      }
      eyebrow={locale === "pt-BR" ? "MOVIMENTAÇÃO" : "ACTIVITY"}
      showMonth
      title={locale === "pt-BR" ? "Transações" : "Transactions"}
    >
      <div className={styles.grid2}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>
              {locale === "pt-BR"
                ? "Lançamentos do período"
                : "Entries for the period"}
            </h2>
          </div>

          {rows.length ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{locale === "pt-BR" ? "Data" : "Date"}</th>
                  <th>{locale === "pt-BR" ? "Descrição" : "Description"}</th>
                  <th>{locale === "pt-BR" ? "Contexto" : "Context"}</th>
                  <th>{locale === "pt-BR" ? "Origem" : "Source"}</th>
                  <th>{locale === "pt-BR" ? "Valor" : "Amount"}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row: any) => (
                  <tr key={row.id}>
                    <td>{date(row.occurred_at, locale)}</td>
                    <td>
                      <strong>{row.description}</strong>
                      {row.reimbursable ? (
                        <div className={styles.tag}>
                          {locale === "pt-BR" ? "Reembolsável" : "Reimbursable"}
                        </div>
                      ) : null}
                    </td>
                    <td>
                      {[
                        categoryDisplayLabel({
                          name: row.categories?.name,
                          systemCode: row.categories?.system_code,
                        }, locale),
                        row.accounts?.name,
                        row.cards?.name,
                      ]
                        .filter(Boolean)
                        .join(" • ") || "—"}
                    </td>
                    <td>{row.origin}</td>
                    <td
                      className={
                        row.type === "income"
                          ? styles.positive
                          : row.type === "expense"
                            ? styles.negative
                            : styles.gold
                      }
                    >
                      {row.type === "income"
                        ? "+"
                        : row.type === "expense"
                          ? "−"
                          : "↔"}{" "}
                      {money(Number(row.amount), row.currency, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            empty(
              locale,
              "Nenhuma transação neste período.",
              "No transactions in this period.",
            )
          )}
        </div>

        <TransactionForm
          accounts={(accountsResult.data ?? []) as any}
          cards={(cardsResult.data ?? []) as any}
          categories={(categoriesResult.data ?? []).map((item: any) => ({ ...item, name: categoryDisplayLabel({ name: item.name, systemCode: item.system_code }, locale) })) as any}
          currency={context.nucleus.default_currency}
          householdId={context.nucleus.id}
          locale={locale}
          role={context.role}
          userId={context.user.id}
        />
      </div>
    </FinanceShell>
  );
}

export async function CategoriesSection({
  context,
}: {
  context: FinanceContext;
}) {
  const locale = context.locale;
  const bounds = monthBounds(context.selectedMonth);

  const [categoriesResult, monthlyResult] = await Promise.all([
    context.supabase
      .from("categories")
      .select("id, name, kind, icon, system_code, created_at")
      .eq("household_id", context.nucleus.id)
      .order("name"),
    context.supabase.rpc("aureum_dashboard_categories_month", {
      target_household: context.nucleus.id,
      target_month: bounds.date,
    }),
  ]);

  const monthly = new Map<string, any>(
    (monthlyResult.data ?? []).map((row: any) => [row.name, row] as [string, any]),
  );

  const rows = categoriesResult.data ?? [];

  return (
    <FinanceShell
      active="categories"
      context={context}
      description={
        locale === "pt-BR"
          ? "Organize receitas e despesas com categorias próprias do Núcleo."
          : "Organise income and expenses using categories owned by this Nucleus."
      }
      eyebrow={locale === "pt-BR" ? "ORGANIZAÇÃO" : "ORGANISATION"}
      showMonth
      title={locale === "pt-BR" ? "Categorias" : "Categories"}
    >
      <div className={styles.grid2}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>
              {locale === "pt-BR" ? "Categorias do Núcleo" : "Nucleus categories"}
            </h2>
          </div>

          {rows.length ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{locale === "pt-BR" ? "Categoria" : "Category"}</th>
                  <th>{locale === "pt-BR" ? "Tipo" : "Type"}</th>
                  <th>{locale === "pt-BR" ? "No período" : "In period"}</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row: any) => {
                  const month = monthly.get(row.name);
                  return (
                    <tr key={row.id}>
                      <td><strong>{categoryDisplayLabel({ name: row.name, systemCode: row.system_code }, locale)}</strong></td>
                      <td><span className={styles.tag}>{categoryKindLabel(row.kind, locale)}</span></td>
                      <td>
                        {money(
                          Number(month?.total ?? 0),
                          context.nucleus.default_currency,
                          locale,
                        )}
                      </td>
                      <td>{Number(month?.percentage ?? 0).toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            empty(locale, "Nenhuma categoria.", "No categories.")
          )}
        </div>

        <CategoryForm
          categories={(rows ?? []).map((row: any) => ({
            id: row.id,
            name: row.name,
            kind: row.kind,
          })) as any}
          householdId={context.nucleus.id}
          locale={locale}
          role={context.role}
        />
      </div>
    </FinanceShell>
  );
}

export async function GoalsSection({
  context,
}: {
  context: FinanceContext;
}) {
  const locale = context.locale;

  const { data: rows } = await context.supabase
    .from("goals")
    .select(
      "id, title, target_amount, current_amount, currency, target_date, status, created_at",
    )
    .eq("household_id", context.nucleus.id)
    .order("created_at", { ascending: false });

  return (
    <FinanceShell
      active="goals"
      context={context}
      description={
        locale === "pt-BR"
          ? "Transforme objetivos em valores, prazos e progresso mensurável."
          : "Turn objectives into amounts, deadlines and measurable progress."
      }
      eyebrow={locale === "pt-BR" ? "PROGRESSUS" : "PROGRESSUS"}
      title={locale === "pt-BR" ? "Metas" : "Goals"}
    >
      <div className={styles.grid2}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>{locale === "pt-BR" ? "Objetivos" : "Objectives"}</h2>
          </div>

          {(rows ?? []).length ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{locale === "pt-BR" ? "Meta" : "Goal"}</th>
                  <th>{locale === "pt-BR" ? "Progresso" : "Progress"}</th>
                  <th>{locale === "pt-BR" ? "Prazo" : "Deadline"}</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(rows ?? []).map((row: any) => {
                  const pct =
                    Number(row.target_amount) > 0
                      ? Math.min(
                          100,
                          (Number(row.current_amount) /
                            Number(row.target_amount)) *
                            100,
                        )
                      : 0;

                  return (
                    <tr key={row.id}>
                      <td><strong>{row.title}</strong></td>
                      <td>
                        {money(Number(row.current_amount), row.currency, locale)}
                        {" / "}
                        {money(Number(row.target_amount), row.currency, locale)}
                        <div>{pct.toFixed(0)}%</div>
                      </td>
                      <td>{row.target_date ? date(row.target_date, locale) : "—"}</td>
                      <td><span className={styles.tag}>{row.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            empty(locale, "Nenhuma meta cadastrada.", "No goals created.")
          )}
        </div>

        <GoalForm
          currency={context.nucleus.default_currency}
          householdId={context.nucleus.id}
          locale={locale}
          role={context.role}
          userId={context.user.id}
        />
      </div>
    </FinanceShell>
  );
}

export async function AccountsSection({
  context,
}: {
  context: FinanceContext;
}) {
  const locale = context.locale;

  const [accountsResult, cardsResult] = await Promise.all([
    context.supabase
      .from("accounts")
      .select(
        "id, name, type, currency, opening_balance, institution, is_active, created_at",
      )
      .eq("household_id", context.nucleus.id)
      .order("created_at", { ascending: false }),
    context.supabase
      .from("cards")
      .select(
        "id, name, issuer, last4, currency, limit_amount, closing_day, due_day, is_active, created_at",
      )
      .eq("household_id", context.nucleus.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <FinanceShell
      active="accounts"
      context={context}
      description={
        locale === "pt-BR"
          ? "Centralize contas bancárias, carteiras e cartões usados pelo Núcleo."
          : "Centralise bank accounts, wallets and cards used by the Nucleus."
      }
      eyebrow={locale === "pt-BR" ? "ESTRUTURA" : "STRUCTURE"}
      title={locale === "pt-BR" ? "Contas & Bancos" : "Accounts & Banks"}
    >
      <div className={styles.grid2}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>{locale === "pt-BR" ? "Contas" : "Accounts"}</h2>
          </div>
          {(accountsResult.data ?? []).length ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{locale === "pt-BR" ? "Conta" : "Account"}</th>
                  <th>{locale === "pt-BR" ? "Instituição" : "Institution"}</th>
                  <th>{locale === "pt-BR" ? "Tipo" : "Type"}</th>
                  <th>{locale === "pt-BR" ? "Saldo inicial" : "Opening balance"}</th>
                </tr>
              </thead>
              <tbody>
                {(accountsResult.data ?? []).map((row: any) => (
                  <tr key={row.id}>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.institution || "—"}</td>
                    <td><span className={styles.tag}>{accountTypeLabel(row.type, locale)}</span></td>
                    <td>{money(Number(row.opening_balance), row.currency, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            empty(locale, "Nenhuma conta cadastrada.", "No accounts created.")
          )}
        </div>

        <AccountForm
          currency={context.nucleus.default_currency}
          householdId={context.nucleus.id}
          locale={locale}
          role={context.role}
          userId={context.user.id}
        />

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>{locale === "pt-BR" ? "Cartões" : "Cards"}</h2>
          </div>
          {(cardsResult.data ?? []).length ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{locale === "pt-BR" ? "Cartão" : "Card"}</th>
                  <th>{locale === "pt-BR" ? "Emissor" : "Issuer"}</th>
                  <th>{locale === "pt-BR" ? "Final" : "Last 4"}</th>
                  <th>{locale === "pt-BR" ? "Limite" : "Limit"}</th>
                </tr>
              </thead>
              <tbody>
                {(cardsResult.data ?? []).map((row: any) => (
                  <tr key={row.id}>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.issuer || "—"}</td>
                    <td>{row.last4 ? `•••• ${row.last4}` : "—"}</td>
                    <td>
                      {row.limit_amount
                        ? money(Number(row.limit_amount), row.currency, locale)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            empty(locale, "Nenhum cartão cadastrado.", "No cards created.")
          )}
        </div>

        <CardForm
          currency={context.nucleus.default_currency}
          householdId={context.nucleus.id}
          locale={locale}
          role={context.role}
          userId={context.user.id}
        />
      </div>
    </FinanceShell>
  );
}

export async function InvestmentsSection({
  context,
}: {
  context: FinanceContext;
}) {
  const locale = context.locale;

  const [investmentsResult, accountsResult, fxResult] = await Promise.all([
    context.supabase
      .from("investments")
      .select(
        "id, name, symbol, asset_class, quantity, average_price, current_price, currency, institution, accounts(name), created_at",
      )
      .eq("household_id", context.nucleus.id)
      .order("created_at", { ascending: false }),
    context.supabase
      .from("accounts")
      .select("id, name")
      .eq("household_id", context.nucleus.id)
      .eq("is_active", true)
      .order("name"),
    context.supabase
      .from("exchange_rates")
      .select("currency_code, rate_per_brl"),
  ]);

  const rows = investmentsResult.data ?? [];
  const fx = new Map<string, number>([["BRL", 1]]);
  for (const row of fxResult.data ?? []) {
    if (Number((row as any).rate_per_brl) > 0) {
      fx.set((row as any).currency_code, Number((row as any).rate_per_brl));
    }
  }

  function convertToNucleus(value: number, fromCurrency: string) {
    const toCurrency = context.nucleus.default_currency;
    if (fromCurrency === toCurrency) return value;
    const fromRate = fx.get(fromCurrency);
    const toRate = fx.get(toCurrency);
    if (!fromRate || !toRate) return 0;
    return (value / fromRate) * toRate;
  }

  const totalCost = rows.reduce(
    (sum: number, row: any) =>
      sum + convertToNucleus(
        Number(row.quantity) * Number(row.average_price),
        row.currency,
      ),
    0,
  );
  const totalMarket = rows.reduce(
    (sum: number, row: any) =>
      sum + convertToNucleus(
        Number(row.quantity) * Number(row.current_price ?? row.average_price),
        row.currency,
      ),
    0,
  );

  return (
    <FinanceShell
      active="investments"
      context={context}
      description={
        locale === "pt-BR"
          ? "Acompanhe posições, custo médio e valor informado dos seus investimentos."
          : "Track positions, average cost and the recorded value of your investments."
      }
      eyebrow={locale === "pt-BR" ? "PATRIMÔNIO" : "WEALTH"}
      title={locale === "pt-BR" ? "Investimentos" : "Investments"}
    >
      <div className={styles.grid3} style={{ marginBottom: 13 }}>
        <div className={`${styles.card} ${styles.metric}`}>
          <span>{locale === "pt-BR" ? "Custo registrado" : "Recorded cost"}</span>
          <strong>{money(totalCost, context.nucleus.default_currency, locale)}</strong>
        </div>
        <div className={`${styles.card} ${styles.metric}`}>
          <span>{locale === "pt-BR" ? "Valor atual informado" : "Recorded current value"}</span>
          <strong>{money(totalMarket, context.nucleus.default_currency, locale)}</strong>
        </div>
        <div className={`${styles.card} ${styles.metric}`}>
          <span>{locale === "pt-BR" ? "Posições" : "Positions"}</span>
          <strong>{rows.length}</strong>
        </div>
      </div>

      <div className={styles.grid2}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>{locale === "pt-BR" ? "Carteira" : "Portfolio"}</h2>
          </div>

          {rows.length ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{locale === "pt-BR" ? "Ativo" : "Asset"}</th>
                  <th>{locale === "pt-BR" ? "Classe" : "Class"}</th>
                  <th>{locale === "pt-BR" ? "Quantidade" : "Quantity"}</th>
                  <th>{locale === "pt-BR" ? "Preço médio" : "Average price"}</th>
                  <th>{locale === "pt-BR" ? "Preço atual" : "Current price"}</th>
                  <th>{locale === "pt-BR" ? "Valor" : "Value"}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row: any) => {
                  const current = Number(row.current_price ?? row.average_price);
                  return (
                    <tr key={row.id}>
                      <td>
                        <strong>{row.symbol || row.name}</strong>
                        <div>{row.symbol ? row.name : row.institution || ""}</div>
                      </td>
                      <td><span className={styles.tag}>{investmentClassLabel(row.asset_class, locale)}</span></td>
                      <td>{Number(row.quantity)}</td>
                      <td>{money(Number(row.average_price), row.currency, locale)}</td>
                      <td>{money(current, row.currency, locale)}</td>
                      <td>{money(Number(row.quantity) * current, row.currency, locale)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            empty(locale, "Nenhum investimento cadastrado.", "No investments created.")
          )}
        </div>

        <InvestmentForm
          accounts={(accountsResult.data ?? []) as any}
          currency={context.nucleus.default_currency}
          householdId={context.nucleus.id}
          locale={locale}
          role={context.role}
          userId={context.user.id}
        />
      </div>
    </FinanceShell>
  );
}

export async function ExchangeRatesSection({
  context,
}: {
  context: FinanceContext;
}) {
  const locale = context.locale;

  const { data: rows } = await context.supabase
    .from("exchange_rates")
    .select("currency_code, rate_per_brl, fetched_at")
    .not("rate_per_brl", "is", null)
    .order("currency_code");

  const rates = (rows ?? [])
    .filter((row: any) => Number(row.rate_per_brl) > 0)
    .map((row: any) => ({
      code: row.currency_code,
      ratePerBrl: Number(row.rate_per_brl),
    }));

  const fetchedAt =
    (rows ?? [])
      .map((row: any) => row.fetched_at as string | null)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;

  return (
    <FinanceShell
      active="exchange-rates"
      context={context}
      description={
        locale === "pt-BR"
          ? "Cotações armazenadas no cache do AUREUM. Consultar esta página não consome uma nova chamada na API externa."
          : "Rates stored in AUREUM's cache. Opening this page does not consume a new external API request."
      }
      eyebrow={locale === "pt-BR" ? "CÂMBIO" : "FOREIGN EXCHANGE"}
      title={locale === "pt-BR" ? "Cotações" : "Exchange rates"}
    >
      <div className={styles.card}>
        <CurrencyRates
          fetchedAt={fetchedAt}
          locale={locale}
          rates={rates}
        />
      </div>
    </FinanceShell>
  );
}

export async function JoinNucleusSection({
  context,
}: {
  context: FinanceContext;
}) {
  const locale = context.locale;

  const { data: requests } = await context.supabase.rpc(
    "aureum_my_join_requests",
  );

  return (
    <FinanceShell
      active="dashboard"
      context={context}
      description={
        locale === "pt-BR"
          ? "Use o código AUREUM compartilhado por outro Núcleo para solicitar sua entrada."
          : "Use an AUREUM code shared by another Nucleus to request access."
      }
      eyebrow={locale === "pt-BR" ? "NÚCLEOS" : "NUCLEI"}
      title={
        locale === "pt-BR"
          ? "Adicionar Núcleo existente"
          : "Join an existing Nucleus"
      }
    >
      <div className={styles.grid2}>
        <NucleusJoinForm locale={locale} userId={context.user.id} />

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>
              {locale === "pt-BR"
                ? "Suas solicitações recentes"
                : "Your recent requests"}
            </h2>
          </div>

          {(requests ?? []).length ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{locale === "pt-BR" ? "Núcleo" : "Nucleus"}</th>
                  <th>Status</th>
                  <th>{locale === "pt-BR" ? "Enviada" : "Sent"}</th>
                </tr>
              </thead>
              <tbody>
                {(requests ?? []).map((row: any) => (
                  <tr key={row.id}>
                    <td><strong>{row.household_name ?? "—"}</strong></td>
                    <td><span className={styles.tag}>{row.status}</span></td>
                    <td>{dateTime(row.created_at, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            empty(
              locale,
              "Nenhuma solicitação enviada.",
              "No requests sent.",
            )
          )}
        </div>
      </div>
    </FinanceShell>
  );
}

export async function ApprovalsSection({
  context,
}: {
  context: FinanceContext;
}) {
  const locale = context.locale;
  const manager = isManager(context.role);

  if (!manager) {
    return (
      <FinanceShell
        active="approvals"
        context={context}
        description={
          locale === "pt-BR"
            ? "Esta área é reservada a Proprietários e Administradores."
            : "This area is restricted to Owners and Administrators."
        }
        eyebrow={locale === "pt-BR" ? "GOVERNANÇA" : "GOVERNANCE"}
        title={locale === "pt-BR" ? "Aprovações" : "Approvals"}
      >
        <div className={styles.notice}>
          {locale === "pt-BR"
            ? `Seu papel atual é ${roleLabel(context.role, locale)}. Você pode acompanhar o Núcleo, mas não aprovar entradas ou lançamentos.`
            : `Your current role is ${roleLabel(context.role, locale)}. You can view the Nucleus, but cannot approve access or financial entries.`}
        </div>
      </FinanceShell>
    );
  }

  const [joinResult, financeResult] = await Promise.all([
    context.supabase.rpc("aureum_pending_join_approvals", {
      target_household: context.nucleus.id,
    }),
    context.supabase.rpc("aureum_pending_financial_approvals", {
      target_household: context.nucleus.id,
    }),
  ]);

  const joins = joinResult.data ?? [];
  const financial = financeResult.data ?? [];

  return (
    <FinanceShell
      active="approvals"
      context={context}
      description={
        locale === "pt-BR"
          ? "Central de decisões do Núcleo: novos membros e lançamentos enviados por colaboradores."
          : "Nucleus decision centre: new members and financial entries submitted by contributors."
      }
      eyebrow={locale === "pt-BR" ? "GOVERNANÇA" : "GOVERNANCE"}
      title={locale === "pt-BR" ? "Aprovações" : "Approvals"}
    >
      <div className={styles.grid2}>
        <div className={styles.card}>
          <h2>
            {locale === "pt-BR"
              ? `Solicitações de entrada (${joins.length})`
              : `Access requests (${joins.length})`}
          </h2>

          <div style={{ display: "grid", gap: 9, marginTop: 14 }}>
            {joins.length
              ? joins.map((row: any) => (
                  <div className={styles.approvalCard} key={row.id}>
                    <header>
                      <strong>{row.requester_name || row.requester_id}</strong>
                      <span>{dateTime(row.created_at, locale)}</span>
                    </header>
                    <p>
                      {locale === "pt-BR"
                        ? "Solicitou entrada como Membro."
                        : "Requested access as a Member."}
                    </p>
                    <ApprovalActions
                      id={row.id}
                      locale={locale}
                      table="household_join_requests"
                    />
                  </div>
                ))
              : empty(
                  locale,
                  "Nenhuma solicitação de entrada pendente.",
                  "No pending access requests.",
                )}
          </div>
        </div>

        <div className={styles.card}>
          <h2>
            {locale === "pt-BR"
              ? `Lançamentos pendentes (${financial.length})`
              : `Pending entries (${financial.length})`}
          </h2>

          <div style={{ display: "grid", gap: 9, marginTop: 14 }}>
            {financial.length
              ? financial.map((row: any) => {
                  const payload = row.payload ?? {};
                  const data = payload.data ?? {};
                  return (
                    <div className={styles.approvalCard} key={row.id}>
                      <header>
                        <strong>{row.requester_name || row.requester_id}</strong>
                        <span>{dateTime(row.created_at, locale)}</span>
                      </header>
                      <p>
                        <span className={styles.tag}>
                          {payload.entity ?? "submission"}
                        </span>{" "}
                        {data.description ?? ""}
                      </p>
                      {data.amount ? (
                        <p className={styles.gold}>
                          {money(
                            Number(data.amount),
                            data.currency ?? context.nucleus.default_currency,
                            locale,
                          )}
                        </p>
                      ) : null}
                      <ApprovalActions
                        id={row.id}
                        locale={locale}
                        table="financial_submissions"
                      />
                    </div>
                  );
                })
              : empty(
                  locale,
                  "Nenhum lançamento aguardando aprovação.",
                  "No financial entries awaiting approval.",
                )}
          </div>
        </div>
      </div>
    </FinanceShell>
  );
}
