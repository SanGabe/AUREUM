import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { createClient } from "@/lib/supabase/server";
import styles from "@/components/account-page.module.css";

export const metadata = {
  title: "Informações pessoais | AUREUM",
};

type Props = {
  searchParams: Promise<{
    household?: string;
    month?: string;
  }>;
};

export default async function ProfilePage({
  searchParams,
}: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar?next=/perfil");

  const params = await searchParams;
  const dashboardParams = new URLSearchParams();

  if (params.household) {
    dashboardParams.set(
      "household",
      params.household,
    );
  }

  if (params.month) {
    dashboardParams.set("month", params.month);
  }

  const query = dashboardParams.toString();

  const returnUrl = query
    ? `/dashboard?${query}`
    : "/dashboard";

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
    "Usuário";

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.logo} href="/">
          <img
            src="/brand/aureum-logo-motto-hq.png"
            alt="AUREUM"
          />
        </Link>

        <Link
          className={styles.back}
          href={returnUrl}
        >
          ← Voltar ao dashboard
        </Link>
      </header>

      <section className={styles.content}>
        <p className={styles.eyebrow}>CONTA</p>
        <h1>Informações pessoais.</h1>
        <p className={styles.lead}>
          Dados de identificação, contato, endereço e
          foto da sua conta AUREUM. Eles são
          independentes dos Núcleos dos quais você
          participa.
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
            locale="pt-BR"
            userId={user.id}
          />
        </div>
      </section>
    </main>
  );
}
