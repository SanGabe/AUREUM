import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { createClient } from "@/lib/supabase/server";
import { getEnglishCopy } from "@/i18n/english-copy";
import { localePrefix, parseEnglishLocale } from "@/i18n/locales";
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

  if (!user) redirect(`${prefix}/sign-in?next=${encodeURIComponent(`${prefix}/profile`)}`);

  const query = await searchParams;
  const dashboardParams = new URLSearchParams();
  if (query.household) dashboardParams.set("household", query.household);
  if (query.month) dashboardParams.set("month", query.month);

  const returnUrl = dashboardParams.size
    ? `${prefix}/dashboard?${dashboardParams.toString()}`
    : `${prefix}/dashboard`;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const fullName =
    profile?.full_name ||
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : user.email?.split("@")[0]) ||
    "User";

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
        <p className={styles.eyebrow}>{t.account.profileEyebrow}</p>
        <h1>{t.account.profileTitle}</h1>
        <p className={styles.lead}>{t.account.profileLead}</p>

        <div className={styles.card}>
          <ProfileForm
            email={user.email ?? ""}
            initialName={fullName}
            locale={locale}
            userId={user.id}
          />
        </div>
      </section>
    </main>
  );
}
