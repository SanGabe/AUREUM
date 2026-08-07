import Link from "next/link";
import styles from "./landing.module.css";

function BrandName({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? styles.brandNameCompact : styles.brandName}>
      <span className={styles.brandGold}>AU</span>
      <span>RE</span>
      <span className={styles.brandGold}>UM</span>
    </span>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 19 6v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 18H6a4 4 0 0 1-.5-8A6 6 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 9H16" />
      <path d="M12 12v9m0-9-3 3m3-3 3 3" />
    </svg>
  );
}

const pillars = [
  {
    key: "AMOR",
    symbol: "♡",
    title: "Cuidar do que importa",
    copy:
      "Organize o que é seu, o que é da sua casa e o que constrói o futuro de quem você ama.",
  },
  {
    key: "ORDO",
    symbol: "⌂",
    title: "Ordem que gera liberdade",
    copy:
      "Tenha método, estrutura e controle para entender seu dinheiro e tomar decisões melhores.",
  },
  {
    key: "PROGRESSUS",
    symbol: "↗",
    title: "Evolução constante",
    copy:
      "Acompanhe metas, construa patrimônio e avance com consistência rumo aos seus objetivos.",
  },
];

const problems = [
  "Informações dispersas",
  "Falta de visão do todo",
  "Esquecimento de contas",
  "Dificuldade para planejar",
];

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label="AUREUM">
          <span className={styles.logoBird}>
            <img src="/brand/aureum-ararinha.png" alt="" aria-hidden="true" />
          </span>
          <span className={styles.logoText}>
            <BrandName />
            <small>AMOR • ORDO • PROGRESSUS</small>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Navegação principal">
          <a href="#recursos">Recursos</a>
          <a href="#para-quem">Para quem</a>
          <a href="#seguranca">Segurança</a>
          <a href="#historia">Sobre nós</a>
          <Link href="/demonstracao">Demonstração</Link>
        </nav>

        <div className={styles.headerActions}>
          <Link href="/cadastrar" className={styles.headerPrimary}>
            Criar minha conta
          </Link>
          <Link href="/entrar" className={styles.headerSecondary}>
            Entrar
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>
            <BrandName compact /> • AMOR • ORDO • PROGRESSUS
          </p>

          <h1>
            Seu app de finanças <span>unificado.</span>
          </h1>

          <p className={styles.brandThesis}>
            O valor do <strong>AU</strong>. O poder de <strong>UM</strong>.
          </p>

          <p className={styles.heroDescription}>
            Contas, cartões, metas, faturas, extratos e a vida financeira da
            sua casa conectados em uma experiência clara, elegante e feita
            para evoluir com você.
          </p>

          <div className={styles.heroButtons}>
            <Link href="/cadastrar" className={styles.primaryButton}>
              Criar minha conta <span>→</span>
            </Link>
            <Link href="/demonstracao" className={styles.demoButton}>
              <span className={styles.play}>▶</span>
              Ver demonstração
            </Link>
          </div>

          <div className={styles.trustRow} id="seguranca">
            <div>
              <span className={styles.trustIcon}><ShieldIcon /></span>
              <p>Seus dados protegidos<br />com segurança de ponta</p>
            </div>
            <div>
              <span className={styles.trustIcon}><LockIcon /></span>
              <p>Privacidade por padrão<br />e sob seu controle</p>
            </div>
            <div>
              <span className={styles.trustIcon}><CloudIcon /></span>
              <p>Integrações para reduzir<br />trabalho manual</p>
            </div>
          </div>
        </div>

        <div className={styles.productVisual} aria-label="Prévia do AUREUM">
          <img
            className={styles.heroBirdOutline}
            src="/brand/aureum-ararinha.png"
            alt=""
            aria-hidden="true"
          />

          <div className={styles.phone}>
            <div className={styles.phoneTop}>
              <span className={styles.miniBird}>A</span>
              <BrandName compact />
              <span>☰</span>
            </div>
            <p className={styles.phoneTitle}>Visão geral</p>
            <div className={styles.mobileBalance}>
              <small>Saldo total</small>
              <strong>R$ 24.680,50</strong>
              <span>+12,5% vs mês anterior</span>
            </div>
            <div className={styles.mobileMetric}>
              <span>Contas</span><strong>R$ 14.150,00</strong>
            </div>
            <div className={styles.mobileMetric}>
              <span>Cartões</span><strong>R$ 2.250,00</strong>
            </div>
            <div className={styles.mobileMetric}>
              <span>Investimentos</span><strong>R$ 12.580,50</strong>
            </div>
            <div className={styles.mobileChart}>
              <div className={styles.donut} />
              <div>
                <small>Mercado 32%</small>
                <small>Moradia 24%</small>
                <small>Lazer 15%</small>
              </div>
            </div>
          </div>

          <div className={styles.laptop}>
            <div className={styles.laptopScreen}>
              <p className={styles.screenTitle}>Fluxo de caixa</p>
              <div className={styles.screenGrid}>
                <div className={styles.chartPanel}>
                  <div className={styles.fakeChart}>
                    <span style={{ height: "30%" }} />
                    <span style={{ height: "48%" }} />
                    <span style={{ height: "42%" }} />
                    <span style={{ height: "66%" }} />
                    <span style={{ height: "58%" }} />
                    <span style={{ height: "78%" }} />
                    <span style={{ height: "62%" }} />
                    <span style={{ height: "82%" }} />
                  </div>
                  <div className={styles.months}>
                    <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                  </div>
                </div>
                <div className={styles.sideMetrics}>
                  <div><small>Receitas</small><strong>R$ 18.950,00</strong></div>
                  <div><small>Despesas</small><strong>R$ 13.420,00</strong></div>
                  <div className={styles.goalsMini}>
                    <small>Metas</small>
                    <p><span>Viagem</span><b>75%</b></p>
                    <i><em style={{ width: "75%" }} /></i>
                    <p><span>Reserva</span><b>60%</b></p>
                    <i><em style={{ width: "60%" }} /></i>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.laptopBase} />
          </div>
        </div>
      </section>

      <section className={styles.problemCard} id="recursos">
        <div className={styles.stone}>
          <div className={styles.stoneGrid}>
            <span /><span /><span />
            <span /><span /><span />
            <span /><span /><span />
          </div>
          <div className={styles.stoneNote}>
            <i /><i /><i /><i />
          </div>
          <div className={styles.stonePencil}>／</div>
        </div>

        <div className={styles.problemContent}>
          <p className={styles.sectionLabel}>O PROBLEMA</p>
          <h2>Saia da idade da pedra financeira.</h2>
          <p>
            Planilhas perdidas, anotações espalhadas, faturas difíceis de
            acompanhar e decisões tomadas sem clareza. Improvisar custa caro.
          </p>

          <div className={styles.problemList}>
            {problems.map((problem) => (
              <div key={problem}>
                <span>×</span>
                <p>{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.solution} id="para-quem">
        <p className={styles.solutionTitle}>A SOLUÇÃO: ORDEM, CLAREZA E PROGRESSO</p>
        <div className={styles.pillars}>
          {pillars.map((pillar) => (
            <article key={pillar.key} className={styles.pillar}>
              <div className={styles.pillarIcon}>{pillar.symbol}</div>
              <div>
                <h3>{pillar.key}</h3>
                <strong>{pillar.title}</strong>
                <p>{pillar.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.story} id="historia">
        <div className={styles.sealWrap}>
          <img src="/brand/aureum-seal.png" alt="Selo institucional AUREUM" />
        </div>

        <div className={styles.storyContent}>
          <p className={styles.sectionLabel}>NOSSA HISTÓRIA</p>
          <h2>Valor para o que importa. Ordem para o que é seu. Progresso para o que vem.</h2>
          <p>
            AUREUM une referências clássicas, identidade brasileira e tecnologia.
            <strong> AU</strong> remete ao ouro — valor, patrimônio e solidez.
            <strong> UM</strong> traduz a proposta do produto: sua vida financeira
            conectada em um único lugar.
          </p>

          <div className={styles.storyFeatures}>
            <div><span>◇</span><p>Confiança e<br />transparência</p></div>
            <div><span>⌂</span><p>Tradição que<br />inspira</p></div>
            <div><span>☆</span><p>Excelência em<br />cada detalhe</p></div>
            <div><span>↗</span><p>Tecnologia que<br />impulsiona</p></div>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.ctaBird}>
          <img src="/brand/aureum-ararinha.png" alt="" aria-hidden="true" />
        </div>
        <div>
          <h2>Chegou a hora de elevar sua vida financeira.</h2>
          <p>
            O AUREUM transforma a forma como você organiza, acompanha e
            constrói seu futuro financeiro.
          </p>
        </div>
        <Link href="/cadastrar" className={styles.primaryButton}>
          Criar minha conta <span>→</span>
        </Link>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <span className={styles.logoBird}>
            <img src="/brand/aureum-ararinha.png" alt="" aria-hidden="true" />
          </span>
          <div>
            <BrandName />
            <small>O valor do AU. O poder de UM.</small>
          </div>
        </div>

        <div>
          <strong>Produto</strong>
          <Link href="/demonstracao">Demonstração</Link>
          <a href="#recursos">Recursos</a>
        </div>
        <div>
          <strong>Conta</strong>
          <Link href="/cadastrar">Criar conta</Link>
          <Link href="/entrar">Entrar</Link>
        </div>
        <div>
          <strong>AUREUM</strong>
          <a href="#historia">Nossa história</a>
          <span>Amor • Ordo • Progressus</span>
        </div>

        <p className={styles.copyright}>
          © {year} AUREUM. Todos os direitos reservados.
        </p>
      </footer>
    </main>
  );
}
