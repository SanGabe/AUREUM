import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard-view";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard",
};

type Household = {
  id: string;
  name: string;
  type: string;
  default_currency: string;
  country_code: string;
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

  let household: Household | null = null;
  let role: string | null = membership?.role ?? null;

  if (membership?.household_id) {
    const { data, error } = await supabase
      .from("households")
      .select("id, name, type, default_currency, country_code")
      .eq("id", membership.household_id)
      .maybeSingle();

    if (!error) {
      household = data;
    } else {
      console.error("Erro ao carregar Household:", error);
    }
  }

  // Fallback importante: se o vínculo estiver faltando/indisponível,
  // tenta recuperar uma Household criada pelo próprio usuário.
  if (!household) {
    const { data: ownedHousehold, error: ownedError } = await supabase
      .from("households")
      .select("id, name, type, default_currency, country_code")
      .eq("created_by", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!ownedError && ownedHousehold) {
      household = ownedHousehold;
      role = "owner";
    } else if (ownedError) {
      console.error("Erro ao recuperar Household do proprietário:", ownedError);
    }
  }

  if (membershipError) {
    console.error("Erro ao carregar vínculo financeiro:", membershipError);
  }

  // Só envia ao onboarding quando de fato não existe espaço acessível.
  if (!household) {
    redirect("/onboarding");
  }

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : user.email?.split("@")[0] ?? "Usuário";

  const roleLabel =
    role === "owner"
      ? "Proprietário"
      : role === "admin"
        ? "Administrador"
        : role === "financial_contributor"
          ? "Colaborador Financeiro"
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
