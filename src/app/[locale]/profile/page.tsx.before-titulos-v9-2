import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { createClient } from "@/lib/supabase/server";
import {
  localePrefix,
  parseEnglishLocale,
} from "@/i18n/locales";
import styles from "@/components/account-page.module.css";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    household?: string;
    month?: string;
  }>;
};

export default async function Page({
  params,
  searchParams,
}: Props) {
  const { locale: segment } = await params;
  const locale = parseEnglishLocale(segment);

  if (!locale) notFound();

  const prefix = localePrefix(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `${prefix}/sign-in?next=${encodeURIComponent(
        `${prefix}/profile`,
      )}`,
    );
  }

  const queryParams = await searchParams;
  const dashboardParams = new URLSearchParams();

  if (queryParams.household) {
    dashboardParams.set(
      "household",
      queryParams.household,
    );
  }

  if (queryParams.month) {
    dashboardParams.set(
      "month",
      queryParams.month,
    );
  }

  const query = dashboardParams.toString();

  const returnUrl = query
    ? `${prefix}/dashboard?${query}`
    : `${prefix}/dashboard`;

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, avatar_path, date_of_birth, cpf, cpf_verified_at, phone_country_iso, phone_country_code, phone_area_code, phone_number, address_country_code, address_postal_code, address_state, address_city, address_district, address_street, address_number, address_complement",
    )
    .eq("id", user.id)
    .maybeSingle();

  const fullName =
    profile?.full_name ||
    (typeof user.user_metadata?.full_name ===
    "string"
      ? user.user_metadata.full_name
      : user.email?.split("@")[0]) ||
    "User";

  return (
    <main className={styles.page} lang={locale}>
      <header className={styles.header}>
        <Link
          className={styles.logo}
          href={prefix}
        >
          <img
            src="/brand/aureum-logo-motto-hq.png"
            alt="AUREUM"
          />
        </Link>

        <Link
          className={styles.back}
          href={returnUrl}
        >
          ← Back to dashboard
        </Link>
      </header>

      <section className={styles.content}>
        <p className={styles.eyebrow}>ACCOUNT</p>
        <h1>Personal information.</h1>
        <p className={styles.lead}>
          Identification, contact, address and
          profile photo for your AUREUM account,
          independently of the Nuclei you join.
        </p>

        <div className={styles.card}>
          <ProfileForm
            email={user.email ?? ""}
            initial={{
              fullName,
              avatarPath:
                profile?.avatar_path ?? null,
              dateOfBirth:
                profile?.date_of_birth ?? null,
              cpf: profile?.cpf ?? null,
              cpfVerifiedAt:
                profile?.cpf_verified_at ?? null,
              phoneCountryIso:
                profile?.phone_country_iso ?? "BR",
              phoneCountryCode:
                profile?.phone_country_code ?? "+55",
              phoneAreaCode:
                profile?.phone_area_code ?? null,
              phoneNumber:
                profile?.phone_number ?? null,
              addressCountryCode:
                profile?.address_country_code ??
                "BR",
              addressPostalCode:
                profile?.address_postal_code ??
                null,
              addressState:
                profile?.address_state ?? null,
              addressCity:
                profile?.address_city ?? null,
              addressDistrict:
                profile?.address_district ?? null,
              addressStreet:
                profile?.address_street ?? null,
              addressNumber:
                profile?.address_number ?? null,
              addressComplement:
                profile?.address_complement ??
                null,
            }}
            locale={locale}
            userId={user.id}
          />
        </div>
      </section>
    </main>
  );
}
