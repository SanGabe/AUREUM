import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./marketing.module.css";

type Active =
  | "recursos"
  | "para-quem"
  | "seguranca"
  | "sobre-nos"
  | "amor"
  | "ordo"
  | "progressus";

export function MarketingShell({
  children,
  active,
}: {
  children: ReactNode;
  active?: Active;
}) {
  const year = new Date().getFullYear();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.logo} href="/" aria-label="AUREUM">
          <img src="/brand/aureum-logo-hq.png" alt="AUREUM" />
        </Link>

        <nav className={styles.nav} aria-label="Navegação principal">
          <Link className={active === "recursos" ? styles.active : ""} href="/recursos">Recursos</Link>
          <Link className={active === "para-quem" ? styles.active : ""} href="/para-quem">Para quem</Link>
          <Link className={active === "seguranca" ? styles.active : ""} href="/seguranca">Segurança</Link>
          <Link className={active === "sobre-nos" ? styles.active : ""} href="/sobre-nos">Sobre nós</Link>
          <Link href="/demonstracao">Demonstração</Link>
        </nav>

        <div className={styles.headerActions}>
          <Link className={styles.primarySmall} href="/cadastrar">Criar minha conta</Link>
          <Link className={styles.secondarySmall} href="/entrar">Entrar</Link>
        </div>
      </header>

      {children}

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Link href="/" aria-label="Página inicial do AUREUM">
              <img
                src="/brand/aureum-logo-motto-hq.png"
                alt="AUREUM — Amor, Ordo, Progressus"
              />
            </Link>
            <p>Seu app de finanças unificado.</p>
            <span>O valor do AU. O poder de UM.</span>
          </div>

          <div className={styles.footerColumn}>
            <strong>Produto</strong>
            <Link href="/recursos">Recursos</Link>
            <Link href="/para-quem">Para quem</Link>
            <Link href="/demonstracao">Demonstração</Link>
          </div>

          <div className={styles.footerColumn}>
            <strong>Empresa</strong>
            <Link href="/sobre-nos">Sobre nós</Link>
            <Link href="/seguranca">Segurança</Link>
            <Link href="/cadastrar">Criar conta</Link>
          </div>

          <div className={styles.footerColumn}>
            <strong>Marca</strong>
            <Link href="/amor">Amor</Link>
            <Link href="/ordo">Ordo</Link>
            <Link href="/progressus">Progressus</Link>
          </div>

          <div className={styles.footerSocial}>
            <strong>Siga-nos</strong>
            <div>
              <a href="#" aria-label="Instagram">◎</a>
              <a href="#" aria-label="YouTube">▶</a>
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {year} AUREUM. Todos os direitos reservados.</p>
          <div>
            <span>Privacidade</span>
            <span>Termos de uso</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  asset,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  asset?: string;
  children?: ReactNode;
}) {
  return (
    <section className={styles.hero}>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.heroText}>{description}</p>
        {children}
      </div>
      <div className={styles.heroVisual} aria-hidden="true">
        <span />
        <span />
        <img src={asset ?? "/brand/aureum-emblem-hq.png"} alt="" />
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className={styles.cta}>
      <div>
        <p className={styles.eyebrow}>AUREUM</p>
        <h2>Chegou a hora de elevar sua vida financeira.</h2>
        <p>Organize o presente para dar direção ao futuro.</p>
      </div>
      <Link className={styles.primaryButton} href="/cadastrar">Criar minha conta <span>→</span></Link>
    </section>
  );
}

export { styles as marketingStyles };
