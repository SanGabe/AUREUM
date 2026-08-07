import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding-form";
import { createClient } from "@/lib/supabase/server";
import styles from "./onboarding.module.css";

export const metadata = {
  title: "Primeiros passos | AUREUM",
};

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar?next=/onboarding");
  }

  const { data: existingMembership, error } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Erro ao verificar household do usuário:", error);
  }

  if (existingMembership) {
    redirect("/dashboard");
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <header className={styles.brandHeader}>
          <img
            className={styles.logo}
            src="/brand/aureum-monogram.png"
            alt="AUREUM"
          />
          <div>
            <span className={styles.brand}>AUREUM</span>
            <span className={styles.motto}>AMOR • ORDO • PROGRESSUS</span>
          </div>
        </header>

        <div className={styles.copy}>
          <span className={styles.eyebrow}>PRIMEIROS PASSOS</span>
          <h1>Crie seu espaço financeiro.</h1>
          <p>
            Este é o ambiente onde contas, cartões, transações, metas e membros
            ficarão organizados.
          </p>
        </div>

        <OnboardingForm userId={user.id} />
      </section>
    </main>
  );
}
