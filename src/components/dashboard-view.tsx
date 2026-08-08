import Link from "next/link";
import {
  MonthNavigator,
  ProfileMenu,
  type NucleusOption,
} from "@/components/dashboard-controls";
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
};

const demoData: DashboardData = {
  currency: "BRL",
  consolidatedBalance: 20418.73,
  incomeMonth: 4702,
  expensesMonth: 2596.44,
  cardSpendMonth: 1347.8,
  accountCount: 3,
  cardCount: 2,
  ignoredCurrencyAccounts: 0,
  transactions: [
    {
      id: "1",
      description: "Mercado São Luiz",
      type: "expense",
      amount: 186.42,
      currency: "BRL",
      occurredAt: "2026-08-05T12:00:00Z",
      categoryName: "Alimentação",
      accountName: "Nubank",
      cardName: null,
    },
    {
      id: "2",
      description: "Salário",
      type: "income",
      amount: 2702,
      currency: "BRL",
      occurredAt: "2026-08-01T12:00:00Z",
      categoryName: "Receita",
      accountName: "XP",
      cardName: null,
    },
  ],
  categories: [
    { name: "Moradia", value: 1480, percent: 74 },
    { name: "Alimentação", value: 696, percent: 35 },
  ],
  goal: {
    title: "Exemplo de meta",
    currentAmount: 20000,
    targetAmount: 35000,
  },
};

function money(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function monthTitle(value: string) {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
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

export function DashboardView({
  userName = "Usuário",
  userEmail,
  userSubtitle = "AUREUM",
  householdId,
  households = [],
  selectedMonth = currentMonth(),
  data,
  demo = false,
}: Props) {
  const d = demo ? demoData : data!;
  const firstName = userName.split(/\s+/)[0] || "você";
  const goalPercent =
    d.goal && d.goal.targetAmount > 0
      ? Math.min(100, (d.goal.currentAmount / d.goal.targetAmount) * 100)
      : 0;

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link className={styles.brand} href="/">
          <img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM" />
        </Link>

        <nav className={styles.sidebarNav}>
          <a className={styles.activeLink} href="#resumo">
            <span>◫</span>
            Resumo
          </a>
          <a href="#transacoes">
            <span>↕</span>
            Transações
          </a>
          <a href="#categorias">
            <span>◌</span>
            Categorias
          </a>
          <a href="#metas">
            <span>◎</span>
            Metas
          </a>
        </nav>

        {!demo && householdId ? (
          <ProfileMenu
            currentNucleusId={householdId}
            nuclei={households}
            selectedMonth={selectedMonth}
            userEmail={userEmail}
            userName={userName}
            userSubtitle={userSubtitle}
          />
        ) : (
          <div className={styles.demoUser}>
            <span>VI</span>
            <div>
              <strong>Visitante</strong>
              <small>Demonstração AUREUM</small>
            </div>
          </div>
        )}
      </aside>

      <section className={styles.content}>
        <header className={styles.top}>
          <div>
            <p className={styles.eyebrow}>{monthTitle(selectedMonth)}</p>
            <h1>Olá, {firstName}.</h1>
            <p>
              {demo
                ? "Demonstração com dados de exemplo."
                : "Os números abaixo são calculados a partir dos registros deste Núcleo."}
            </p>
          </div>

          {!demo ? (
            <span className={styles.liveBadge}>● DADOS DO BANCO</span>
          ) : (
            <span className={styles.demoBadge}>DEMONSTRAÇÃO</span>
          )}
        </header>

        {!demo && householdId ? (
          <div className={styles.periodBar}>
            <MonthNavigator
              currentNucleusId={householdId}
              selectedMonth={selectedMonth}
            />
          </div>
        ) : null}

        <section className={styles.summary} id="resumo">
          <article>
            <span>Saldo consolidado</span>
            <strong>{money(d.consolidatedBalance, d.currency)}</strong>
            <small>{d.accountCount} conta(s) na moeda principal</small>
          </article>

          <article>
            <span>Receitas do mês</span>
            <strong className={styles.positive}>
              {money(d.incomeMonth, d.currency)}
            </strong>
            <small>Lançamentos confirmados</small>
          </article>

          <article>
            <span>Despesas do mês</span>
            <strong className={styles.negative}>
              {money(d.expensesMonth, d.currency)}
            </strong>
            <small>Somente transações oficiais</small>
          </article>

          <article>
            <span>Gastos em cartões</span>
            <strong>{money(d.cardSpendMonth, d.currency)}</strong>
            <small>{d.cardCount} cartão(ões) cadastrado(s)</small>
          </article>
        </section>

        {d.ignoredCurrencyAccounts > 0 ? (
          <p className={styles.currencyNote}>
            Existem {d.ignoredCurrencyAccounts} conta(s) em outra moeda. Elas não
            são somadas ao saldo consolidado sem conversão cambial.
          </p>
        ) : null}

        <section className={styles.grid}>
          <article className={`${styles.panel} ${styles.wide}`} id="transacoes">
            <div className={styles.panelHead}>
              <div>
                <p>Movimentação</p>
                <h2>Transações do mês</h2>
              </div>
            </div>

            {d.transactions.length ? (
              <div className={styles.transactions}>
                {d.transactions.map((transaction) => {
                  const sign =
                    transaction.type === "income"
                      ? "+"
                      : transaction.type === "expense"
                        ? "−"
                        : "↔";

                  const valueClass =
                    transaction.type === "income"
                      ? styles.positive
                      : transaction.type === "expense"
                        ? styles.negative
                        : "";

                  return (
                    <div className={styles.transaction} key={transaction.id}>
                      <span className={styles.txIcon}>
                        {transaction.type === "income"
                          ? "↙"
                          : transaction.type === "expense"
                            ? "↗"
                            : "↔"}
                      </span>

                      <div>
                        <strong>{transaction.description}</strong>
                        <small>
                          {[
                            transaction.categoryName,
                            transaction.accountName,
                            transaction.cardName,
                          ]
                            .filter(Boolean)
                            .join(" • ") || "Sem classificação"}
                        </small>
                      </div>

                      <div className={styles.txValue}>
                        <strong className={valueClass}>
                          {sign} {money(transaction.amount, transaction.currency)}
                        </strong>
                        <small>
                          {new Intl.DateTimeFormat("pt-BR", {
                            day: "2-digit",
                            month: "short",
                          }).format(new Date(transaction.occurredAt))}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.empty}>
                <strong>Nenhuma transação neste mês.</strong>
                <p>
                  Quando houver lançamentos oficiais neste Núcleo e período, eles
                  aparecerão aqui.
                </p>
              </div>
            )}
          </article>

          <article className={styles.panel} id="metas">
            <div className={styles.panelHead}>
              <div>
                <p>Objetivo</p>
                <h2>{d.goal?.title ?? "Metas"}</h2>
              </div>
              {d.goal ? <span>{goalPercent.toFixed(0)}%</span> : null}
            </div>

            {d.goal ? (
              <>
                <div className={styles.goalAmount}>
                  <strong>{money(d.goal.currentAmount, d.currency)}</strong>
                  <span>de {money(d.goal.targetAmount, d.currency)}</span>
                </div>
                <div className={styles.progress}>
                  <i style={{ width: `${goalPercent}%` }} />
                </div>
              </>
            ) : (
              <div className={styles.empty}>
                <strong>Nenhuma meta cadastrada.</strong>
                <p>
                  Aqui aparecem somente metas reais salvas no banco de dados.
                </p>
              </div>
            )}
          </article>

          <article className={`${styles.panel} ${styles.wide}`} id="categorias">
            <div className={styles.panelHead}>
              <div>
                <p>Despesas do mês</p>
                <h2>Gastos por categoria</h2>
              </div>
            </div>

            {d.categories.length ? (
              <div className={styles.categories}>
                {d.categories.map((category) => (
                  <div className={styles.category} key={category.name}>
                    <div>
                      <strong>{category.name}</strong>
                      <span>{money(category.value, d.currency)}</span>
                    </div>
                    <div className={styles.progress}>
                      <i style={{ width: `${category.percent}%` }} />
                    </div>
                    <span>{category.percent.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <strong>Sem despesas categorizadas neste mês.</strong>
                <p>
                  Assim que existirem registros, a distribuição será calculada
                  automaticamente.
                </p>
              </div>
            )}
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHead}>
              <div>
                <p>Estrutura</p>
                <h2>Núcleo</h2>
              </div>
            </div>

            <div className={styles.structure}>
              <div>
                <strong>{d.accountCount}</strong>
                <span>Contas</span>
              </div>
              <div>
                <strong>{d.cardCount}</strong>
                <span>Cartões</span>
              </div>
              <div>
                <strong>{d.transactions.length}</strong>
                <span>No período</span>
              </div>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
