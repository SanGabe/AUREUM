import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard-view";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard | AUREUM",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar?next=/dashboard");
  }

  const { data: membership, error: membershipError } = await supabase
    .from("household_members")
    .select("household_id, role")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    console.error("Erro ao carregar vínculo financeiro:", membershipError);
  }

  if (!membership) {
    redirect("/onboarding");
  }

  const { data: household, error: householdError } = await supabase
    .from("households")
    .select("id, name, type, default_currency, country_code")
    .eq("id", membership.household_id)
    .single();

  if (householdError || !household) {
    console.error("Erro ao carregar household:", householdError);
    redirect("/onboarding");
  }

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : user.email?.split("@")[0] ?? "Usuário";

  const roleLabel =
    membership.role === "owner"
      ? "Proprietário"
      : membership.role === "admin"
        ? "Administrador"
        : membership.role === "viewer"
          ? "Visualizador"
          : "Membro";

  return (
    <DashboardView
      demo={false}
      showLogout
      userName={fullName}
      userSubtitle={`${household.name} • ${roleLabel}`}
    />
  );
}
