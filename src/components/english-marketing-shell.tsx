import Link from "next/link";
import type { ReactNode } from "react";
import {
  LanguageMenu,
  type LanguageRoute,
} from "@/components/language-menu";
import type { EnglishLocale } from "@/i18n/locales";
import { localePrefix } from "@/i18n/locales";
import { getEnglishCopy } from "@/i18n/english-copy";
import { SiteFooter } from "@/components/site-footer";
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
  const t = getEnglishCopy(locale);
  const prefix = localePrefix(locale);
  const languageRoute: LanguageRoute =
    active === "resources"
      ? "resources"
      : active === "for-whom"
        ? "for-whom"
        : active === "security"
          ? "security"
          : active === "about"
            ? "about"
            : active === "love"
              ? "love"
              : active === "order"
                ? "order"
                : active === "progress"
                  ? "progress"
                  : "home";

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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <Link href={`${prefix}/demo`}>{t.common.demo}</Link>
            <LanguageMenu currentLocale={locale} route={languageRoute} />
          </span>
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


      {children}

      <SiteFooter locale={locale} />
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
