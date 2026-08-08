import Link from "next/link";
import { notFound } from "next/navigation";
import { EnglishAuthForm } from "@/components/english-auth-form";
import { getEnglishCopy } from "@/i18n/english-copy";
import { localePrefix, parseEnglishLocale } from "@/i18n/locales";
import styles from "@/components/auth.module.css";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; erro?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);
  if (!locale) notFound();

  const query = await searchParams;
  const t = getEnglishCopy(locale);
  const prefix = localePrefix(locale);

  const redirectTo =
    query.next?.startsWith("/") && !query.next.startsWith("//")
      ? query.next
      : `${prefix}/dashboard`;

  const initialError =
    query.erro === "confirmacao"
      ? "We could not confirm your email. Please try again."
      : undefined;

  return (
    <main className={styles.shell} lang={locale}>
      <section className={styles.brandPanel}>
        <Link href={prefix} className={styles.brandLogo}>
          <img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM" />
        </Link>

        <div className={styles.brandCopy}>
          <p className={styles.eyebrow}>{t.auth.signInEyebrow}</p>
          <h2>{t.auth.signInBrandTitle}</h2>
          <p>{t.auth.signInBrandText}</p>
        </div>

        <img className={styles.authBird} src="/brand/aureum-footer-bird.svg" alt="" aria-hidden="true" />
      </section>

      <section className={styles.formPanel}>
        <div className={styles.card}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>SIGN IN</p>
            <h1>{t.auth.signInTitle}</h1>
            <p>{t.auth.signInIntro}</p>
          </header>

          <EnglishAuthForm
            initialError={initialError}
            locale={locale}
            mode="signin"
            redirectTo={redirectTo}
          />

          <p className={styles.footer}>
            {t.auth.noAccount} <Link href={`${prefix}/sign-up`}>{t.common.createAccount}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
