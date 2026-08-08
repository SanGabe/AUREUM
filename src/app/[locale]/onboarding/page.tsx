import { notFound, redirect } from "next/navigation";
import { EnglishOnboardingForm } from "@/components/english-onboarding-form";
import { createClient } from "@/lib/supabase/server";
import { getEnglishCopy } from "@/i18n/english-copy";
import { localePrefix, parseEnglishLocale } from "@/i18n/locales";
import styles from "@/app/onboarding/onboarding.module.css";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);
  if (!locale) notFound();

  const prefix = localePrefix(locale);
  const t = getEnglishCopy(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`${prefix}/sign-in?next=${encodeURIComponent(`${prefix}/onboarding`)}`);

  const { data: membership } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (membership) redirect(`${prefix}/dashboard`);

  const { data: pending } = await supabase
    .from("household_join_requests")
    .select("id, household_id, status, created_at")
    .eq("requester_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let pendingNucleusName: string | null = null;

  if (pending?.household_id) {
    const { data: nucleus } = await supabase
      .from("households")
      .select("name")
      .eq("id", pending.household_id)
      .maybeSingle();

    pendingNucleusName = nucleus?.name ?? null;
  }

  return (
    <main className={styles.shell} lang={locale}>
      <section className={styles.card}>
        <header className={styles.brandHeader}>
          <img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM" />
        </header>

        <div className={styles.copy}>
          <span className={styles.eyebrow}>{t.onboarding.eyebrow}</span>
          <h1>{t.onboarding.title}</h1>
          <p>{t.onboarding.intro}</p>
        </div>

        <EnglishOnboardingForm
          locale={locale}
          pendingRequest={
            pending
              ? {
                  id: pending.id,
                  householdName: pendingNucleusName,
                }
              : null
          }
          userId={user.id}
        />
      </section>

      <img className={styles.bird} src="/brand/aureum-footer-bird.svg" alt="" aria-hidden="true" />
    </main>
  );
}
