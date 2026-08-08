import Link from "next/link";
import type { AppLocale, EnglishLocale } from "@/i18n/locales";
import { localePrefix } from "@/i18n/locales";
import styles from "./dashboard-view.module.css";

export type FinanceSection =
  | "dashboard"
  | "transactions"
  | "categories"
  | "goals"
  | "accounts"
  | "investments"
  | "exchange-rates"
  | "approvals";

const PT_PATHS: Record<FinanceSection, string> = {
  dashboard: "/dashboard",
  transactions: "/transacoes",
  categories: "/categorias",
  goals: "/metas",
  accounts: "/contas",
  investments: "/investimentos",
  "exchange-rates": "/cotacoes",
  approvals: "/aprovacoes",
};

const EN_PATHS: Record<FinanceSection, string> = {
  dashboard: "/dashboard",
  transactions: "/transactions",
  categories: "/categories",
  goals: "/goals",
  accounts: "/accounts",
  investments: "/investments",
  "exchange-rates": "/exchange-rates",
  approvals: "/approvals",
};

const PT_DEMO_PATHS: Record<FinanceSection, string> = {
  dashboard: "/demonstracao",
  transactions: "/demonstracao/transacoes",
  categories: "/demonstracao/categorias",
  goals: "/demonstracao/metas",
  accounts: "/demonstracao/contas",
  investments: "/demonstracao/investimentos",
  "exchange-rates": "/demonstracao/cotacoes",
  approvals: "/demonstracao/aprovacoes",
};

const EN_DEMO_PATHS: Record<FinanceSection, string> = {
  dashboard: "/demo",
  transactions: "/demo/transactions",
  categories: "/demo/categories",
  goals: "/demo/goals",
  accounts: "/demo/accounts",
  investments: "/demo/investments",
  "exchange-rates": "/demo/exchange-rates",
  approvals: "/demo/approvals",
};

export const FINANCE_SECTIONS: FinanceSection[] = [
  "dashboard",
  "transactions",
  "categories",
  "goals",
  "accounts",
  "investments",
  "exchange-rates",
  "approvals",
];

export function financeSectionPath(
  section: FinanceSection,
  locale: AppLocale,
) {
  if (locale === "pt-BR") return PT_PATHS[section];
  return `${localePrefix(locale as EnglishLocale)}${EN_PATHS[section]}`;
}

export function demoFinanceSectionPath(
  section: FinanceSection,
  locale: AppLocale,
) {
  if (locale === "pt-BR") return PT_DEMO_PATHS[section];
  return `${localePrefix(locale as EnglishLocale)}${EN_DEMO_PATHS[section]}`;
}

export function joinNucleusPath(locale: AppLocale) {
  if (locale === "pt-BR") return "/nucleos/adicionar";
  return `${localePrefix(locale as EnglishLocale)}/nuclei/join`;
}

export function financeSectionLabel(
  section: FinanceSection,
  locale: AppLocale,
) {
  const pt = locale === "pt-BR";
  const labels: Record<FinanceSection, [string, string]> = {
    dashboard: ["Resumo", "Overview"],
    transactions: ["Transações", "Transactions"],
    categories: ["Categorias", "Categories"],
    goals: ["Metas", "Goals"],
    accounts: ["Contas & Bancos", "Accounts & Banks"],
    investments: ["Investimentos", "Investments"],
    "exchange-rates": ["Cotações", "Exchange rates"],
    approvals: ["Aprovações", "Approvals"],
  };
  return pt ? labels[section][0] : labels[section][1];
}

export const FINANCE_ICONS: Record<FinanceSection, string> = {
  dashboard: "◫",
  transactions: "↕",
  categories: "◌",
  goals: "◎",
  accounts: "▤",
  investments: "↗",
  "exchange-rates": "¤",
  approvals: "✓",
};

export function FinanceNavigation({
  active,
  householdId,
  locale,
  month,
  demo = false,
}: {
  active: FinanceSection;
  householdId?: string;
  locale: AppLocale;
  month?: string;
  demo?: boolean;
}) {
  const query = new URLSearchParams();

  if (!demo) {
    if (householdId) query.set("household", householdId);
    if (month) query.set("month", month);
  }

  const suffix =
    !demo && query.toString()
      ? `?${query.toString()}`
      : "";

  return (
    <nav className={styles.sidebarNav}>
      {FINANCE_SECTIONS.map((section) => (
        <Link
          className={
            active === section ? styles.activeLink : ""
          }
          href={
            demo
              ? demoFinanceSectionPath(section, locale)
              : `${financeSectionPath(section, locale)}${suffix}`
          }
          key={section}
        >
          <span>{FINANCE_ICONS[section]}</span>
          {financeSectionLabel(section, locale)}
        </Link>
      ))}
    </nav>
  );
}
