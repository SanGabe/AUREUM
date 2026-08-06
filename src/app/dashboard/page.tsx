import Link from "next/link";
import { SummaryCard } from "@/components/summary-card";

const transactions = [
  {
    description: "Mercado São Luiz",
    category: "Alimentação",
    account: "Nubank",
    value: "− R$ 186,42",
  },
  {
    description: "Salário",
    category: "Receita",
    account: "XP",
    value: "+ R$ 2.702,00",
  },
  {
    description: "Steam",
    category: "Jogos",
    account: "XP Visa",
    value: "− R$ 74,90",
  },
  {
    description: "Reserva Portugal",
    category: "Meta",
    account: "XP",
    value: "− R$ 500,00",
  },
];

const categories = [
  { name: "Moradia", percent: 74, value: "R$ 1.480" },
  { name: "Alimentação", percent: 58, value: "R$ 696" },
  { name: "Transporte", percent: 36, value: "R$ 288" },
  { name: "Lazer", percent: 22, value: "R$ 132" },
];

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <Link className="brand brand-dashboard" href="/">
          <span className="brand-mark">F</span>
          <span>Fluxo</span>
        </Link>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <a className="sidebar-link sidebar-link-active" href="#resumo">
            <span>◫</span> Resumo
          </a>
          <a className="sidebar-link" href="#transacoes">
            <span>↕</span> Transações
          </a>
          <a className="sidebar-link" href="#cartoes">
            <span>▣</span> Cartões
          </a>
          <a className="sidebar-link" href="#metas">
            <span>◎</span> Metas
          </a>
          <a className="sidebar-link" href="#importacoes">
            <span>⇧</span> Importações
          </a>
        </nav>

        <div className="sidebar-footer">
          <span className="avatar">GC</span>
          <div>
            <strong>Gabriel</strong>
            <small>Conta do casal</small>
          </div>
        </div>
      </aside>

      <section className="dashboard-content" id="resumo">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow dashboard-eyebrow">AGOSTO DE 2026</p>
            <h1>Boa noite, Gabriel.</h1>
            <p>Esta é uma demonstração visual com dados fictícios.</p>
          </div>
          <button className="button button-primary" type="button">
            + Nova transação
          </button>
        </header>

        <section className="summary-grid" aria-label="Resumo financeiro">
          <SummaryCard
            label="Saldo consolidado"
            value="R$ 20.418,73"
            detail="Contas e reservas"
            tone="positive"
          />
          <SummaryCard
            label="Receitas do mês"
            value="R$ 4.702,00"
            detail="2 lançamentos confirmados"
            tone="positive"
          />
          <SummaryCard
            label="Despesas do mês"
            value="R$ 2.596,44"
            detail="55,2% das receitas"
            tone="negative"
          />
          <SummaryCard
            label="Próximas faturas"
            value="R$ 1.347,80"
            detail="Nubank e XP Visa"
          />
        </section>

        <section className="dashboard-grid">
          <article className="panel panel-wide" id="transacoes">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">MOVIMENTAÇÃO</p>
                <h2>Transações recentes</h2>
              </div>
              <button className="text-button" type="button">
                Ver todas
              </button>
            </div>

            <div className="transaction-list">
              {transactions.map((transaction) => (
                <div className="transaction-row" key={transaction.description}>
                  <span className="transaction-icon">
                    {transaction.value.startsWith("+") ? "↙" : "↗"}
                  </span>
                  <div className="transaction-description">
                    <strong>{transaction.description}</strong>
                    <small>
                      {transaction.category} • {transaction.account}
                    </small>
                  </div>
                  <strong
                    className={
                      transaction.value.startsWith("+")
                        ? "value-positive"
                        : "value-negative"
                    }
                  >
                    {transaction.value}
                  </strong>
                </div>
              ))}
            </div>
          </article>

          <article className="panel" id="metas">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">OBJETIVO PRINCIPAL</p>
                <h2>Portugal</h2>
              </div>
              <span className="goal-percentage">57%</span>
            </div>
            <div className="goal-amount">
              <strong>R$ 20.000</strong>
              <span>de R$ 35.000</span>
            </div>
            <div className="progress-track" aria-label="Meta 57% concluída">
              <div className="progress-value" style={{ width: "57%" }} />
            </div>
            <p className="panel-note">
              Mantendo o ritmo atual, a meta será alcançada antes da mudança.
            </p>
          </article>

          <article className="panel panel-wide" id="cartoes">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">ORÇAMENTO</p>
                <h2>Gastos por categoria</h2>
              </div>
              <span className="panel-note">Planejado x realizado</span>
            </div>

            <div className="category-list">
              {categories.map((category) => (
                <div className="category-row" key={category.name}>
                  <div className="category-label">
                    <strong>{category.name}</strong>
                    <span>{category.value}</span>
                  </div>
                  <div className="progress-track progress-track-small">
                    <div
                      className="progress-value"
                      style={{ width: `${category.percent}%` }}
                    />
                  </div>
                  <span>{category.percent}%</span>
                </div>
              ))}
            </div>
          </article>

          <article className="panel import-panel" id="importacoes">
            <span className="import-icon">⇧</span>
            <p className="panel-kicker">CENTRAL DE IMPORTAÇÕES</p>
            <h2>Faturas e extratos</h2>
            <p>
              Envie os documentos pelo site, revise os lançamentos e só então
              confirme a importação.
            </p>
            <button className="button button-secondary" type="button">
              Importar arquivo
            </button>
          </article>
        </section>
      </section>

      <nav className="mobile-nav" aria-label="Navegação móvel">
        <a href="#resumo">Resumo</a>
        <a href="#transacoes">Transações</a>
        <a href="#cartoes">Cartões</a>
        <a href="#metas">Metas</a>
      </nav>
    </main>
  );
}
