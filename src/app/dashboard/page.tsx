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

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : user.email?.split("@")[0] ?? "Usuário";

  return (
    <DashboardView
      demo={false}
      showLogout
      userName={fullName}
      userSubtitle="Conta pessoal"
    />
  );
}
