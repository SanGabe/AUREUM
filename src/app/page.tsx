import Link from "next/link";
import styles from "./landing.module.css";

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 19 6v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function IconCloud() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 18H6a4 4 0 0 1-.5-8A6 6 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 9H16" />
      <path d="M12 12v9m0-9-3 3m3-3 3 3" />
    </svg>
  );
}

function IconBadge({ kind }: { kind: "shield" | "temple" | "star" | "rocket" }) {
  if (kind === "shield") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 4 25 8v7c0 6-3.7 10.5-9 13-5.3-2.5-9-7-9-13V8l9-4Z" />
        <circle cx="16" cy="15" r="3" />
      </svg>
    );
  }

  if (kind === "temple") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m4 11 12-7 12 7H4Zm3 3h18M8 14v11m5-11v11m6-11v11m5-11v11M5 28h22" />
      </svg>
    );
  }

  if (kind === "star") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m16 4 3.4 7 7.6 1.1-5.5 5.4 1.3 7.5-6.8-3.6-6.8 3.6 1.3-7.5L5 12.1l7.6-1.1L16 4Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M19 5c4.8.4 7.6 2 9 3.5-1 5.3-3.8 9.7-8.3 13.3l-5.6-5.6C16 11.7 17.6 8 19 5Z" />
      <path d="m13.8 16.4-5.7.9-3.2 3.2 6.5.8m4.2-4.9-.9 5.7-3.2 3.2-.8-6.5" />
      <circle cx="22" cy="11" r="2" />
    </svg>
  );
}

function HeroDevices() {
  return (
    <div className={styles.devicesWrap} aria-label="Prévia do dashboard AUREUM">
      <div className={styles.heroBirdHalo} aria-hidden="true">
        <img src="/brand/aureum-emblem-hq.png" alt="" />
      </div>

      <div className={styles.phone}>
        <div className={styles.phoneNotch} />
        <div className={styles.phoneContent}>
          <div className={styles.phoneBrand}>
            <span>AUREUM</span>
            <b>☰</b>
          </div>
          <h3>Visão geral</h3>
          <div className={styles.balanceCard}>
            <span>Saldo total</span>
            <strong>R$ 24.680,50</strong>
            <small>+12,5% vs mês anterior</small>
          </div>
          <div className={styles.miniAccount}>
            <i className={styles.goldDot} />
            <span>Contas</span>
            <strong>R$ 14.150,00</strong>
          </div>
          <div className={styles.miniAccount}>
            <i className={styles.redDot} />
            <span>Cartões</span>
            <strong>R$ 2.250,00</strong>
          </div>
          <div className={styles.miniAccount}>
            <i className={styles.greenDot} />
            <span>Investimentos</span>
            <strong>R$ 12.580,50</strong>
          </div>
          <div className={styles.categoryCard}>
            <div className={styles.donut} />
            <div>
              <span>Despesas por categoria</span>
              <small>Mercado&nbsp;&nbsp;32%</small>
              <small>Moradia&nbsp;&nbsp;24%</small>
              <small>Lazer&nbsp;&nbsp;15%</small>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.laptop}>
        <div className={styles.laptopScreen}>
          <div className={styles.screenBrand}>AUREUM</div>
          <div className={styles.screenHeader}>Fluxo de caixa</div>
          <div className={styles.screenLayout}>
            <div className={styles.cashChart}>
              <svg viewBox="0 0 320 175" role="img" aria-label="Gráfico de fluxo de caixa">
                <g className={styles.gridLines}>
                  <path d="M22 25H310M22 62H310M22 99H310M22 136H310" />
                  <path d="M63 16V148M108 16V148M153 16V148M198 16V148M243 16V148M288 16V148" />
                </g>
                <path
                  className={styles.chartGlow}
                  d="M25 128 55 106 82 112 112 80 141 69 170 91 197 111 225 89 255 55 282 72 307 50"
                />
                <path
                  className={styles.chartLine}
                  d="M25 128 55 106 82 112 112 80 141 69 170 91 197 111 225 89 255 55 282 72 307 50"
                />
              </svg>
              <div className={styles.chartMonths}>
                <span>Jan</span><span>Fev</span><span>Mar</span>
                <span>Abr</span><span>Mai</span><span>Jun</span>
              </div>
            </div>

            <div className={styles.screenMetrics}>
              <div>
                <span>Receitas</span>
                <strong className={styles.income}>R$ 18.950,00</strong>
              </div>
              <div>
                <span>Despesas</span>
                <strong className={styles.expense}>R$ 13.420,00</strong>
              </div>
              <div className={styles.goalsCard}>
                <span>Metas</span>
                <p><b>Viagem em família</b><em>75%</em></p>
                <i><u style={{ width: "75%" }} /></i>
                <p><b>Reserva de emergência</b><em>60%</em></p>
                <i><u style={{ width: "60%" }} /></i>
                <p><b>Casa nova</b><em>30%</em></p>
                <i><u style={{ width: "30%" }} /></i>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.laptopBase}>
          <span />
        </div>
      </div>
    </div>
  );
}

const problems = [
  "Informações dispersas",
  "Falta de visão do todo",
  "Esquecimento de contas",
  "Dificuldade para planejar e decidir",
];

const pillars = [
  {
    title: "AMOR",
    subtitle: "Cuidar do que importa",
    text: "Organize o que é seu, o que é da sua casa e o que constrói o futuro de quem você ama.",
    asset: "/brand/aureum-heart-hq.png",
  },
  {
    title: "ORDO",
    subtitle: "Ordem que gera liberdade",
    text: "Tenha método, estrutura e controle para entender seu dinheiro e tomar decisões melhores.",
    asset: "/brand/aureum-column-hq.png",
  },
  {
    title: "PROGRESSUS",
    subtitle: "Evolução constante",
    text: "Acompanhe metas, construa patrimônio e avance com consistência rumo aos seus objetivos.",
    asset: "/brand/aureum-laurel-hq.png",
  },
];

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.headerLogo} href="/" aria-label="AUREUM">
          <img src="/brand/aureum-logo-hq.png" alt="AUREUM" />
        </Link>

        <nav className={styles.nav} aria-label="Navegação principal">
          <a href="#recursos">Recursos</a>
          <a href="#para-quem">Para quem</a>
          <a href="#seguranca">Segurança</a>
          <a href="#historia">Sobre nós</a>
          <Link href="/demonstracao">Demonstração</Link>
        </nav>

        <div className={styles.headerActions}>
          <Link className={styles.headerPrimary} href="/cadastrar">
            Criar minha conta
          </Link>
          <Link className={styles.headerSecondary} href="/entrar">
            Entrar
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>AUREUM • AMOR • ORDO • PROGRESSUS</p>
          <h1>Saia da idade da pedra das finanças pessoais.</h1>
          <p className={styles.heroText}>
            Deixe para trás planilhas soltas, anotações no papel e informações
            espalhadas. O AUREUM organiza contas, cartões, metas e a vida financeira
            da casa em uma experiência clara, elegante e moderna.
          </p>

          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/cadastrar">
              Criar minha conta <span>→</span>
            </Link>
            <Link className={styles.secondaryButton} href="/demonstracao">
              <span className={styles.playButton}>▶</span>
              Ver demonstração
            </Link>
          </div>

          <div className={styles.trustRow} id="seguranca">
            <div>
              <span className={styles.trustIcon}><IconShield /></span>
              <p>Seus dados protegidos<br />com segurança de ponta</p>
            </div>
            <div>
              <span className={styles.trustIcon}><IconLock /></span>
              <p>Privacidade por padrão<br />e sob seu controle</p>
            </div>
            <div>
              <span className={styles.trustIcon}><IconCloud /></span>
              <p>Sincronize com<br />Google Sheets</p>
            </div>
          </div>
        </div>

        <HeroDevices />
      </section>

      <section className={styles.problemCard} id="recursos">
        <div className={styles.stoneArea}>
          <img
            src="/brand/aureum-stone-hq.png"
            alt="Pedra simbolizando planilhas e anotações antigas"
          />
        </div>

        <div className={styles.problemContent}>
          <p className={styles.sectionKicker}>O PROBLEMA</p>
          <h2>Improvisar custa caro.</h2>
          <p className={styles.bodyText}>
            Planilhas perdidas, anotações espalhadas, faturas difíceis de acompanhar
            e decisões tomadas sem clareza. Essa é a idade da pedra financeira.
          </p>

          <div className={styles.problemGrid}>
            {problems.map((item) => (
              <div className={styles.problemItem} key={item}>
                <span>×</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.solution} id="para-quem">
        <p className={styles.solutionTitle}>A SOLUÇÃO: ORDEM, CLAREZA E PROGRESSO</p>

        <div className={styles.pillars}>
          {pillars.map((pillar) => (
            <article className={styles.pillarCard} key={pillar.title}>
              <div className={styles.pillarAsset}>
                <img src={pillar.asset} alt="" aria-hidden="true" />
              </div>
              <div className={styles.pillarCopy}>
                <h3>{pillar.title}</h3>
                <strong>{pillar.subtitle}</strong>
                <p>{pillar.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.story} id="historia">
        <div className={styles.sealArea}>
          <img src="/brand/aureum-seal.png" alt="Selo institucional AUREUM" />
        </div>

        <div className={styles.storyCopy}>
          <p className={styles.sectionKicker}>NOSSA HISTÓRIA</p>
          <h2>Inspirado em inteligência, construção e progresso.</h2>
          <p className={styles.bodyText}>
            AUREUM carrega um espírito de sofisticação, organização e visão de longo
            prazo. Uma marca que honra nossas raízes, valoriza o conhecimento e usa a
            tecnologia para construir um futuro financeiro mais sólido para você e sua família.
          </p>

          <div className={styles.storyFeatures}>
            <div>
              <span><IconBadge kind="shield" /></span>
              <p>Confiança e<br />transparência</p>
            </div>
            <div>
              <span><IconBadge kind="temple" /></span>
              <p>Tradição que<br />inspira</p>
            </div>
            <div>
              <span><IconBadge kind="star" /></span>
              <p>Excelência em<br />cada detalhe</p>
            </div>
            <div>
              <span><IconBadge kind="rocket" /></span>
              <p>Tecnologia que<br />impulsiona</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.finalEmblem}>
          <img src="/brand/aureum-emblem-hq.png" alt="" aria-hidden="true" />
        </div>
        <div className={styles.finalText}>
          <h2>Chegou a hora de elevar sua vida financeira.</h2>
          <p>
            AUREUM está aqui para transformar a forma como você organiza, acompanha
            e faz seu dinheiro trabalhar a seu favor.
          </p>
        </div>
        <Link className={styles.primaryButton} href="/cadastrar">
          Criar minha conta <span>→</span>
        </Link>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM — Amor, Ordo, Progressus" />
        </div>

        <div className={styles.footerColumn}>
          <strong>Produto</strong>
          <a href="#recursos">Recursos</a>
          <span>Preços</span>
          <Link href="/demonstracao">Demonstração</Link>
        </div>

        <div className={styles.footerColumn}>
          <strong>Empresa</strong>
          <a href="#historia">Sobre nós</a>
          <a href="#seguranca">Segurança</a>
          <span>Contato</span>
        </div>

        <div className={styles.footerColumn}>
          <strong>Suporte</strong>
          <span>Central de ajuda</span>
          <span>Privacidade</span>
          <span>Termos de uso</span>
        </div>

        <div className={styles.social}>
          <strong>Siga-nos</strong>
          <div>
            <span>◎</span>
            <span>▶</span>
            <span>in</span>
          </div>
        </div>

        <p className={styles.copyright}>
          © {year} AUREUM. Todos os direitos reservados.
        </p>
      </footer>
    </main>
  );
}
