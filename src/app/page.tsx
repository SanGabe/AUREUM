import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Registros rápidos",
    description:
      "Lançamentos e consultas pelo WhatsApp, sem transformar a conversa em uma planilha.",
  },
  {
    number: "02",
    title: "Conferência segura",
    description:
      "Faturas e extratos enviados e revisados pelo site antes de entrarem no controle financeiro.",
  },
  {
    number: "03",
    title: "Visão do casal",
    description:
      "Contas individuais e compartilhadas, metas, parcelamentos e responsabilidades em um só lugar.",
  },
];

export default function Home() {
  return (
    <main className="landing-shell">
      <nav className="topbar container">
        <Link className="brand" href="/" aria-label="Página inicial do Fluxo">
          <span className="brand-mark">F</span>
          <span>Fluxo</span>
        </Link>
        <Link className="nav-link" href="/dashboard">
          Ver demonstração
        </Link>
      </nav>

      <section className="hero container">
        <div className="eyebrow">MVP • FINANÇAS PESSOAIS E DO CASAL</div>
        <h1>Menos trabalho para registrar. Mais clareza para decidir.</h1>
        <p className="hero-copy">
          Um assistente financeiro que reúne contas, cartões, metas, faturas,
          extratos, WhatsApp e Google Sheets em uma experiência simples.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/dashboard">
            Abrir dashboard
          </Link>
          <a className="button button-secondary" href="#produto">
            Conhecer o produto
          </a>
        </div>
      </section>

      <section className="feature-grid container" id="produto">
        {features.map((feature) => (
          <article className="feature-card" key={feature.number}>
            <span>{feature.number}</span>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="status-panel container">
        <div>
          <div className="status-dot" aria-hidden="true" />
          <p className="status-label">Primeira entrega</p>
          <h2>Fundação publicada na Vercel</h2>
        </div>
        <p>
          Nesta etapa validamos deploy, navegação responsiva e rota de saúde.
          A próxima entrega conecta autenticação e banco de dados no Supabase.
        </p>
      </section>

      <footer className="footer container">
        <span>Fluxo Financeiro</span>
        <span>Projeto de portfólio • 2026</span>
      </footer>
    </main>
  );
}
