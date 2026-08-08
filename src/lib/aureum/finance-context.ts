import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppLocale, EnglishLocale } from "@/i18n/locales";
import { localePrefix } from "@/i18n/locales";

export type FinanceQuery = {
  household?: string;
  month?: string;
};

export type MembershipRole =
  | "owner"
  | "admin"
  | "financial_contributor"
  | "viewer";

export type FinanceNucleus = {
  id: string;
  name: string;
  default_currency: string;
  type: string;
  country_code: string;
};

export type FinanceContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: {
    id: string;
    email?: string;
  };
  userName: string;
  locale: AppLocale;
  selectedMonth: string;
  nucleus: FinanceNucleus;
  nuclei: FinanceNucleus[];
  role: MembershipRole;
  memberships: { household_id: string; role: MembershipRole }[];
};

export function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function normalizeMonth(value?: string) {
  if (!value || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    return currentMonth();
  }

  const year = Number(value.slice(0, 4));
  if (year < 2000 || year > 2200) return currentMonth();
  return value;
}

export function monthBounds(value: string) {
  const [year, month] = value.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  return {
    start: start.toISOString(),
    end: end.toISOString(),
    date: `${value}-01`,
  };
}

export function roleLabel(role: MembershipRole, locale: AppLocale) {
  if (locale === "pt-BR") {
    if (role === "owner") return "Proprietário";
    if (role === "admin") return "Administrador";
    if (role === "financial_contributor") return "Colaborador Financeiro";
    return "Membro";
  }

  if (role === "owner") return "Owner";
  if (role === "admin") return "Administrator";
  if (role === "financial_contributor") return "Financial Contributor";
  return "Member";
}

function prefix(locale: AppLocale) {
  return locale === "pt-BR"
    ? ""
    : localePrefix(locale as EnglishLocale);
}

export async function resolveFinanceContext(
  locale: AppLocale,
  query: FinanceQuery,
): Promise<FinanceContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const signIn =
      locale === "pt-BR"
        ? "/entrar"
        : `${prefix(locale)}/sign-in`;
    redirect(signIn);
  }

  const { data: membershipsRaw } = await supabase
    .from("household_members")
    .select("household_id, role")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true });

  const memberships = (membershipsRaw ?? []) as {
    household_id: string;
    role: MembershipRole;
  }[];

  if (!memberships.length) {
    redirect(
      locale === "pt-BR"
        ? "/onboarding"
        : `${prefix(locale)}/onboarding`,
    );
  }

  const ids = memberships.map((item) => item.household_id);

  const { data: nucleusRows } = await supabase
    .from("households")
    .select("id, name, default_currency, type, country_code")
    .in("id", ids);

  const nuclei = (nucleusRows ?? []) as FinanceNucleus[];

  if (!nuclei.length) {
    redirect(
      locale === "pt-BR"
        ? "/onboarding"
        : `${prefix(locale)}/onboarding`,
    );
  }

  const nucleus =
    (query.household && ids.includes(query.household)
      ? nuclei.find((item) => item.id === query.household)
      : null) ?? nuclei[0];

  const role =
    memberships.find((item) => item.household_id === nucleus.id)?.role ??
    "viewer";

  const userName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : user.email?.split("@")[0] ?? (locale === "pt-BR" ? "Usuário" : "User");

  return {
    supabase,
    user: {
      id: user.id,
      email: user.email,
    },
    userName,
    locale,
    selectedMonth: normalizeMonth(query.month),
    nucleus,
    nuclei,
    role,
    memberships,
  };
}

export function isManager(role: MembershipRole) {
  return role === "owner" || role === "admin";
}
