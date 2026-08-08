import Link from "next/link";
import { notFound } from "next/navigation";
import { EnglishAuthForm } from "@/components/english-auth-form";
import { getEnglishCopy } from "@/i18n/english-copy";
import {
  localePrefix,
  parseEnglishLocale,
} from "@/i18n/locales";
import styles from "@/components/auth.module.css";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);

  if (!locale) notFound();

  const t = getEnglishCopy(locale);
  const prefix = localePrefix(locale);

  return (
    <main className={`${styles.shell} ${styles.signupShell}`} lang={locale}>
      <section className={styles.brandPanel}>
        <Link
          href={prefix}
          className={styles.brandLogo}
        >
          <img
            src="/brand/aureum-logo-motto-hq.png"
            alt="AUREUM"
          />
        </Link>

        <div className={styles.brandCopy}>
          <p className={styles.eyebrow}>
            {t.auth.signUpEyebrow}
          </p>
          <h2>{t.auth.signUpBrandTitle}</h2>
          <p>{t.auth.signUpBrandText}</p>
        </div>

        <img
          className={styles.authBird}
          src="/brand/aureum-footer-bird.svg"
          alt=""
          aria-hidden="true"
        />
      </section>

      <section className={styles.formPanel}>
        <div
          className={`${styles.card} ${styles.signupCard}`}
        >
          <header className={styles.header}>
            <p className={styles.eyebrow}>
              CREATE ACCOUNT
            </p>
            <h1>{t.auth.signUpTitle}</h1>
            <p>
              Start with your identity and contact
              details. Your financial structure comes
              next.
            </p>
          </header>

          <EnglishAuthForm
            locale={locale}
            mode="signup"
          />

          <p className={styles.footer}>
            {t.auth.already}{" "}
            <Link href={`${prefix}/sign-in`}>
              {t.common.signIn}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
