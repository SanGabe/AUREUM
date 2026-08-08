import Link from "next/link";
import type { ReactNode } from "react";
import type { EnglishLocale } from "@/i18n/locales";
import { localePrefix } from "@/i18n/locales";
import { getEnglishCopy } from "@/i18n/english-copy";
import styles from "./marketing.module.css";

type Active =
  | "resources"
  | "for-whom"
  | "security"
  | "about"
  | "love"
  | "order"
  | "progress";

export function EnglishMarketingShell({
  children,
  active,
  locale,
}: {
  children: ReactNode;
  active?: Active;
  locale: EnglishLocale;
}) {
  const year = new Date().getFullYear();
  const t = getEnglishCopy(locale);
  const prefix = localePrefix(locale);

  return (
    <main className={styles.page} lang={locale}>
      <header className={styles.header}>
        <Link className={styles.logo} href={prefix} aria-label="AUREUM">
          <img src="/brand/aureum-logo-hq.png" alt="AUREUM" />
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link className={active === "resources" ? styles.active : ""} href={`${prefix}/resources`}>{t.common.resources}</Link>
          <Link className={active === "for-whom" ? styles.active : ""} href={`${prefix}/for-whom`}>{t.common.forWhom}</Link>
          <Link className={active === "security" ? styles.active : ""} href={`${prefix}/security`}>{t.common.security}</Link>
          <Link className={active === "about" ? styles.active : ""} href={`${prefix}/about`}>{t.common.about}</Link>
          <Link href={`${prefix}/demo`}>{t.common.demo}</Link>
        </nav>

        <div className={styles.headerActions}>
          <Link className={styles.primarySmall} href={`${prefix}/sign-up`}>
            {t.common.createAccount}
          </Link>
          <Link className={styles.secondarySmall} href={`${prefix}/sign-in`}>
            {t.common.signIn}
          </Link>
        </div>
      </header>

      <div style={{ width: "min(1320px,calc(100% - 64px))", margin: "0 auto", display: "flex", justifyContent: "flex-end", gap: 8, fontSize: 11 }}>
        <Link href="/" style={{ color: "#8294ad" }}>PT-BR</Link>
        <span style={{ color: "#42546e" }}>•</span>
        <Link href="/en-us" style={{ color: locale === "en-US" ? "#e4aa32" : "#8294ad" }}>EN-US</Link>
        <span style={{ color: "#42546e" }}>•</span>
        <Link href="/en-gb" style={{ color: locale === "en-GB" ? "#e4aa32" : "#8294ad" }}>EN-GB</Link>
      </div>

      {children}

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Link href={prefix} aria-label="AUREUM home">
              <img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM — Amor, Ordo, Progressus" />
            </Link>
            <p>Your unified finance app.</p>
            <span>AMOR • ORDO • PROGRESSUS</span>
          </div>

          <div className={styles.footerColumn}>
            <strong>Product</strong>
            <Link href={`${prefix}/resources`}>Features</Link>
            <Link href={`${prefix}/for-whom`}>Who it is for</Link>
            <Link href={`${prefix}/demo`}>Demo</Link>
          </div>

          <div className={styles.footerColumn}>
            <strong>Company</strong>
            <Link href={`${prefix}/about`}>About</Link>
            <Link href={`${prefix}/security`}>Security</Link>
            <Link href={`${prefix}/sign-up`}>Create account</Link>
          </div>

          <div className={styles.footerColumn}>
            <strong>Brand</strong>
            <Link href={`${prefix}/love`}>Amor</Link>
            <Link href={`${prefix}/order`}>Ordo</Link>
            <Link href={`${prefix}/progress`}>Progressus</Link>
          </div>

          <div className={styles.footerSocial}>
            <strong>Follow us</strong>
            <div>
              <span>◎</span>
              <span>▶</span>
              <span>in</span>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {year} AUREUM. All rights reserved.</p>
          <div>
            <span>Privacy</span>
            <span>Terms of use</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

export function EnglishPageHero({
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
        <img
          src={asset ?? "/brand/aureum-emblem-hq.png"}
          alt=""
          style={asset === "/brand/aureum-seal.png" ? { borderRadius: "50%", clipPath: "circle(50%)", objectFit: "cover" } : undefined}
        />
      </div>
    </section>
  );
}

export function EnglishCTA({
  locale,
}: {
  locale: EnglishLocale;
}) {
  const prefix = localePrefix(locale);

  return (
    <section className={styles.cta}>
      <div>
        <p className={styles.eyebrow}>AUREUM</p>
        <h2>It is time to elevate your financial life.</h2>
        <p>Organise the present so the future has direction.</p>
      </div>
      <Link className={styles.primaryButton} href={`${prefix}/sign-up`}>
        Create my account <span>→</span>
      </Link>
    </section>
  );
}

export { styles as englishMarketingStyles };
