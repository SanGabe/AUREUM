import Link from "next/link";

const features = [
  { number: "01", title: "Registros rápidos", description: "Lançamentos e consultas pelo WhatsApp, sem transformar a conversa em uma planilha." },
  { number: "02", title: "Conferência segura", description: "Faturas e extratos enviados e revisados pelo site antes de entrarem no controle financeiro." },
  { number: "03", title: "Visão do casal", description: "Contas individuais e compartilhadas, metas, parcelamentos e responsabilidades em um só lugar." },
];

export default function Home() {
  return (
    <main className="landing-shell">
      <nav className="topbar container">
        <Link className="brand" href="/" aria-label="Página inicial do AUREUM">
          <img className="brand-image" src="/brand/aureum-wordmark.png" alt="AUREUM" />
        </Link>
        <Link className="nav-link" href="/entrar">Entrar</Link>
      </nav>

      <section className="hero container hero-brand-panel">
        <div>
          <div className="eyebrow brand-kicker">AUREUM • AMOR • ORDO • PROGRESSUS</div>
          <h1>Menos trabalho para registrar. Mais clareza para decidir.</h1>
          <p className="hero-copy">Um assistente financeiro que reúne contas, cartões, metas, faturas, extratos, WhatsApp e Google Sheets em uma experiência simples.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/cadastrar">Criar minha conta</Link>
            <Link className="button button-secondary" href="/demonstracao">Ver demonstração</Link>
          </div>
        </div>
        <img className="hero-seal" src="/brand/aureum-seal.png" alt="Selo institucional AUREUM" />
      </section>

      <section className="feature-grid container" id="produto">
        {features.map((feature) => (
          <article className="feature-card" key={feature.number}>
            <span>{feature.number}</span><h2>{feature.title}</h2><p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="status-panel container">
        <div>
          <div className="status-dot" aria-hidden="true" />
          <p className="status-label">Identidade AUREUM</p>
          <h2>Uma experiência financeira com identidade própria.</h2>
        </div>
        <p>Azul profundo, ouro, referências clássicas e elementos brasileiros passam a orientar a linguagem visual do produto.</p>
      </section>

      <footer className="footer container">
        <span>AUREUM</span><span>Amor • Ordo • Progressus</span>
      </footer>
    </main>
  );
}
