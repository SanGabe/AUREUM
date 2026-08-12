import Link from "next/link";
import type { ReactNode } from "react";
import {
  LanguageMenu,
  type LanguageRoute,
} from "@/components/language-menu";
import { ThemeHeaderSelect } from "@/components/theme-selector";
import { SiteFooter } from "@/components/site-footer";
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
  const languageRoute: LanguageRoute =
    active === "recursos"
      ? "resources"
      : active === "para-quem"
        ? "for-whom"
        : active === "seguranca"
          ? "security"
          : active === "sobre-nos"
            ? "about"
            : active === "amor"
              ? "love"
              : active === "ordo"
                ? "order"
                : active === "progressus"
                  ? "progress"
                  : "home";

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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <Link href="/demonstracao">Demonstração</Link>
            <LanguageMenu currentLocale="pt-BR" route={languageRoute} />
          </span>
        </nav>

        <div className={styles.headerActions}>
          <ThemeHeaderSelect locale="pt-BR" />
          <Link className={styles.primarySmall} href="/cadastrar">Criar minha conta</Link>
          <Link className={styles.secondarySmall} href="/entrar">Entrar</Link>
        </div>
      </header>

      {children}

      <SiteFooter />
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
