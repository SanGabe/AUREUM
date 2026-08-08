import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { HouseholdSwitcher } from "@/components/household-switcher";
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
  userSubtitle?: string;
  householdId?: string;
  households?: { id: string; name: string; roleLabel: string }[];
  data?: DashboardData;
  demo?: boolean;
  showLogout?: boolean;
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
    { id:"1", description:"Mercado São Luiz", type:"expense", amount:186.42, currency:"BRL", occurredAt:"2026-08-05T12:00:00Z", categoryName:"Alimentação", accountName:"Nubank", cardName:null },
    { id:"2", description:"Salário", type:"income", amount:2702, currency:"BRL", occurredAt:"2026-08-01T12:00:00Z", categoryName:"Receita", accountName:"XP", cardName:null },
  ],
  categories: [
    { name:"Moradia", value:1480, percent:74 },
    { name:"Alimentação", value:696, percent:35 },
  ],
  goal: { title:"Exemplo de meta", currentAmount:20000, targetAmount:35000 },
};

function money(value: number, currency: string) {
  try { return new Intl.NumberFormat("pt-BR",{style:"currency",currency}).format(value); }
  catch { return `${currency} ${value.toFixed(2)}`; }
}
function initials(name:string){ const p=name.trim().split(/\s+/).filter(Boolean); return p.length>1?`${p[0][0]}${p[p.length-1][0]}`.toUpperCase():(p[0]?.slice(0,2).toUpperCase()||"U"); }

export function DashboardView({
  userName="Usuário",
  userSubtitle="AUREUM",
  householdId,
  households=[],
  data,
  demo=false,
  showLogout=false,
}: Props) {
  const d = demo ? demoData : data!;
  const firstName = userName.split(/\s+/)[0] || "você";
  const month = new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(new Date()).toUpperCase();
  const goalPercent = d.goal && d.goal.targetAmount > 0 ? Math.min(100,(d.goal.currentAmount/d.goal.targetAmount)*100) : 0;

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link className={styles.brand} href="/"><img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM" /></Link>

        {!demo && householdId && households.length ? (
          <HouseholdSwitcher currentId={householdId} households={households} />
        ) : null}

        <nav className={styles.sidebarNav}>
          <a className={styles.activeLink} href="#resumo"><span>◫</span>Resumo</a>
          <a href="#transacoes"><span>↕</span>Transações</a>
          <a href="#categorias"><span>◌</span>Categorias</a>
          <a href="#metas"><span>◎</span>Metas</a>
          {showLogout ? <LogoutButton className={styles.logout} /> : null}
        </nav>

        <div className={styles.user}>
          <span>{initials(userName)}</span>
          <div><strong>{firstName}</strong><small>{userSubtitle}</small></div>
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.top}>
          <div>
            <p className={styles.eyebrow}>{month}</p>
            <h1>Olá, {firstName}.</h1>
            <p>{demo ? "Demonstração com dados de exemplo." : "Os números abaixo são calculados a partir dos registros desta Household."}</p>
          </div>
          {!demo ? <span className={styles.liveBadge}>● DADOS DO BANCO</span> : <span className={styles.demoBadge}>DEMONSTRAÇÃO</span>}
        </header>

        <section className={styles.summary} id="resumo">
          <article><span>Saldo consolidado</span><strong>{money(d.consolidatedBalance,d.currency)}</strong><small>{d.accountCount} conta(s) na moeda principal</small></article>
          <article><span>Receitas do mês</span><strong className={styles.positive}>{money(d.incomeMonth,d.currency)}</strong><small>Lançamentos confirmados</small></article>
          <article><span>Despesas do mês</span><strong className={styles.negative}>{money(d.expensesMonth,d.currency)}</strong><small>Somente transações oficiais</small></article>
          <article><span>Gastos em cartões</span><strong>{money(d.cardSpendMonth,d.currency)}</strong><small>{d.cardCount} cartão(ões) cadastrado(s)</small></article>
        </section>

        {d.ignoredCurrencyAccounts > 0 ? (
          <p className={styles.currencyNote}>Existem {d.ignoredCurrencyAccounts} conta(s) em outra moeda. Elas não são somadas ao saldo consolidado sem conversão cambial.</p>
        ) : null}

        <section className={styles.grid}>
          <article className={`${styles.panel} ${styles.wide}`} id="transacoes">
            <div className={styles.panelHead}><div><p>Movimentação</p><h2>Transações recentes</h2></div></div>
            {d.transactions.length ? (
              <div className={styles.transactions}>
                {d.transactions.map(t => {
                  const sign = t.type === "income" ? "+" : t.type === "expense" ? "−" : "↔";
                  const cls = t.type === "income" ? styles.positive : t.type === "expense" ? styles.negative : "";
                  return (
                    <div className={styles.transaction} key={t.id}>
                      <span className={styles.txIcon}>{t.type === "income" ? "↙" : t.type === "expense" ? "↗" : "↔"}</span>
                      <div>
                        <strong>{t.description}</strong>
                        <small>{[t.categoryName,t.accountName,t.cardName].filter(Boolean).join(" • ") || "Sem classificação"}</small>
                      </div>
                      <div className={styles.txValue}>
                        <strong className={cls}>{sign} {money(t.amount,t.currency)}</strong>
                        <small>{new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short"}).format(new Date(t.occurredAt))}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <div className={styles.empty}><strong>Nenhuma transação ainda.</strong><p>Quando houver lançamentos oficiais nesta Household, eles aparecerão aqui.</p></div>}
          </article>

          <article className={styles.panel} id="metas">
            <div className={styles.panelHead}><div><p>Objetivo</p><h2>{d.goal?.title ?? "Metas"}</h2></div>{d.goal ? <span>{goalPercent.toFixed(0)}%</span> : null}</div>
            {d.goal ? (
              <>
                <div className={styles.goalAmount}><strong>{money(d.goal.currentAmount,d.currency)}</strong><span>de {money(d.goal.targetAmount,d.currency)}</span></div>
                <div className={styles.progress}><i style={{width:`${goalPercent}%`}} /></div>
              </>
            ) : <div className={styles.empty}><strong>Nenhuma meta cadastrada.</strong><p>O dashboard não inventa objetivos: aqui entram apenas metas salvas no banco.</p></div>}
          </article>

          <article className={`${styles.panel} ${styles.wide}`} id="categorias">
            <div className={styles.panelHead}><div><p>Despesas do mês</p><h2>Gastos por categoria</h2></div></div>
            {d.categories.length ? (
              <div className={styles.categories}>
                {d.categories.map(c => (
                  <div className={styles.category} key={c.name}>
                    <div><strong>{c.name}</strong><span>{money(c.value,d.currency)}</span></div>
                    <div className={styles.progress}><i style={{width:`${c.percent}%`}} /></div>
                    <span>{c.percent.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            ) : <div className={styles.empty}><strong>Sem despesas categorizadas neste mês.</strong><p>Assim que existirem registros, a distribuição será calculada automaticamente.</p></div>}
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHead}><div><p>Estrutura</p><h2>Household</h2></div></div>
            <div className={styles.structure}>
              <div><strong>{d.accountCount}</strong><span>Contas</span></div>
              <div><strong>{d.cardCount}</strong><span>Cartões</span></div>
              <div><strong>{d.transactions.length}</strong><span>Recentes</span></div>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
