import Link from "next/link";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings-form";
import { createClient } from "@/lib/supabase/server";
import styles from "@/components/account-page.module.css";

export const metadata = { title: "Configurações" };

type Props = {
  searchParams: Promise<{
    household?: string;
    month?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar?next=/configuracoes");

  const params = await searchParams;
  const dashboardParams = new URLSearchParams();

  if (params.household) dashboardParams.set("household", params.household);
  if (params.month) dashboardParams.set("month", params.month);

  const returnUrl = dashboardParams.size
    ? `/dashboard?${dashboardParams.toString()}`
    : "/dashboard";

  const { data: profile } = await supabase
    .from("profiles")
    .select("locale, default_currency")
    .eq("id", user.id)
    .maybeSingle();

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
        <p className={styles.eyebrow}>PREFERÊNCIAS</p>
        <h1>Configurações.</h1>
        <p className={styles.lead}>
          Ajuste as preferências da sua conta. Configurações específicas de cada
          Núcleo continuam separadas.
        </p>

        <div className={styles.card}>
          <SettingsForm
            initialCurrency={profile?.default_currency ?? "BRL"}
            initialLocale={profile?.locale ?? "pt-BR"}
            userId={user.id}
            locale="pt-BR"
          />
        </div>
      </section>
    </main>
  );
}
