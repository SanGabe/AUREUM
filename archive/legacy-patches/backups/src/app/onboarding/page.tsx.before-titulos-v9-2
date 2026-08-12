import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding-form";
import { createClient } from "@/lib/supabase/server";
import styles from "./onboarding.module.css";

export const metadata = { title: "Primeiros passos | AUREUM" };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar?next=/onboarding");

  const { data: membership } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (membership) redirect("/dashboard");

  const { data: pending } = await supabase
    .from("household_join_requests")
    .select("id, household_id, status, created_at")
    .eq("requester_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let pendingHouseholdName: string | null = null;

  if (pending?.household_id) {
    const { data: household } = await supabase
      .from("households")
      .select("name")
      .eq("id", pending.household_id)
      .maybeSingle();

    pendingHouseholdName = household?.name ?? null;
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <header className={styles.brandHeader}>
          <img src="/brand/aureum-logo-motto-hq.png" alt="AUREUM" />
        </header>

        <div className={styles.copy}>
          <span className={styles.eyebrow}>PRIMEIROS PASSOS</span>
          <h1>Como você quer começar?</h1>
          <p>
            Crie seu próprio Núcleo financeiro ou entre em um Núcleo que já
            existe usando o código AUREUM enviado pelo proprietário.
          </p>
        </div>

        <OnboardingForm
          pendingRequest={
            pending
              ? {
                  id: pending.id,
                  householdName: pendingHouseholdName,
                }
              : null
          }
          userId={user.id}
        />
      </section>

      <img
        className={styles.bird}
        src="/brand/aureum-footer-bird.svg"
        alt=""
        aria-hidden="true"
      />
    </main>
  );
}
