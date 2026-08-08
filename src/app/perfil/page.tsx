import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { createClient } from "@/lib/supabase/server";
import styles from "@/components/account-page.module.css";

export const metadata = { title: "Informações pessoais | AUREUM" };

type Props = {
  searchParams: Promise<{
    household?: string;
    month?: string;
  }>;
};

export default async function ProfilePage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar?next=/perfil");

  const params = await searchParams;
  const dashboardParams = new URLSearchParams();

  if (params.household) dashboardParams.set("household", params.household);
  if (params.month) dashboardParams.set("month", params.month);

  const returnUrl = dashboardParams.size
    ? `/dashboard?${dashboardParams.toString()}`
    : "/dashboard";

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
    "Usuário";

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.logo} href="/">
          <img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM" />
        </Link>
        <Link className={styles.back} href={returnUrl}>
          ← Voltar ao dashboard
        </Link>
      </header>

      <section className={styles.content}>
        <p className={styles.eyebrow}>CONTA</p>
        <h1>Informações pessoais.</h1>
        <p className={styles.lead}>
          Estes dados identificam sua conta AUREUM e são independentes dos
          Núcleos dos quais você participa.
        </p>

        <div className={styles.card}>
          <ProfileForm
            email={user.email ?? ""}
            initialName={fullName}
            userId={user.id}
            locale="pt-BR"
          />
        </div>
      </section>
    </main>
  );
}
