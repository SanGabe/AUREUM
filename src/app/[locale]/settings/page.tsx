export const metadata = { title: "Settings" };

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings-form";
import { createClient } from "@/lib/supabase/server";
import { getEnglishCopy } from "@/i18n/english-copy";
import { localeDefaultCurrency, localePrefix, parseEnglishLocale } from "@/i18n/locales";
import styles from "@/components/account-page.module.css";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ household?: string; month?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);
  if (!locale) notFound();

  const prefix = localePrefix(locale);
  const t = getEnglishCopy(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`${prefix}/sign-in?next=${encodeURIComponent(`${prefix}/settings`)}`);

  const query = await searchParams;
  const dashboardParams = new URLSearchParams();
  if (query.household) dashboardParams.set("household", query.household);
  if (query.month) dashboardParams.set("month", query.month);

  const returnUrl = dashboardParams.size
    ? `${prefix}/dashboard?${dashboardParams.toString()}`
    : `${prefix}/dashboard`;

  const { data: profile } = await supabase
    .from("profiles")
    .select("locale, default_currency")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className={styles.page} lang={locale}>
      <header className={styles.header}>
        <Link className={styles.logo} href={prefix}>
          <img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM" />
        </Link>
        <Link className={styles.back} href={returnUrl}>
          ← {t.common.backDashboard}
        </Link>
      </header>

      <section className={styles.content}>
        <p className={styles.eyebrow}>{t.account.settingsEyebrow}</p>
        <h1>{t.account.settingsTitle}</h1>
        <p className={styles.lead}>{t.account.settingsLead}</p>

        <div className={styles.card}>
          <SettingsForm
            initialCurrency={profile?.default_currency ?? localeDefaultCurrency(locale)}
            initialLocale={profile?.locale ?? locale}
            locale={locale}
            userId={user.id}
          />
        </div>
      </section>
    </main>
  );
}
