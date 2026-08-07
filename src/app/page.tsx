import Link from "next/link";
import styles from "./landing.module.css";

const capabilities = [
  {
    number: "01",
    title: "Registre sem atrito",
    description:
      "Centralize contas, cartões, metas, faturas e lançamentos sem depender de uma coleção de planilhas e anotações.",
  },
  {
    number: "02",
    title: "Controle com confiança",
    description:
      "Informações importadas podem ser conferidas antes de virarem dados oficiais. Menos ruído, mais segurança para decidir.",
  },
  {
    number: "03",
    title: "Compartilhe com regras",
    description:
      "Organize a vida financeira da Household com acessos de membro, colaborador financeiro e administrador.",
  },
];

const pillars = [
  {
    latin: "AMOR",
    title: "Cuidar do que importa",
    description:
      "Dinheiro não é só número. É casa, família, escolhas, tranquilidade e os planos de quem caminha com você.",
    symbol: "♡",
  },
  {
    latin: "ORDO",
    title: "Ordem que liberta",
    description:
      "Transforme informação espalhada em estrutura, contexto e uma visão financeira que realmente faça sentido.",
    symbol: "◫",
  },
  {
    latin: "PROGRESSUS",
    title: "Progresso com direção",
    description:
      "Acompanhe objetivos, reconheça padrões e avance com decisões mais conscientes — uma conquista de cada vez.",
    symbol: "↗",
  },
];

export default function Home() {
  return (
    <main className={styles.shell}>
      <nav className={styles.nav}>
        <Link
          className={styles.brand}
          href="/"
          aria-label="Página inicial do AUREUM"
        >
          <img
            className={styles.brandBird}
            src="/brand/aureum-ararinha.png"
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.brandWordmark}
            src="/brand/aureum-wordmark.png"
            alt="AUREUM"
          />
        </Link>

        <div className={styles.navLinks}>
          <a href="#produto">Produto</a>
          <a href="#manifesto">Manifesto</a>
          <a href="#historia">A marca</a>
        </div>

        <Link className={styles.login} href="/entrar">
          Entrar
        </Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>
            AUREUM <span>•</span> AMOR <span>•</span> ORDO <span>•</span>{" "}
            PROGRESSUS
          </div>

          <h1>
            Saia da idade da pedra das{" "}
            <em>finanças pessoais.</em>
          </h1>

          <p className={styles.lead}>
            Deixe para trás planilhas soltas, anotações no papel e informações
            espalhadas. O AUREUM reúne sua vida financeira em uma experiência
            clara, elegante e feita para evoluir com você.
          </p>

          <div className={styles.actions}>
            <Link className={styles.primaryButton} href="/cadastrar">
              Criar minha conta <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.secondaryButton} href="/demonstracao">
              Ver demonstração
            </Link>
          </div>

          <div className={styles.heroProof}>
            <span>Contas + cartões + metas</span>
            <span>Household com permissões</span>
            <span>Dados sob seu controle</span>
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="Identidade AUREUM">
          <div className={styles.orbitOuter} aria-hidden="true" />
          <div className={styles.orbitInner} aria-hidden="true" />

          <div className={styles.birdFrame}>
            <img
              src="/brand/aureum-ararinha.png"
              alt="Ararinha, símbolo brasileiro do AUREUM"
            />
          </div>

          <div className={`${styles.floatCard} ${styles.floatTop}`}>
            <small>UMA CASA</small>
            <strong>Uma visão financeira.</strong>
          </div>

          <div className={`${styles.floatCard} ${styles.floatBottom}`}>
            <small>DO IMPROVISO</small>
            <strong>À clareza.</strong>
          </div>
        </div>
      </section>

      <section className={styles.eraSection} id="manifesto">
        <div className={styles.sectionIntro}>
          <span className={styles.sectionKicker}>MUDANÇA DE ERA</span>
          <h2>O papel foi brilhante. A planilha foi um avanço.</h2>
          <p>
            Mas uma vida financeira compartilhada, cheia de contas, cartões,
            objetivos e responsabilidades já pede uma ferramenta que conecte
            tudo isso.
          </p>
        </div>

        <div className={styles.timeline}>
          <article className={styles.timelineStep}>
            <span className={styles.timelineNumber}>I</span>
            <div>
              <small>ONTEM</small>
              <h3>Papel e memória</h3>
              <p>Anotações espalhadas e informações que dependem de lembrar onde ficaram.</p>
            </div>
          </article>

          <div className={styles.timelineArrow} aria-hidden="true">→</div>

          <article className={styles.timelineStep}>
            <span className={styles.timelineNumber}>II</span>
            <div>
              <small>DEPOIS</small>
              <h3>Planilhas</h3>
              <p>Mais organização, mas ainda manual, fragmentada e difícil de manter em conjunto.</p>
            </div>
          </article>

          <div className={styles.timelineArrow} aria-hidden="true">→</div>

          <article className={`${styles.timelineStep} ${styles.timelineActive}`}>
            <span className={styles.timelineNumber}>A</span>
            <div>
              <small>AGORA</small>
              <h3>AUREUM</h3>
              <p>Uma camada única de organização, colaboração, controle e evolução financeira.</p>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.productSection} id="produto">
        <div className={styles.sectionHeadingRow}>
          <div>
            <span className={styles.sectionKicker}>O PRODUTO</span>
            <h2>Menos esforço para registrar.<br />Mais contexto para decidir.</h2>
          </div>
          <p>
            O AUREUM não quer ser outra planilha bonita. Ele organiza o fluxo
            financeiro em torno da forma como pessoas e famílias realmente
            tomam decisões.
          </p>
        </div>

        <div className={styles.capabilityGrid}>
          {capabilities.map((capability) => (
            <article className={styles.capabilityCard} key={capability.number}>
              <span>{capability.number}</span>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pillarsSection}>
        <div className={styles.pillarsTitle}>
          <span className={styles.sectionKicker}>O PRINCÍPIO</span>
          <h2>Amor. Ordem. Progresso.</h2>
          <p>
            Três palavras que deixam de ser apenas um lema e passam a orientar
            a experiência do produto.
          </p>
        </div>

        <div className={styles.pillarGrid}>
          {pillars.map((pillar) => (
            <article className={styles.pillarCard} key={pillar.latin}>
              <div className={styles.pillarSymbol} aria-hidden="true">
                {pillar.symbol}
              </div>
              <span>{pillar.latin}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.storySection} id="historia">
        <div className={styles.sealPanel}>
          <div className={styles.sealGlow} aria-hidden="true" />
          <img
            src="/brand/aureum-seal.png"
            alt="Selo institucional do AUREUM"
          />
        </div>

        <div className={styles.storyCopy}>
          <span className={styles.sectionKicker}>NOSSA IDENTIDADE</span>
          <h2>Raízes brasileiras. Visão de longo prazo.</h2>
          <p>
            A identidade do AUREUM combina referências clássicas, construção,
            conhecimento e progresso com símbolos brasileiros. O selo
            institucional representa a camada histórica da marca; a ararinha,
            sua face mais viva, próxima e reconhecível.
          </p>

          <blockquote>
            “Organizar o presente para dar direção ao futuro.”
          </blockquote>

          <div className={styles.storyTags}>
            <span>Identidade brasileira</span>
            <span>Clareza</span>
            <span>Construção</span>
            <span>Longo prazo</span>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.finalBird}>
          <img
            src="/brand/aureum-ararinha.png"
            alt=""
            aria-hidden="true"
          />
        </div>
        <div>
          <span className={styles.sectionKicker}>A PRÓXIMA ERA</span>
          <h2>Chegou a hora de elevar sua vida financeira.</h2>
          <p>
            Menos improviso. Mais ordem. Mais clareza para construir o que vem
            depois.
          </p>
        </div>
        <Link className={styles.primaryButton} href="/cadastrar">
          Começar no AUREUM <span aria-hidden="true">→</span>
        </Link>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <img
            src="/brand/aureum-ararinha.png"
            alt=""
            aria-hidden="true"
          />
          <div>
            <strong>AUREUM</strong>
            <small>AMOR • ORDO • PROGRESSUS</small>
          </div>
        </div>

        <p>Organização financeira para pessoas, casais e famílias.</p>

        <div className={styles.footerLinks}>
          <Link href="/demonstracao">Demonstração</Link>
          <Link href="/entrar">Entrar</Link>
        </div>
      </footer>
    </main>
  );
}
