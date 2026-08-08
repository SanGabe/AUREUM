import Link from "next/link";
import { DashboardActionLoadingProvider } from "@/components/dashboard-action-loading";
import {
  MonthNavigator,
  ProfileMenu,
  type NucleusOption,
} from "@/components/dashboard-controls";
import type { AppLocale, EnglishLocale } from "@/i18n/locales";
import { localePrefix } from "@/i18n/locales";
import { getEnglishCopy } from "@/i18n/english-copy";
import { FinanceNavigation } from "@/components/finance-navigation";
import { CurrencyRates, type ExchangeRateRow } from "@/components/currency-rates";
import { MobileFinanceNav } from "@/components/mobile-finance-nav";
import styles from "./dashboard-view.module.css";

export type DashboardTransaction = {
  id: string;
  description: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  currency: string;
  occurredAt: string;
  categoryName: string | null;
  accountName: string | null;
  cardName: string | null;
};

export type DashboardData = {
  currency: string;
  consolidatedBalance: number;
  incomeMonth: number;
  expensesMonth: number;
  cardSpendMonth: number;
  accountCount: number;
  cardCount: number;
  ignoredCurrencyAccounts: number;
  transactions: DashboardTransaction[];
  categories: { name: string; value: number; percent: number }[];
  goal: { title: string; currentAmount: number; targetAmount: number } | null;
  exchangeRates?: ExchangeRateRow[];
  fxFetchedAt?: string | null;
};

type Props = {
  userName?: string;
  userEmail?: string;
  userSubtitle?: string;
  householdId?: string;
  households?: NucleusOption[];
  selectedMonth?: string;
  data?: DashboardData;
  demo?: boolean;
  locale?: AppLocale;
};

const demoData: DashboardData = {
  currency: "USD",
  consolidatedBalance: 20418.73,
  incomeMonth: 4702,
  expensesMonth: 2596.44,
  cardSpendMonth: 1347.8,
  accountCount: 3,
  cardCount: 2,
  ignoredCurrencyAccounts: 0,
  transactions: [
    { id: "1", description: "Grocery Store", type: "expense", amount: 186.42, currency: "USD", occurredAt: "2026-08-05T12:00:00Z", categoryName: "Groceries", accountName: "Main account", cardName: null },
    { id: "2", description: "Salary", type: "income", amount: 2702, currency: "USD", occurredAt: "2026-08-01T12:00:00Z", categoryName: "Income", accountName: "Main account", cardName: null },
  ],
  categories: [
    { name: "Housing", value: 1480, percent: 68 },
    { name: "Groceries", value: 696, percent: 32 },
  ],
  goal: { title: "Example goal", currentAmount: 20000, targetAmount: 35000 },
  exchangeRates: [],
  fxFetchedAt: null,
};

function money(value: number, currency: string, locale: AppLocale) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function monthTitle(value: string, locale: AppLocale) {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(Date.UTC(year, month - 1, 1)))
    .toUpperCase();
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}


function displayCategory(name: string | null, locale: AppLocale) {
  if (!name || locale === "pt-BR") return name;

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


export function DashboardView({
  userName = "Usuário",
  userEmail,
  userSubtitle = "AUREUM",
  householdId,
  households = [],
  selectedMonth = currentMonth(),
  data,
  demo = false,
  locale = "pt-BR",
}: Props) {
  const en =
    locale === "pt-BR"
      ? null
      : getEnglishCopy(locale as EnglishLocale);

  const d = demo
    ? {
        ...demoData,
        currency: locale === "en-GB" ? "GBP" : locale === "pt-BR" ? "BRL" : "USD",
      }
    : data!;

  const firstName = userName.split(/\s+/)[0] || (locale === "pt-BR" ? "você" : "you");
  const goalPercent =
    d.goal && d.goal.targetAmount > 0
      ? Math.min(100, (d.goal.currentAmount / d.goal.targetAmount) * 100)
      : 0;

  const prefix =
    locale === "pt-BR" ? "" : localePrefix(locale as EnglishLocale);
  const dashboardPath = `${prefix}/dashboard`;

  const text = {
    overview: en?.dashboard.overview ?? "Resumo",
    transactions: en?.dashboard.transactions ?? "Transações",
    categories: en?.dashboard.categories ?? "Categorias",
    goals: en?.dashboard.goals ?? "Metas",
    hello: en?.dashboard.hello ?? "Olá",
    description:
      en?.dashboard.description ??
      "Os números abaixo são calculados a partir dos registros deste Núcleo.",
    demoDescription:
      en?.dashboard.demoDescription ?? "Demonstração com dados de exemplo.",
    balance: en?.dashboard.balance ?? "Saldo consolidado",
    income: en?.dashboard.income ?? "Receitas do mês",
    expenses: en?.dashboard.expenses ?? "Despesas do mês",
    cardSpend: en?.dashboard.cardSpend ?? "Gastos em cartões",
    accountsMainCurrency:
      en?.dashboard.accountsMainCurrency ?? "conta(s) na moeda principal",
    confirmed: en?.dashboard.confirmed ?? "Lançamentos confirmados",
    officialOnly:
      en?.dashboard.officialOnly ?? "Somente transações oficiais",
    cardsRegistered:
      en?.dashboard.cardsRegistered ?? "cartão(ões) cadastrado(s)",
    movement: en?.dashboard.movement ?? "Movimentação",
    monthTransactions:
      en?.dashboard.monthTransactions ?? "Transações do mês",
    noTransactions:
      en?.dashboard.noTransactions ?? "Nenhuma transação neste mês.",
    noTransactionsText:
      en?.dashboard.noTransactionsText ??
      "Quando houver lançamentos oficiais neste Núcleo e período, eles aparecerão aqui.",
    objective: en?.dashboard.objective ?? "Objetivo",
    noGoal: en?.dashboard.noGoal ?? "Nenhuma meta cadastrada.",
    noGoalText:
      en?.dashboard.noGoalText ??
      "Aqui aparecem somente metas reais salvas no banco de dados.",
    monthExpenses:
      en?.dashboard.monthExpenses ?? "Despesas do mês",
    categorySpend:
      en?.dashboard.categorySpend ?? "Gastos por categoria",
    noCategories:
      en?.dashboard.noCategories ??
      "Sem despesas categorizadas neste mês.",
    noCategoriesText:
      en?.dashboard.noCategoriesText ??
      "Assim que existirem registros, a distribuição será calculada automaticamente.",
    structure: en?.dashboard.structure ?? "Estrutura",
    nucleus: en?.common.nucleus ?? "Núcleo",
    accounts: en?.dashboard.accounts ?? "Contas",
    cards: en?.dashboard.cards ?? "Cartões",
    inPeriod: en?.dashboard.inPeriod ?? "No período",
    noClassification:
      en?.dashboard.noClassification ?? "Sem classificação",
  };

  return (
    <DashboardActionLoadingProvider locale={locale}>
      <main className={styles.shell} lang={locale}>
        <aside className={styles.sidebar}>
          <Link className={styles.brand} href={prefix || "/"}>
            <img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM" />
          </Link>

          <FinanceNavigation
            active="dashboard"
            demo={demo}
            householdId={householdId}
            locale={locale}
            month={selectedMonth}
          />

          {!demo && householdId ? (
            <ProfileMenu
              currentNucleusId={householdId}
              currentSection="dashboard"
              nuclei={households}
              selectedMonth={selectedMonth}
              userEmail={userEmail}
              userName={userName}
              userSubtitle={userSubtitle}
              locale={locale}
            />
          ) : (
            <div className={styles.demoUser}>
              <span>VI</span>
              <div>
                <strong>{locale === "pt-BR" ? "Visitante" : "Visitor"}</strong>
                <small>{locale === "pt-BR" ? "Demonstração AUREUM" : "AUREUM demo"}</small>
              </div>
            </div>
          )}
        </aside>

        {demo ? (
          <MobileFinanceNav
            active="dashboard"
            demo
            locale={locale}
            month={selectedMonth}
            userName={userName}
          />
        ) : householdId ? (
          <MobileFinanceNav
            active="dashboard"
            currentNucleusId={householdId}
            locale={locale}
            month={selectedMonth}
            nuclei={households}
            userName={userName}
          />
        ) : null}

        <section className={styles.content}>
          <header className={styles.top}>
            <div>
              <p className={styles.eyebrow}>{monthTitle(selectedMonth, locale)}</p>
              <h1>{text.hello}, {firstName}.</h1>
              <p>{demo ? text.demoDescription : text.description}</p>
            </div>

            {!demo ? (
              <span className={styles.liveBadge}>
                {en?.dashboard.realData ?? "● DADOS DO BANCO"}
              </span>
            ) : (
              <span className={styles.demoBadge}>
                {en?.dashboard.demo ?? "DEMONSTRAÇÃO"}
              </span>
            )}
          </header>

          {!demo && householdId ? (
            <div className={styles.periodBar}>
              <MonthNavigator
                currentNucleusId={householdId}
                currentSection="dashboard"
                selectedMonth={selectedMonth}
                locale={locale}
                dashboardPath={dashboardPath}
              />
            </div>
          ) : null}

          <section className={styles.summary} id="resumo">
            <article><span>{text.balance}</span><strong>{money(d.consolidatedBalance,d.currency,locale)}</strong><small>{d.accountCount} {text.accountsMainCurrency}</small></article>
            <article><span>{text.income}</span><strong className={styles.positive}>{money(d.incomeMonth,d.currency,locale)}</strong><small>{text.confirmed}</small></article>
            <article><span>{text.expenses}</span><strong className={styles.negative}>{money(d.expensesMonth,d.currency,locale)}</strong><small>{text.officialOnly}</small></article>
            <article><span>{text.cardSpend}</span><strong>{money(d.cardSpendMonth,d.currency,locale)}</strong><small>{d.cardCount} {text.cardsRegistered}</small></article>
          </section>

          {d.ignoredCurrencyAccounts > 0 ? (
            <p className={styles.currencyNote}>
              {locale === "pt-BR"
                ? `Existem ${d.ignoredCurrencyAccounts} conta(s) em moeda sem cotação disponível no cache atual.`
                : `${d.ignoredCurrencyAccounts} account(s) use a currency without a cached exchange rate.`}
            </p>
          ) : null}

          <section className={styles.grid}>
            <article className={`${styles.panel} ${styles.wide}`} id="transacoes">
              <div className={styles.panelHead}><div><p>{text.movement}</p><h2>{text.monthTransactions}</h2></div></div>
              {d.transactions.length ? (
                <div className={styles.transactions}>
                  {d.transactions.map((transaction) => {
                    const sign = transaction.type === "income" ? "+" : transaction.type === "expense" ? "−" : "↔";
                    const valueClass = transaction.type === "income" ? styles.positive : transaction.type === "expense" ? styles.negative : "";

                    return (
                      <div className={styles.transaction} key={transaction.id}>
                        <span className={styles.txIcon}>{transaction.type === "income" ? "↙" : transaction.type === "expense" ? "↗" : "↔"}</span>
                        <div>
                          <strong>{transaction.description}</strong>
                          <small>{[displayCategory(transaction.categoryName, locale),transaction.accountName,transaction.cardName].filter(Boolean).join(" • ") || text.noClassification}</small>
                        </div>
                        <div className={styles.txValue}>
                          <strong className={valueClass}>{sign} {money(transaction.amount,transaction.currency,locale)}</strong>
                          <small>{new Intl.DateTimeFormat(locale,{day:"2-digit",month:"short"}).format(new Date(transaction.occurredAt))}</small>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : <div className={styles.empty}><strong>{text.noTransactions}</strong><p>{text.noTransactionsText}</p></div>}
            </article>

            <article className={styles.panel} id="metas">
              <div className={styles.panelHead}><div><p>{text.objective}</p><h2>{d.goal?.title ?? text.goals}</h2></div>{d.goal ? <span>{goalPercent.toFixed(0)}%</span> : null}</div>
              {d.goal ? (
                <>
                  <div className={styles.goalAmount}><strong>{money(d.goal.currentAmount,d.currency,locale)}</strong><span>{locale === "pt-BR" ? "de" : "of"} {money(d.goal.targetAmount,d.currency,locale)}</span></div>
                  <div className={styles.progress}><i style={{width:`${goalPercent}%`}} /></div>
                </>
              ) : <div className={styles.empty}><strong>{text.noGoal}</strong><p>{text.noGoalText}</p></div>}
            </article>

            <article className={`${styles.panel} ${styles.wide}`} id="categorias">
              <div className={styles.panelHead}><div><p>{text.monthExpenses}</p><h2>{text.categorySpend}</h2></div></div>
              {d.categories.length ? (
                <div className={styles.categories}>
                  {d.categories.map((category) => (
                    <div className={styles.category} key={category.name}>
                      <div><strong>{displayCategory(category.name, locale)}</strong><span>{money(category.value,d.currency,locale)}</span></div>
                      <div className={styles.progress}><i style={{width:`${category.percent}%`}} /></div>
                      <span>{category.percent.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              ) : <div className={styles.empty}><strong>{text.noCategories}</strong><p>{text.noCategoriesText}</p></div>}
            </article>

            <article className={styles.panel}>
              <div className={styles.panelHead}><div><p>{text.structure}</p><h2>{text.nucleus}</h2></div></div>
              <div className={styles.structure}>
                <div><strong>{d.accountCount}</strong><span>{text.accounts}</span></div>
                <div><strong>{d.cardCount}</strong><span>{text.cards}</span></div>
                <div><strong>{d.transactions.length}</strong><span>{text.inPeriod}</span></div>
              </div>
            </article>

            <article className={styles.panel}>
              <div className={styles.panelHead}>
                <div>
                  <p>{locale === "pt-BR" ? "CÂMBIO" : "FOREIGN EXCHANGE"}</p>
                  <h2>{locale === "pt-BR" ? "Principais moedas" : "Major currencies"}</h2>
                </div>
                {!demo ? (
                  <Link
                    href={`${locale === "pt-BR" ? "/cotacoes" : `${prefix}/exchange-rates`}?household=${encodeURIComponent(householdId ?? "")}&month=${encodeURIComponent(selectedMonth)}`}
                    style={{ color: "#d9ad4d", fontSize: 8, textDecoration: "none" }}
                  >
                    {locale === "pt-BR" ? "Ver todas" : "View all"}
                  </Link>
                ) : null}
              </div>

              <CurrencyRates
                compact
                fetchedAt={d.fxFetchedAt}
                locale={locale}
                rates={d.exchangeRates ?? []}
              />
            </article>
          </section>
        </section>
      </main>
    </DashboardActionLoadingProvider>
  );
}
